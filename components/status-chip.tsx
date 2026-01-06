import { cn } from "@/lib/utils"

interface StatusChipProps {
  status: "Active" | "Expired" | "Expiring Soon" | "Pending" | "Fulfilled" | "Overdue"
  className?: string
}

export function StatusChip({ status, className }: StatusChipProps) {
  const statusStyles: Record<string, string> = {
    Active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    "Expiring Soon": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    Expired: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    Pending: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    Fulfilled: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    Overdue: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-sm font-medium",
        statusStyles[status],
        className,
      )}
    >
      {status}
    </span>
  )
}
