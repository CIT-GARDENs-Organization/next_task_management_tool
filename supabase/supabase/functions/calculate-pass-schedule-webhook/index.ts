import {createClient} from "jsr:@supabase/supabase-js@2";
import {
  twoline2satrec,
  propagate,
  gstime,
  eciToGeodetic,
  ecfToLookAngles,
  geodeticToEcf,
} from "https://esm.sh/satellite.js@5.0.0";

function radiansToDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}

function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// GeoNames APIを呼び出し国名を取得
async function fetchCountryFromGeoNames(
  lat: number,
  lon: number
): Promise<string | null> {
  const username = Deno.env.get("GEONAMES_USERNAME"); // GeoNames APIのユーザー名
  const url = `http://api.geonames.org/countryCodeJSON?lat=${lat}&lng=${lon}&username=${username}`;

  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();

      return data.countryName || null;
    } else {
      console.error(
        `Error fetching country from GeoNames: ${response.statusText}`
      );
      return null;
    }
  } catch (error) {
    console.error(`Fetch error: ${error.message}`);
    return null;
  }
}

// 衛星の通過スケジュールを計算する関数
async function calculatePassScheduleWithCountries(
  tle: {line1: string; line2: string},
  groundStationLocation: {lat: number; lon: number}
) {
  const satrec = twoline2satrec(tle.line1, tle.line2);

  const groundStation = {
    latitude: degreesToRadians(groundStationLocation.lat),
    longitude: degreesToRadians(groundStationLocation.lon),
    height: 0,
  };

  const startTime = new Date();
  const endTime = new Date(startTime.getTime() + 14 * 24 * 60 * 60 * 1000); // 1日後

  const passes = [];
  let time = startTime;
  let isPassActive = false;
  let currentPassStartTime = null;
  let maxElevation = 0;
  let startAzimuth = null;
  const countries = new Set<string>();
  const countryFetchPromises = [];

  while (time <= endTime) {
    const positionAndVelocity = propagate(satrec, time);

    if (
      positionAndVelocity &&
      typeof positionAndVelocity.position !== "boolean"
    ) {
      const positionEci = positionAndVelocity.position;
      const gmst = gstime(time);
      const positionGd = eciToGeodetic(positionEci, gmst);

      const positionEcf = geodeticToEcf(positionGd);
      const azEl = ecfToLookAngles(groundStation, positionEcf);

      const elevation = radiansToDegrees(azEl.elevation);
      const azimuth = radiansToDegrees(azEl.azimuth);

      // 必ず日本をリストに追加
      countries.add("Japan");

      // 仰角が0度を超える場合は可視
      if (elevation > 0) {
        if (!isPassActive) {
          isPassActive = true;
          currentPassStartTime = time;
          startAzimuth = azimuth;
          maxElevation = elevation;
        } else {
          if (elevation > maxElevation) {
            maxElevation = elevation;
          }
        }
      } else if (isPassActive) {
        // 衛星が不可視になった場合の処理
        isPassActive = false;

        // 並列処理された国情報の取得を待つ
        await Promise.all(countryFetchPromises);

        passes.push({
          pass_start_time: currentPassStartTime,
          pass_end_time: time,
          max_elevation: maxElevation,
          azimuth_start: startAzimuth,
          azimuth_end: azimuth,
          countries: Array.from(countries),
        });
        countries.clear();
        countries.add("Japan"); // 次のパスのために日本をリセット
        countryFetchPromises.length = 0;
      }

      // 仰角が-20度以下の場合、5分間隔でAPI呼び出し
      if (elevation <= -20) {
        const fetchCountryPromise = fetchCountryFromGeoNames(
          radiansToDegrees(positionGd.latitude),
          radiansToDegrees(positionGd.longitude)
        ).then((country) => {
          if (country) {
            countries.add(country);
          }
        });

        // API呼び出しをPromiseに追加して並列処理
        countryFetchPromises.push(fetchCountryPromise);

        time = new Date(time.getTime() + 5 * 60 * 1000); // 5分ごとに時間を進める
      } else {
        time = new Date(time.getTime() + 1000); // 1秒ごとに時間を進める
      }
    }
  }

  // 最後のパス処理を行う際に残っている非同期タスクを待つ
  await Promise.all(countryFetchPromises);

  return passes;
}

function calculateTimeDifferenceInMinutes(date1: Date, date2: Date): number {
  return Math.abs((date1.getTime() - date2.getTime()) / (1000 * 60));
}

