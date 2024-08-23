"use client";

import {ColumnDef} from "@tanstack/react-table";
import {ArrowUpDown, MoreHorizontal} from "lucide-react";

export type Payment = {
  id: string;
  pass_id: string;
  satellite: string;
  start_time: string;
  manager: string;
  sub_manager: string;
};

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

export const columns: ColumnDef<Payment>[] = [
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
    accessorKey: "satellite",
    header: "Satellite",
    cell: ({row}) => (
      <div className="capitalize">{row.getValue("satellite")}</div>
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
    accessorKey: "manager",
    header: "Manager",
    cell: ({row}) => (
      <div className="capitalize">{row.getValue("manager")}</div>
    ),
  },
  {
    accessorKey: "sub_manager",
    header: "SubManager",
    cell: ({row}) => (
      <div className="capitalize">{row.getValue("sub_manager")}</div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({row}) => {
      const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy Pass ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Update</DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
