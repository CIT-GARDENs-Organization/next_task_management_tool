"use client";
import useSWR from "swr";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {columns} from "./columns";
import {DataTable} from "./data-table";
import {createClient} from "@/utils/supabase/client";

const supabase = createClient();

// データフェッチ用の関数
const fetcher = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayISO = today.toISOString();

  // 今日よりも後の日付のデータを取得
  const {data, error} = await supabase
    .from("satellite_schedule")
    .select("*")
    .gte("aos", todayISO);

  if (error) {
    throw new Error(error.message);
  }

  console.log(data);

  return data;
};

export default function Schedule() {
  const {data, error} = useSWR("satellite_schedule", fetcher);

  if (error) return <div>Error loading data...</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <main className="bg-neutral-50 w-full p-12 grid grid-cols-1 gap-8">
      <div className="max-w-screen-xl w-full mx-auto">
        <Card className="md:col-span-2 w-full">
          <CardHeader>
            <CardTitle className="text-xl">パス計画の作成</CardTitle>
            <CardDescription>各パスでの運用計画を作成します</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} data={data} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
