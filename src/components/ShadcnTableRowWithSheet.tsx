import {TableRow, TableCell} from "@/components/ui/table";

import {flexRender} from "@tanstack/react-table";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface ShadcnTableRowWithSheetProps {
  row: any;
}

export default function ShadcnTableRowWithSheet({
  row,
}: ShadcnTableRowWithSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <TableRow
          data-state={row.getIsSelected() && "selected"}
          className="cursor-pointer"
        >
          {row.getVisibleCells().map((cell: any) => (
            <TableCell key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          ))}
        </TableRow>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-2/3 sm:max-w-screen-lg">
        <SheetHeader>
          <SheetTitle>Row Details</SheetTitle>
          <SheetDescription>
            {/* Display row-specific details here */}
            {JSON.stringify(row.original, null, 2)}
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
