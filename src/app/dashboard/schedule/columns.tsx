"use client";

import {ColumnDef} from "@tanstack/react-table";
import {ArrowUpDown, MoreHorizontal} from "lucide-react";

import {Database} from "@/types/supabase";

import {Button} from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";

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
    accessorKey: "name",
    header: "Satellite",
    cell: ({row}) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "pass_start_time",
    header: ({column}) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Start Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({row}) => (
      <div className="lowercase">
        {formatDate(row.getValue("pass_start_time"))}
      </div>
    ),
  },
  {
    accessorKey: "pass_end_time",
    header: "End Time",
    cell: ({row}) => (
      <div className="lowercase">
        {formatDate(row.getValue("pass_end_time"))}
      </div>
    ),
  },
  {
    accessorKey: "duration",
    header: "Duration",
    // row.getValue("pass_end_time") - row.getValue("pass_start_time") でfloat型の分数取得
    cell: ({row}) => {
      const start = new Date(row.getValue("pass_start_time")).getTime();
      const end = new Date(row.getValue("pass_end_time")).getTime();
      const duration = (end - start) / 1000 / 60;
      return <div>{duration.toFixed(2)} min</div>;
    },
  },
  {
    accessorKey: "max_elevation",
    header: "Max Elevation",
    cell: ({row}) => (
      <div>{(row.getValue("max_elevation") as number).toFixed(2)}°</div>
    ),
  },
  {
    accessorKey: "azimuth_start",
    header: "Azimuth Start",
    cell: ({row}) => (
      <div>{(row.getValue("azimuth_start") as number).toFixed(2)}°</div>
    ),
  },
  {
    accessorKey: "azimuth_end",
    header: "Azimuth End",
    cell: ({row}) => (
      <div>{(row.getValue("azimuth_end") as number).toFixed(2)}°</div>
    ),
  },
  {
    accessorKey: "updates_count",
    header: "Updates",
    cell: ({row}) => <div>{row.getValue("updates_count")}</div>,
  },
  {
    accessorKey: "tle_updated_at",
    header: "Status",
    //もしtle_updated_atが1日以上前ならば"Outdated"、そうでなければ"Updated"を表示 pass_end_timeが現在時刻より前ならば"Expired"を表示
    cell: ({row}) => {
      const tleUpdatedAt = new Date(row.getValue("tle_updated_at")).getTime();
      const now = new Date().getTime();
      const passEndTime = new Date(row.getValue("pass_end_time")).getTime();
      const oneDay = 1000 * 60 * 60 * 24;
      const isOutdated = now - tleUpdatedAt > oneDay;
      const isExpired = now > passEndTime;
      return (
        <Badge
          variant={
            isExpired ? "destructive" : isOutdated ? "outline" : "secondary"
          }
        >
          {isExpired ? "Expired" : isOutdated ? "Outdated" : "Updated"}
        </Badge>
      );
    },
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
