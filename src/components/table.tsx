import { ColumnDef, Row, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";

import { TableBody, TableCell, TableHead, TableHeader, TableRow, Table as TableShad } from "@/components/ui/table";

interface TableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  onClickRow?: (row: Row<T>) => void;
  disabledRow?: boolean;
}

export default function Table<T>({ data, columns, onClickRow, disabledRow }: TableProps<T>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border w-max">
      <TableShad>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                onClick={() => (disabledRow ? {} : onClickRow ? onClickRow(row) : {})}
                className={`${disabledRow ? "cursor-not-allowed" : "cursor-pointer"} hover:opacity-90`}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </TableShad>
    </div>
  );
}
