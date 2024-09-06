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

// 衛星の通過スケジュールを計算する関数
function calculatePassSchedule(
  tle: {line1: string; line2: string},
  groundStationLocation: {lat: number; lon: number}
) {
  const satrec = twoline2satrec(tle.line1, tle.line2);

  const groundStation = {
    latitude: degreesToRadians(groundStationLocation.lat),
    longitude: degreesToRadians(groundStationLocation.lon),
    height: 0,
  };

  const startTime = new Date(); // 計算開始時間
  const endTime = new Date(startTime.getTime() + 14 * 24 * 60 * 60 * 1000); // 2週間後の時間

  const passes = [];

  let time = startTime;
  let isPassActive = false;
  let currentPassStartTime = null;
  let maxElevation = 0;
  let startAzimuth = null;

  while (time <= endTime) {
    const positionAndVelocity = propagate(satrec, time);

    if (
      positionAndVelocity &&
      typeof positionAndVelocity.position !== "boolean"
    ) {
      const positionEci = positionAndVelocity.position;
      const gmst = gstime(time);
      const positionGd = eciToGeodetic(positionEci, gmst);

      // GeodeticLocationをECF座標に変換
      const positionEcf = geodeticToEcf(positionGd);

      const azEl = ecfToLookAngles(groundStation, positionEcf);

      const elevation = radiansToDegrees(azEl.elevation);
      const azimuth = radiansToDegrees(azEl.azimuth);

      if (elevation > 0) {
        // 衛星が地上局の可視範囲に入った場合
        if (!isPassActive) {
          // パスが始まった場合、開始時刻と開始方位角を記録
          isPassActive = true;
          currentPassStartTime = time;
          startAzimuth = azimuth;
          maxElevation = elevation; // 初期仰角を設定
        } else {
          // パス中、最大仰角を更新
          if (elevation > maxElevation) {
            maxElevation = elevation;
          }
        }
      } else if (isPassActive) {
        // 衛星が可視範囲から出た場合
        isPassActive = false;
        passes.push({
          pass_start_time: currentPassStartTime,
          pass_end_time: time, // 現在の時刻を終了時刻とする
          max_elevation: maxElevation,
          azimuth_start: startAzimuth,
          azimuth_end: azimuth, // 終了時の方位角を記録
        });
        currentPassStartTime = null;
        maxElevation = 0;
        startAzimuth = null;
      }

      // 仰角が-20度以下の場合は5分間隔、それ以外は1秒間隔に設定
      if (elevation <= -20) {
        time = new Date(time.getTime() + 5 * 60 * 1000); // 5分ごと
      } else {
        time = new Date(time.getTime() + 1000); // 1秒ごと
      }
    }
  }

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
          const passSchedules = calculatePassSchedule(
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
