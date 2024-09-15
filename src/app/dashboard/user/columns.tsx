"use client";

import {ColumnDef} from "@tanstack/react-table";

import {Database} from "@/types/supabase";

// 日付フォーマット関数
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

export const columns: ColumnDef<
  Database["public"]["Tables"]["user_details"]["Row"]
>[] = [
  {
    accessorKey: "auth_id",
    header: "ID",
    cell: ({row}) => (
      <div className="capitalize">{row.getValue("auth_id")}</div>
    ),
  },
  {
    accessorKey: "last_name",
    header: "姓",
    cell: ({row}) => (
      <div className="capitalize">{row.getValue("last_name")}</div>
    ),
  },
  {
    accessorKey: "first_name",
    header: "名",
    cell: ({row}) => (
      <div className="capitalize">{row.getValue("first_name")}</div>
    ),
  },
  {
    accessorKey: "unit_no",
    header: "号機",
    cell: ({row}) => (
      <div className="capitalize">{row.getValue("unit_no")}</div>
    ),
  },
  {
    accessorKey: "created_at",
    header: "作成日",
    cell: ({row}) => (
      <div className="capitalize">{formatDate(row.getValue("created_at"))}</div>
    ),
  },
  {
    accessorKey: "updated_at",
    header: "更新日",
    cell: ({row}) => (
      <div className="capitalize">{formatDate(row.getValue("updated_at"))}</div>
    ),
  },
];
