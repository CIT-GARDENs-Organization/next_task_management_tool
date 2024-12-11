"use client";

import {ColumnDef} from "@tanstack/react-table";
import {ArrowUpDown, MoreHorizontal} from "lucide-react";

import {Database} from "@/types/supabase";

import {Button} from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";

import {createClient} from "@/utils/supabase/client";
import OperationCell from "@/components/OperationCell";

const supabase = createClient();

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {Badge} from "@/components/ui/badge";

// 日付フォーマット関数
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

export const columns: ColumnDef<
  Database["public"]["Tables"]["satellite_schedule"]["Row"]
>[] = [
  {
    id: "select",
    header: ({table}) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({row}) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",

    header: "ID",
    cell: ({row}) => <div>{row.getValue("id")}</div>,
  },
  {
    accessorKey: "aos_time",
    header: ({column}) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          パス開始時間
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({row}) => (
      <div className="lowercase">{formatDate(row.getValue("aos_time"))}</div>
    ),
  },
  {
    accessorKey: "los_time",
    header: "パス終了時間",
    cell: ({row}) => (
      <div className="lowercase">{formatDate(row.getValue("los_time"))}</div>
    ),
  },
  {
    accessorKey: "duration",
    header: "継続時間",
    // row.getValue("pass_end_time") - row.getValue("pass_start_time") でfloat型の分数取得
    cell: ({row}) => {
      const start = new Date(row.getValue("aos_time")).getTime();
      const end = new Date(row.getValue("los_time")).getTime();
      const duration = (end - start) / 1000 / 60;
      return <div>{duration.toFixed(2)} min</div>;
    },
  },
  {
    accessorKey: "max_elevation",
    header: "最大仰角",
    cell: ({row}) => (
      <div>{(row.getValue("max_elevation") as number).toFixed(2)}°</div>
    ),
  },
  {
    accessorKey: "aos_azimuth",
    header: "AOS方位角",
    cell: ({row}) => (
      <div>{(row.getValue("aos_azimuth") as number).toFixed(2)}°</div>
    ),
  },
  {
    accessorKey: "los_azimuth",
    header: "LOS方位角",
    cell: ({row}) => (
      <div>{(row.getValue("los_azimuth") as number).toFixed(2)}°</div>
    ),
  },
  {
    accessorKey: "updates_count",
    header: "更新回数",
    cell: ({row}) => <div>{row.getValue("updates_count")}</div>,
  },
  {
    accessorKey: "operations",
    header: "運用",
    cell: ({row}) => <OperationCell row={row} />,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({row}) => {
      const pass = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>削除</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
