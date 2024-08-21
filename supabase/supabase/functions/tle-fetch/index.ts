import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import {createClient} from "jsr:@supabase/supabase-js@2";

Deno.serve(async (req) => {
  try {
    // Supabaseクライアントを作成
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {global: {headers: {Authorization: req.headers.get("Authorization")!}}}
    );

    // satellite_listテーブルから衛星リストを取得
    const {data: satellite_list_data, error: satellite_list_error} =
      await supabase.from("satellite_list").select("*");

    if (satellite_list_error) {
      return new Response(
        JSON.stringify({error: satellite_list_error.message}),
        {
          headers: {"Content-Type": "application/json"},
          status: 500,
        }
      );
    }

    // 衛星リストのtle_fetch_on: trueの衛星を抽出
    const satellites = satellite_list_data?.filter(
      (satellite: {tle_fetch_on: boolean}) => satellite.tle_fetch_on
    );

    console.log("TLE Fetch Satellites", {
      satellites,
    });

    // 衛星データを処理するための結果リスト
    const results = [];

    // 各衛星に対して処理ループ
    for (const satellite of satellites) {
      let status = "Error"; // デフォルトのステータス
      try {
        // 衛星のTLEデータを取得
        const response = await fetch(
          `https://celestrak.com/NORAD/elements/gp.php?CATNR=${satellite.norad_id}`
        );

        console.log("TLE Fetch Response", {
          status: response.status,
        });

        // responseがOKの場合
        if (response.ok) {
          // response.text()がNo GP data foundの場合
          const responseText = await response.text();
          if (responseText.includes("No GP data found")) {
            status = "Vanished";
          } else {
            status = "OK";
          }

          // satellite_listテーブルを更新
          const {data: update_data, error: update_error} = await supabase
            .from("satellite_list")
            .update({
              last_updated: new Date(),
              status: status,
            })
            .match({norad_id: satellite.norad_id});

          console.log("Satellite List Updated", {
            update_data,
          });

          if (update_error) {
            results.push({
              error: update_error.message,
              satellite: satellite.norad_id,
            });
            continue;
          }

          // tleテーブルにデータを追加
          const {data, error} = await supabase.from("tle").insert([
            {
              norad_id: satellite.norad_id,
              name: satellite.name,
              content: responseText,
            },
          ]);

          console.log("Data added", {
            data,
          });

          if (error) {
            results.push({error: error.message, satellite: satellite.norad_id});
          } else {
            results.push({status: "Success", satellite: satellite.norad_id});
          }
        } else {
          results.push({
            error: "TLE fetch failed",
            satellite: satellite.norad_id,
          });
        }
      } catch (error) {
        console.log("TLE Fetch Error", {
          error,
        });
        results.push({error: error.message, satellite: satellite.norad_id});
      }
    }

    // すべての衛星が処理された後でレスポンスを返す
    return new Response(
      JSON.stringify({
        message: `Processing complete.`,
        results: results,
      }),
      {
        headers: {"Content-Type": "application/json"},
        status: 200,
      }
    );
  } catch (_error) {
    return new Response(JSON.stringify({error: "Invalid request"}), {
      headers: {"Content-Type": "application/json"},
      status: 400,
    });
  }
});
