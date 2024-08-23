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

import {Database} from "@/types/supabase";
import {columns} from "./columns";
import {DataTable} from "./data-table";

// Supabaseクライアントのセットアップ
const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// データフェッチ用の関数
const fetcher = async () => {
  const {data, error} = await supabase.from("pass_schedule").select("*");
  if (error) {
    throw new Error(error.message);
  }

  console.log(data);

  return data;
};

export default function Schedule() {
  const {data, error} = useSWR("pass_schedule", fetcher);

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