Deno.serve(async (req) => {
  const payload = await req.json();
  const record = payload.record;

  console.log(record);

  if (record && record.content) {
    const tleLines = record.content.trim().split("\n");
    if (tleLines.length === 3) {
      const tle = {
        line1: tleLines[1].trim(),
        line2: tleLines[2].trim(),
      };

      try {
        // Supabaseクライアントの作成
        const supabase = createClient(
          Deno.env.get("SUPABASE_URL") ?? "",
          Deno.env.get("SUPABASE_ANON_KEY") ?? "",
          {
            global: {
              headers: {Authorization: req.headers.get("Authorization")!},
            },
          }
        );

        // TLEが更新されているか確認
        const {data: existingSchedule, error: fetchError} = await supabase
          .from("satellite_schedule")
          .select("*")
          .eq("satellite_id", record.satellite_id);

        if (fetchError) {
          console.error(`Error fetching schedule: ${fetchError.message}`);
          return new Response(JSON.stringify({error: fetchError.message}), {
            status: 400,
          });
        }

        const tleUpdatedAt = record.created_at
          ? new Date(record.created_at)
          : null;
        const lastTleUpdatedAt = existingSchedule?.[0]?.tle_updated_at
          ? new Date(existingSchedule[0].tle_updated_at)
          : null;

        console.log(tleUpdatedAt);
        console.log(lastTleUpdatedAt);

        // lastTleUpdatedAtがnullの場合も、新規追加とみなして処理
        if (
          !lastTleUpdatedAt ||
          (tleUpdatedAt && tleUpdatedAt > lastTleUpdatedAt)
        ) {
          // TLEが更新されている場合、または既存のデータがない場合の処理
          console.log("new tle or no existing data detected");

          const groundStationLocation = {
            lat: 35.68826575760112,
            lon: 140.02027051128135,
          };

          // TLEを解析し、衛星の通過スケジュールを計算
          const passSchedules = await calculatePassScheduleWithCountries(
            tle,
            groundStationLocation
          );

          for (const newSchedule of passSchedules) {
            let scheduleToUpdate = null;

            // newScheduleの各要素がnullでないかチェック
            if (
              newSchedule.pass_start_time &&
              newSchedule.pass_end_time &&
              newSchedule.max_elevation !== undefined &&
              newSchedule.azimuth_start !== undefined &&
              newSchedule.azimuth_end !== undefined
            ) {
              // 既存のスケジュールとの比較
              for (const existing of existingSchedule) {
                const existingPassStartTime = new Date(
                  existing.pass_start_time
                );
                const existingPassEndTime = new Date(existing.pass_end_time);

                // 通過開始時間か終了時間が±30分以内なら同じスケジュールとみなす
                const startDiff = calculateTimeDifferenceInMinutes(
                  existingPassStartTime,
                  newSchedule.pass_start_time
                );
                const endDiff = calculateTimeDifferenceInMinutes(
                  existingPassEndTime,
                  newSchedule.pass_start_time
                );

                if (startDiff <= 30 || endDiff <= 30) {
                  scheduleToUpdate = existing;
                  console.log("scheduleToUpdate = existing");
                  break;
                }
              }

              if (scheduleToUpdate) {
                // スケジュールを更新
                console.log(
                  `Updating existing schedule: ${scheduleToUpdate.id}`
                );
                const {error: updateError} = await supabase
                  .from("satellite_schedule")
                  .update({
                    pass_start_time: newSchedule.pass_start_time.toISOString(),
                    pass_end_time: newSchedule.pass_end_time.toISOString(),
                    max_elevation: newSchedule.max_elevation,
                    azimuth_start: newSchedule.azimuth_start,
                    azimuth_end: newSchedule.azimuth_end,
                    country: newSchedule.countries,
                    tle_updated_at: tleUpdatedAt
                      ? tleUpdatedAt.toISOString()
                      : null, // null チェックを追加
                    updates_count: (scheduleToUpdate.updates_count || 0) + 1, // 更新回数を1増やす
                  })
                  .eq("id", scheduleToUpdate.id);

                if (updateError) {
                  console.error(
                    `Error updating satellite schedule: ${updateError.message}`
                  );
                  return new Response(
                    JSON.stringify({error: updateError.message}),
                    {
                      status: 400,
                    }
                  );
                }
              } else {
                // 新しいスケジュールを挿入
                console.log("Inserting new schedule");
                const {error: insertError} = await supabase
                  .from("satellite_schedule")
                  .insert({
                    satellite_id: record.satellite_id,
                    name: record.name,
                    pass_start_time: newSchedule.pass_start_time.toISOString(),
                    pass_end_time: newSchedule.pass_end_time.toISOString(),
                    max_elevation: newSchedule.max_elevation,
                    azimuth_start: newSchedule.azimuth_start,
                    azimuth_end: newSchedule.azimuth_end,
                    country: newSchedule.countries,
                    tle_updated_at: tleUpdatedAt
                      ? tleUpdatedAt.toISOString()
                      : null, // null チェックを追加
                    updates_count: 0, // 新規作成時は0
                  });

                if (insertError) {
                  console.error(
                    `Error inserting new satellite schedule: ${insertError.message}`
                  );
                  return new Response(
                    JSON.stringify({error: insertError.message}),
                    {
                      status: 400,
                    }
                  );
                }
              }
            } else {
              console.error("newSchedule contains null or undefined elements");
            }
          }

          return new Response("Satellite schedule updated successfully", {
            status: 200,
          });
        }

        return new Response("TLE has not been updated.", {status: 200});
      } catch (error) {
        console.error(`Error: ${error.message}`);
        return new Response(`Error: ${error.message}`, {status: 500});
      }
    }
  }

  return new Response("Invalid TLE data.", {status: 400});
});
