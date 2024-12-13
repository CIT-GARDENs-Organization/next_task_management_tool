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
import {useEffect, useState} from "react";

const supabase = createClient();

// データフェッチ用の関数
const fetcher = async () => {
  const {data, error} = await supabase.from("satellite_schedule").select("*");
  if (error) {
    throw new Error(error.message);
  }

  console.log(data);

  return data;
};

// operationテーブルからstatusを取得するための関数
const operationFetcher = async (satelliteScheduleId: string) => {
  const {data, error} = await supabase
    .from("operation")
    .select("status")
    .eq("satellite_schedule_id", satelliteScheduleId)
    .single();

  if (error) {
    console.log(error);
    return null;
  }

  return data;
};

export default function Schedule() {
  const {data, error} = useSWR("satellite_schedule", fetcher);
  const [filteredRows, setFilteredRows] = useState<any[]>([]); // 型アノテーションを追加

  useEffect(() => {
    if (data) {
      const today = new Date();
      const filteredData = data.filter((row) => {
        if (!row.aos_time) {
          return false;
        }
        const passStartTime = new Date(row.aos_time);
        return passStartTime.setHours(0, 0, 0, 0) >= today.setHours(0, 0, 0, 0);
      });

      // operationテーブルのフィルタリング
      const filteredDataWithStatus = async () => {
        const results = await Promise.all(
          filteredData.map(async (row) => {
            const operationData = await operationFetcher(row.id);
            if (operationData && operationData.status === "operate") {
              return row;
            }
            return null;
          })
        );
        setFilteredRows(results.filter((row) => row !== null));
      };

      filteredDataWithStatus();
    }
  }, [data]); // dataが変更された時だけuseEffectを実行

  if (error) return <div>Error loading data...</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <main className="bg-neutral-50 w-full p-12 grid grid-cols-1 gap-8">
      <div className="max-w-screen-xl w-full mx-auto">
        <Card className="md:col-span-2 w-full">
          <CardHeader>
            <CardTitle className="text-xl">運用リスト</CardTitle>
            <CardDescription>運用のあるパス計画を表示します</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} data={filteredRows} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
