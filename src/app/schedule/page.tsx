import useSWR from "swr";
import {createClient} from "@supabase/supabase-js";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {Payment, columns} from "./columns";
import {DataTable} from "./data-table";

async function getData(): Promise<Payment[]> {
  return [
    {
      id: "m5gr84i9",
      pass_id: "SKR-1",
      satellite: "SAKURA",
      start_time: "2022-01-01T00:00:00Z",
      manager: "太郎",
      sub_manager: "次郎",
    },
    {
      id: "m5gr84i9",
      pass_id: "SKR-2",
      satellite: "SAKURA",
      start_time: "2022-01-01T00:00:00Z",
      manager: "太郎",
      sub_manager: "次郎",
    },
    {
      id: "m5gr84i9",
      pass_id: "SKR-3",
      satellite: "SAKURA",
      start_time: "2022-01-01T00:00:00Z",
      manager: "太郎",
      sub_manager: "次郎",
    },
    {
      id: "m5gr84i9",
      pass_id: "YMG-1",
      satellite: "YOMOGI",
      start_time: "2022-01-01T00:00:00Z",
      manager: "太郎",
      sub_manager: "次郎",
    },
  ];
}

export default async function Schedule() {
  const data = await getData();

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
