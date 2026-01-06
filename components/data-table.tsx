"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import type { ReactNode } from "react"

interface Column<T> {
  id: keyof T | string
  header: string
  cell: (row: T) => ReactNode
  width?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
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
                <Checkbox checked={isAllSelected} onCheckedChange={handleSelectAll} aria-label="Select all rows" />
              </TableHead>
            )}
            {columns.map((column) => (
              <TableHead key={String(column.id)} style={{ width: column.width }}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length + (onSelectedRowsChange ? 1 : 0)}
                className="text-center py-8 text-muted-foreground"
              >
                No data available
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => (
              <TableRow key={String(row[rowKey as keyof T])}>
                {onSelectedRowsChange && (
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.has(String(row[rowKey as keyof T]))}
                      onCheckedChange={(checked) => handleSelectRow(Boolean(checked), String(row[rowKey as keyof T]))}
                    />
                  </TableCell>
                )}
                {columns.map((column) => (
                  <TableCell key={String(column.id)}>{column.cell(row)}</TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
