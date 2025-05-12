import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  type Table as TTable,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "./button";
import { useState } from "react";
import { Skeleton } from "./skeleton";
import { observer } from "mobx-react-lite";
import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  showPagination?: boolean;
}

export const DataTable = observer(
  <TData, TValue>({
    columns,
    data,
    showPagination = true,
    onRowClick,
    getRowClassName,
    isFetching = false,
    cellClassNameOverrides,
  }: DataTableProps<TData, TValue> & {
    onRowClick?: (row: TData) => void;
    isFetching?: boolean;
    getRowClassName?: (row: TData) => string;
    cellClassNameOverrides?: {
      cell: string;
      getCellClassName: (row: TData) => string;
    }[];
  }) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      onSortingChange: setSorting,
      onColumnFiltersChange: setColumnFilters,
      getSortedRowModel: getSortedRowModel(),
      state: {
        sorting,
        columnFilters,
      },
    });

    return (
      <div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="border-x">
                        {header.isPlaceholder ? null : (
                          <div className="flex items-start">
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </div>
                        )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isFetching ? (
                <TableSkeletonRows table={table} rowCount={5} />
              ) : (
                <>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                        className={
                          getRowClassName
                            ? getRowClassName(row.original)
                            : undefined
                        }
                      >
                        {row.getVisibleCells().map((cell) => {
                          const classNameOverride =
                            cellClassNameOverrides?.find(
                              ({ cell: _cell }) => _cell === cell.column.id
                            );

                          const classNameOverrideString =
                            classNameOverride?.getCellClassName(row.original) ||
                            "";

                          return (
                            <TableCell
                              key={cell.id}
                              className={cn("border", classNameOverrideString)}
                              onClick={() =>
                                onRowClick && onRowClick(row.original)
                              }
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </>
              )}
            </TableBody>
          </Table>
        </div>
        {showPagination && (
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    );
  }
);

type TableSkeletonRowsProps<TData> = {
  table: TTable<TData>;
  rowCount?: number;
};

function TableSkeletonRows<TData>({
  table,
  rowCount = 3,
}: TableSkeletonRowsProps<TData>) {
  return (
    <>
      {[...Array(rowCount)].map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          {table.getAllColumns().map((_, colIndex) => (
            <TableCell key={colIndex}>
              <Skeleton className="h-5" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}
