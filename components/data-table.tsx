"use client"

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import type { ReactNode } from "react"

interface DataTableProps<T> {
  columns: ColumnDef<T>[]
  data: T[]
  selectedRows?: Set<string>
  onSelectedRowsChange?: (selected: Set<string>) => void
  rowKey: string
}

export function DataTable<T>({
  columns,
  data,
  selectedRows = new Set(),
  onSelectedRowsChange,
  rowKey,
}: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
  })

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const newSelected = new Set(data.map((row) => String(row[rowKey as keyof T])))
      onSelectedRowsChange?.(newSelected)
    } else {
      onSelectedRowsChange?.(new Set())
    }
  }

  const handleSelectRow = (checked: boolean, key: string) => {
    const newSelected = new Set(selectedRows)
    if (checked) {
      newSelected.add(key)
    } else {
      newSelected.delete(key)
    }
    onSelectedRowsChange?.(newSelected)
  }

  const isAllSelected = data.length > 0 && selectedRows.size === data.length

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted">
            {onSelectedRowsChange && (
              <TableHead className="w-12">
                <Checkbox 
                  checked={isAllSelected} 
                  onCheckedChange={handleSelectAll} 
                  aria-label="Select all rows" 
                />
              </TableHead>
            )}
            {table.getFlatHeaders().map((header) => (
              <TableHead key={header.id} style={{ width: header.getSize() }}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {onSelectedRowsChange && (
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.has(String(row.original[rowKey as keyof T]))}
                      onCheckedChange={(checked) => handleSelectRow(Boolean(checked), String(row.original[rowKey as keyof T]))}
                    />
                  </TableCell>
                )}
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length + (onSelectedRowsChange ? 1 : 0)}
                className="text-center py-8 text-muted-foreground"
              >
                No data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
