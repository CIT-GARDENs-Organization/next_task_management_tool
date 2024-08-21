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

    // 各衛星に対して処理ループ
    for (const satellite of satellites) {
      // 衛星のTLEデータを取得
      const response = await fetch(
        `https://celestrak.com/NORAD/elements/gp.php?CATNR=${satellite.norad_id}`
      );

      console.log("TLE Fetch Response", {
        status: response,
      });

      // TLEテーブルにデータを挿入
      // id, created_at, norad_id, name, content
      const {data, error} = await supabase.from("tle").insert([
        {
          norad_id: satellite.norad_id,
          name: satellite.name,
          content: await response.text(),
        },
      ]);

      console.log("Data added", {
        data,
      });

      if (error) {
        return new Response(JSON.stringify({error: error.message}), {
          headers: {"Content-Type": "application/json"},
          status: 500,
        });
      }
    }

    return new Response(
      JSON.stringify({
        message: `tle data added successfully.`,
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
