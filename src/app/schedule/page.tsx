"use client";
import useSWR from "swr";
import {createClient} from "@supabase/supabase-js";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {Database} from "@/types/supabase";

// Supabaseクライアントのセットアップ
const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// データフェッチ用の関数
const fetcher = async () => {
  const {data, error} = await supabase.from("satellite_list").select("*");
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

// UTCをJSTに変換する関数
const convertUTCToJST = (utcDateString: string) => {
  const utcDate = new Date(utcDateString);
  const jstOffset = 9 * 60;
  const jstDate = new Date(utcDate.getTime() + jstOffset * 60 * 1000);
  return jstDate.toISOString().replace("T", " ").replace("Z", "");
};

export default function Schedule() {
  const {data: satelliteList, error} = useSWR("satellite_list", fetcher);

  if (error) return <div>Error loading data...</div>;
  if (!satelliteList) return <div>Loading...</div>;

  return (
    <main className="bg-neutral-50 w-full p-12 grid grid-cols-1 gap-8">
      <div className="max-w-screen-xl w-full mx-auto">
        <Card className="md:col-span-2 w-full">
          <CardHeader>
            <CardTitle className="text-xl">TLE取得設定</CardTitle>
            <CardDescription>
              NORADからTLEを取得する衛星を設定します
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">NORAD ID</TableHead>
                  <TableHead>Satellite</TableHead>
                  <TableHead>Enabled</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {satelliteList.map((satellite) => (
                  <TableRow key={satellite.id}>
                    <TableCell>{satellite.norad_id}</TableCell>
                    <TableCell>{satellite.name}</TableCell>
                    <TableCell>
                      {satellite.tle_fetch_on ? "ON" : "OFF"}
                    </TableCell>
                    <TableCell>
                      {convertUTCToJST(satellite.last_updated!)} JST
                    </TableCell>
                    <TableCell>{satellite.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
