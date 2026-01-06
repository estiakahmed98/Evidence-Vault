"use client"

import { Suspense, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusChip } from "@/components/status-chip"
import { Modal } from "@/components/modal"
import { DataTable } from "@/components/data-table"
import { Skeleton } from "@/components/ui/skeleton"
import { buyerRequestsData, evidenceVaultData, type BuyerRequest } from "@/lib/mock-data"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ChevronLeft } from "lucide-react"

function RequestsSkeletonLoader() {
  return (
    <main className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Skeleton className="h-8 w-24 mb-4" />
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="w-8 h-8" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
              <Skeleton className="h-8 w-20 mb-2" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>

        <Card className="border border-slate-200 bg-white shadow-lg">
          <CardHeader className="border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Skeleton className="w-6 h-6" />
              <Skeleton className="h-6 w-32" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-4 flex-1" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-20" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

function RequestsContent() {
  const [requests, setRequests] = useState(buyerRequestsData)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null)
  const [fulfillMode, setFulfillMode] = useState<"existing" | "new">("existing")
  const [selectedEvidence, setSelectedEvidence] = useState<string>("")

  const selectedRequest = requests.find((r) => r.id === selectedRequestId)
  const statusCounts = requests.reduce<Record<string, number>>((acc, req) => {
    acc[req.status] = (acc[req.status] ?? 0) + 1
    return acc
  }, {})
  const totalRequests = requests.length
  const fulfilledCount = statusCounts["Fulfilled"] ?? 0
  const completionRate = totalRequests ? Math.round((fulfilledCount / totalRequests) * 100) : 0
  const nextDueRequest =
    requests.length === 0
      ? null
      : requests.reduce<BuyerRequest | null>((closest, req) => {
          if (!closest) return req
          return new Date(req.dueDate) < new Date(closest.dueDate) ? req : closest
        }, null)
  const heroHighlights = [
    {
      label: "Fulfillment Rate",
      value: `${completionRate}%`,
      description: `${fulfilledCount} of ${totalRequests} fulfilled`,
    },
    {
      label: "Pending Requests",
      value: statusCounts["Pending"] ?? 0,
      description: "Need review",
    },
    {
      label: "Overdue",
      value: statusCounts["Overdue"] ?? 0,
      description: "Needs escalation",
    },
    {
      label: "Next Due",
      value: nextDueRequest ? new Date(nextDueRequest.dueDate).toLocaleDateString() : "N/A",
      description: nextDueRequest ? nextDueRequest.docType : "No active tasks",
    },
  ]

  const handleFulfill = () => {
    if (!selectedRequestId) return

    setRequests((prev) => prev.map((req) => (req.id === selectedRequestId ? { ...req, status: "Fulfilled" } : req)))

    setIsModalOpen(false)
    setSelectedRequestId(null)
    setFulfillMode("existing")
    setSelectedEvidence("")
  }

  const openFulfillModal = (requestId: string) => {
    setSelectedRequestId(requestId)
    setIsModalOpen(true)
  }

  const columns = [
    {
      id: "docType",
      header: "Document Type",
      cell: (row: BuyerRequest) => row.docType,
    },
    {
      id: "dueDate",
      header: "Due Date",
      cell: (row: BuyerRequest) => new Date(row.dueDate).toLocaleDateString(),
    },
    {
      id: "status",
      header: "Status",
      cell: (row: BuyerRequest) => <StatusChip status={row.status} />,
    },
    {
      id: "actions",
      header: "Actions",
      cell: (row: BuyerRequest) =>
        row.status !== "Fulfilled" ? (
          <Button variant="outline" size="sm" onClick={() => openFulfillModal(row.id)}>
            Fulfill
          </Button>
        ) : (
          <span className="text-sm text-muted-foreground">Completed</span>
        ),
    },
  ]

  const relevantEvidence = selectedRequest ? evidenceVaultData.filter((e) => e.type === selectedRequest.docType) : []

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50">
      <div className="p-8">
        <section className="relative mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-linear-to-br from-white via-blue-50 to-indigo-50 p-8 shadow-lg">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <Link href="/">
                <Button variant="ghost" className="gap-2 mb-4 text-slate-700">
                  <ChevronLeft className="w-4 h-4" />
                  Back to Home
                </Button>
              </Link>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-600">Evidence Vault</p>
              <h1 className="text-4xl font-semibold text-slate-900 sm:text-5xl">Buyer Requests</h1>
              <p className="mt-2 max-w-2xl text-base text-slate-600">
                Surface every buyer request, understand where things stand today, and accelerate fulfillment with
                vault.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" size="sm">
                New Request
              </Button>
              <Button variant="outline" size="sm" className="border-slate-300 text-slate-700">
                View Vault
              </Button>
            </div>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {heroHighlights.map((highlight) => (
              <div key={highlight.label} className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-600">{highlight.label}</p>
                <p className="text-3xl font-semibold text-slate-900">{highlight.value}</p>
                <p className="text-sm text-slate-600">{highlight.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8 grid gap-6 lg:grid-cols-[3fr,2fr]">
          <Card className="border border-slate-200 bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-slate-900">Pending Requests</CardTitle>
              <CardDescription className="text-slate-600">All active buyer document requests</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-700">
              <DataTable columns={columns} data={requests} rowKey="id" />
            </CardContent>
          </Card>

          <Card className="border border-slate-200 bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-slate-900">Vault Snapshot</CardTitle>
              <CardDescription className="text-slate-600">Fast glance at evidence you can link</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-700">
              {evidenceVaultData.slice(0, 3).map((evidence) => (
                <div key={evidence.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-600">{evidence.type}</p>
                    <p className="text-base font-semibold text-slate-900">{evidence.name}</p>
                    <p className="text-xs text-slate-600">Updated {new Date(evidence.lastUpdated).toLocaleDateString()}</p>
                  </div>
                  <span className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-green-700">
                    {evidence.status}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <Modal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          title="Fulfill Request"
          description={selectedRequest ? `Fulfill request for ${selectedRequest.docType}` : undefined}
          submitLabel="Submit"
          onSubmit={handleFulfill}
        >
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium mb-3 block">How would you like to fulfill this request?</Label>
              <RadioGroup value={fulfillMode} onValueChange={(value) => setFulfillMode(value as "existing" | "new")}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="existing" id="existing" />
                  <Label htmlFor="existing" className="font-medium cursor-pointer">
                    Select existing evidence from vault
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="new" id="new" />
                  <Label htmlFor="new" className="font-medium cursor-pointer">
                    Create new mock evidence
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {fulfillMode === "existing" && (
              <div>
                <Label htmlFor="evidence-select" className="text-sm font-medium">
                  Select Evidence
                </Label>
                <Select value={selectedEvidence} onValueChange={setSelectedEvidence}>
                  <SelectTrigger id="evidence-select">
                    <SelectValue placeholder="Choose evidence..." />
                  </SelectTrigger>
                  <SelectContent>
                    {relevantEvidence.map((evidence) => (
                      <SelectItem key={evidence.id} value={evidence.id}>
                        {evidence.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {relevantEvidence.length === 0 && (
                  <p className="text-sm text-muted-foreground mt-2">No matching evidence found in vault</p>
                )}
              </div>
            )}

            {fulfillMode === "new" && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="new-doc-name" className="text-sm font-medium">
                    Document Name
                  </Label>
                  <input
                    id="new-doc-name"
                    type="text"
                    placeholder="Enter document name..."
                    className="w-full px-3 py-2 border border-input rounded-md text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="new-doc-notes" className="text-sm font-medium">
                    Notes
                  </Label>
                  <Textarea id="new-doc-notes" placeholder="Enter notes..." rows={3} />
                </div>
              </div>
            )}
          </div>
        </Modal>
      </div>
    </main>
  )
}

export default function RequestsPage() {
  return (
    <Suspense fallback={<RequestsSkeletonLoader />}>
      <RequestsContent />
    </Suspense>
  )
}
