"use client";

import { Suspense, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { StatusChip } from "@/components/status-chip";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/modal";
import { Label } from "@/components/ui/label";
import { evidenceVaultData, type Evidence } from "@/lib/mock-data";
import { ChevronRight, Filter, FileText, Home, FolderPlus } from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";

function VaultSkeletonLoader() {
  return (
    <main className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Skeleton className="w-12 h-12 bg-linear-to-br from-blue-500 to-indigo-600 rounded-3xl" />
            <Skeleton className="h-10 w-48" />
          </div>
          <Skeleton className="h-5 w-96" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="w-10 h-10 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              <Skeleton className="h-8 w-24 mb-2" />
              <Skeleton className="h-4 w-32" />
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
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
            <div className="space-y-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center space-x-4 p-3 rounded-lg border border-slate-100"
                >
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 flex-1" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-16 rounded-lg" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function VaultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [isNewDocumentModalOpen, setIsNewDocumentModalOpen] = useState(false);
  const [newDocument, setNewDocument] = useState({
    name: "",
    type: "Certificate" as Evidence["type"],
    status: "Active" as Evidence["status"],
    expiryDate: "",
  });
  const [documents, setDocuments] = useState(evidenceVaultData);

  const docTypeFilter = searchParams.get("type") || "all";
  const statusFilter = searchParams.get("status") || "all";
  const expiryFilter = searchParams.get("expiry") || "all";
  const searchQuery = searchParams.get("search") || "";

  const filteredData = useMemo(() => {
    return documents.filter((item) => {
      const matchesType =
        docTypeFilter === "all" || item.type === docTypeFilter;
      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;
      const matchesSearch =
        searchQuery === "" ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase());

      let matchesExpiry = true;
      if (expiryFilter === "expired") {
        matchesExpiry = item.status === "Expired";
      } else if (expiryFilter === "expiring-soon") {
        matchesExpiry = item.status === "Expiring Soon";
      }

      return matchesType && matchesStatus && matchesSearch && matchesExpiry;
    });
  }, [docTypeFilter, statusFilter, expiryFilter, searchQuery, documents]);

  const handleAddNewDocument = () => {
    if (!newDocument.name || !newDocument.expiryDate) return;

    const document: Evidence = {
      id: Date.now().toString(),
      name: newDocument.name,
      type: newDocument.type,
      status: newDocument.status,
      expiryDate: newDocument.expiryDate,
      versionsCount: 1,
      lastUpdated: new Date().toISOString().split("T")[0],
    };

    setDocuments((prev) => [...prev, document]);
    setIsNewDocumentModalOpen(false);
    setNewDocument({
      name: "",
      type: "Certificate",
      status: "Active",
      expiryDate: "",
    });
  };

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === "all" || value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/vault?${params.toString()}`);
  };

  const columns: ColumnDef<Evidence>[] = [
    {
      accessorKey: "name",
      header: "Doc Name",
      cell: (row) => row.getValue(),
    },
    {
      accessorKey: "type",
      header: "Doc Type",
      cell: (row) => row.getValue(),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: (row) => (
        <StatusChip status={row.getValue() as Evidence["status"]} />
      ),
    },
    {
      accessorKey: "expiryDate",
      header: "Expiry Date",
      cell: (row) => new Date(row.getValue() as string).toLocaleDateString(),
    },
    {
      accessorKey: "versionsCount",
      header: "Versions",
      cell: (row) => row.getValue(),
    },
    {
      accessorKey: "lastUpdated",
      header: "Last Updated",
      cell: (row) => new Date(row.getValue() as string).toLocaleDateString(),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Link href={`/vault/${row.original.id}`}>
          <Button variant="ghost" size="sm" className="gap-1">
            View
            <ChevronRight className="w-4 h-4" />
          </Button>
        </Link>
      ),
    },
  ];

  const stats = useMemo(() => {
    const total = filteredData.length;
    const active = filteredData.filter(
      (item) => item.status === "Active"
    ).length;
    const expiring = filteredData.filter(
      (item) => item.status === "Expiring Soon"
    ).length;
    const expired = filteredData.filter(
      (item) => item.status === "Expired"
    ).length;

    return { total, active, expiring, expired };
  }, [filteredData]);

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50">
      <div className="p-8">
        <section className="mb-8 rounded-3xl border border-slate-200 bg-linear-to-br from-white via-blue-50 to-indigo-50 p-8 shadow-lg">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-blue-600">
                SentryLink Comply
              </p>
              <h1 className="mt-2 text-4xl font-semibold text-slate-900 sm:text-5xl">
                Evidence Vault
              </h1>
              <p className="mt-3 max-w-2xl text-base text-slate-600">
                Securely manage and organize your compliance documents and
                evidence across entire factory. Every record is centralized,
                traceable, and ready for next fulfillment plan.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="gap-2 text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 transition-colors duration-200"
              >
                <Link href="/">
                  <Home className="w-4 h-4" />
                  Back to Home
                </Link>
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="gap-2 text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 transition-colors duration-200"
                onClick={() => setIsNewDocumentModalOpen(true)}
              >
                <FolderPlus className="w-4 h-4" />
                Add New Document
              </Button>
            </div>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-blue-600">
                <span>Total Docs</span>
                <Badge
                  variant="secondary"
                  className="border border-blue-200 bg-blue-50 text-blue-700"
                >
                  Vault
                </Badge>
              </div>
              <p className="mt-3 text-3xl font-semibold text-slate-900">
                {stats.total}
              </p>
              <p className="text-sm text-slate-600">records monitored</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-green-600">
                <span>Active</span>
                <Badge
                  variant="secondary"
                  className="border border-green-200 bg-green-50 text-green-700"
                >
                  Status
                </Badge>
              </div>
              <p className="mt-3 text-3xl font-semibold text-slate-900">
                {stats.active}
              </p>
              <p className="text-sm text-slate-600">compliant</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-orange-600">
                <span>Expiring Soon</span>
                <Badge
                  variant="secondary"
                  className="border border-orange-200 bg-orange-50 text-orange-700"
                >
                  Alert
                </Badge>
              </div>
              <p className="mt-3 text-3xl font-semibold text-slate-900">
                {stats.expiring}
              </p>
              <p className="text-sm text-slate-600">needs attention</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-red-600">
                <span>Expired</span>
                <Badge
                  variant="secondary"
                  className="border border-red-200 bg-red-50 text-red-700"
                >
                  Action
                </Badge>
              </div>
              <p className="mt-3 text-3xl font-semibold text-slate-900">
                {stats.expired}
              </p>
              <p className="text-sm text-slate-600">requires review</p>
            </div>
          </div>
        </section>

        <Card className="mb-8 border border-slate-200 bg-white shadow-lg">
          <CardHeader className="border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-slate-600" />
              <CardTitle className="text-lg text-slate-900">
                Filters & Search
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Search
                </label>
                <Input
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => updateFilter("search", e.target.value)}
                  className="border-slate-300 bg-white text-slate-900 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <label className="text-sm font-semibold text-slate-700">
                    Document Type
                  </label>
                  <Select
                    value={docTypeFilter}
                    onValueChange={(value) => updateFilter("type", value)}
                  >
                    <SelectTrigger className="border-slate-300 bg-white text-slate-900">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Certificate">Certificate</SelectItem>
                      <SelectItem value="License">License</SelectItem>
                      <SelectItem value="Report">Report</SelectItem>
                      <SelectItem value="Document">Document</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700">
                    Status
                  </label>
                  <Select
                    value={statusFilter}
                    onValueChange={(value) => updateFilter("status", value)}
                  >
                    <SelectTrigger className="border-slate-300 bg-white text-slate-900">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Expiring Soon">
                        Expiring Soon
                      </SelectItem>
                      <SelectItem value="Expired">Expired</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Expiry
                </label>
                <Select
                  value={expiryFilter}
                  onValueChange={(value) => updateFilter("expiry", value)}
                >
                  <SelectTrigger className="border-slate-300 bg-white text-slate-900">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="expiring-soon">Expiring Soon</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col gap-2 border-t border-slate-200 pt-4 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
              <span>
                {selectedRows.size} document{selectedRows.size !== 1 ? "s" : ""}{" "}
                selected
              </span>
              <Button
                variant="outline"
                size="sm"
                className="border-slate-300 text-slate-700"
                disabled={selectedRows.size === 0}
              >
                Add to Pack ({selectedRows.size})
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 bg-white shadow-lg">
          <CardHeader className="border-b border-slate-200">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-slate-600" />
                <CardTitle className="text-lg text-slate-900">
                  Documents
                </CardTitle>
              </div>
              <Badge
                variant="secondary"
                className="border border-slate-300 bg-slate-100 text-slate-700"
              >
                {filteredData.length} items
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <DataTable
              columns={columns}
              data={filteredData}
              selectedRows={selectedRows}
              onSelectedRowsChange={setSelectedRows}
              rowKey="id"
            />
          </CardContent>
        </Card>

        <Modal
          open={isNewDocumentModalOpen}
          onOpenChange={setIsNewDocumentModalOpen}
          title="Add New Document"
          description="Add a new document to the evidence vault"
          submitLabel="Add Document"
          onSubmit={handleAddNewDocument}
        >
          <div className="space-y-6">
            <div>
              <Label htmlFor="doc-name" className="text-sm font-medium">
                Document Name
              </Label>
              <Input
                id="doc-name"
                type="text"
                value={newDocument.name}
                onChange={(e) =>
                  setNewDocument((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter document name..."
              />
            </div>

            <div>
              <Label htmlFor="doc-type" className="text-sm font-medium">
                Document Type
              </Label>
              <Select
                value={newDocument.type}
                onValueChange={(value) =>
                  setNewDocument((prev) => ({
                    ...prev,
                    type: value as Evidence["type"],
                  }))
                }
              >
                <SelectTrigger id="doc-type">
                  <SelectValue placeholder="Select document type..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Certificate">Certificate</SelectItem>
                  <SelectItem value="License">License</SelectItem>
                  <SelectItem value="Report">Report</SelectItem>
                  <SelectItem value="Document">Document</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="doc-status" className="text-sm font-medium">
                Status
              </Label>
              <Select
                value={newDocument.status}
                onValueChange={(value) =>
                  setNewDocument((prev) => ({
                    ...prev,
                    status: value as Evidence["status"],
                  }))
                }
              >
                <SelectTrigger id="doc-status">
                  <SelectValue placeholder="Select status..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Expiring Soon">Expiring Soon</SelectItem>
                  <SelectItem value="Expired">Expired</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="expiry-date" className="text-sm font-medium">
                Expiry Date
              </Label>
              <Input
                id="expiry-date"
                type="date"
                value={newDocument.expiryDate}
                onChange={(e) =>
                  setNewDocument((prev) => ({
                    ...prev,
                    expiryDate: e.target.value,
                  }))
                }
                placeholder="Select expiry date..."
              />
            </div>
          </div>
        </Modal>
      </div>
    </main>
  );
}

export default function VaultPage() {
  return (
    <Suspense fallback={<VaultSkeletonLoader />}>
      <VaultContent />
    </Suspense>
  );
}
