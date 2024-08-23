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

export const columns: ColumnDef<
  Database["public"]["Tables"]["pass_schedule"]["Row"]
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
    accessorKey: "pass_id",
    header: "Pass-ID",
    cell: ({row}) => (
      <div className="capitalize">{row.getValue("pass_id")}</div>
    ),
  },
  {
    accessorKey: "satellite_name",
    header: "Satellite",
    cell: ({row}) => (
      <div className="capitalize">{row.getValue("satellite_name")}</div>
    ),
  },
  {
    accessorKey: "start_time",
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
      <div className="lowercase">{row.getValue("start_time")}</div>
    ),
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
            <DropdownMenuItem>変更する</DropdownMenuItem>
            <DropdownMenuItem>削除</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
