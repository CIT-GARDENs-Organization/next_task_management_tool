import {TableRow, TableCell} from "@/components/ui/table";

import {flexRender} from "@tanstack/react-table";

import {Sheet, SheetTrigger} from "@/components/ui/sheet";

import {RowSheetContent} from "@/components/RowSheetContent";

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
      <RowSheetContent row={row} />
    </Sheet>
  );
}
