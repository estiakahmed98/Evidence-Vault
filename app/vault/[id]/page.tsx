"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StatusChip } from "@/components/status-chip";
import { Modal } from "@/components/modal";
import { DataTable } from "@/components/data-table";
import {
  evidenceVaultData,
  versionHistoryData,
  type EvidenceVersion,
} from "@/lib/mock-data";
import { ChevronLeft, Home, Upload, Vault } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { type ColumnDef } from "@tanstack/react-table";

const uploadVersionSchema = z.object({
  notes: z.string().min(1, "Notes are required"),
  expiryDate: z.string().optional(),
  file: z.any().optional(),
});

type UploadVersionForm = z.infer<typeof uploadVersionSchema>;

export default function EvidenceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { id } = React.use(params);
  const evidence = evidenceVaultData.find((e) => e.id === id);
  const versions = versionHistoryData[id] || [];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UploadVersionForm>({
    resolver: zodResolver(uploadVersionSchema),
  });

  const onSubmit = (data: UploadVersionForm) => {
    console.log("New version data:", data);
    setIsModalOpen(false);
    reset();
  };

  if (!evidence) {
    const recommendations = evidenceVaultData.slice(0, 3);
    return (
      <main className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-slate-900">
                  Evidence not found
                </h1>
                <p className="text-sm sm:text-base text-slate-600">
                  We could not locate that document in the vault. Here are some
                  assets to explore while we search.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-slate-700 w-full sm:w-auto"
                >
                  <Link href="/vault">Back to Vault</Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-slate-700 w-full sm:w-auto"
                >
                  <Link href="/">Back to Home</Link>
                </Button>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recommendations.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-4 sm:p-5 shadow-lg"
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-blue-600">
                    {item.type}
                  </p>
                  <h2 className="mt-2 text-lg sm:text-xl font-semibold text-slate-900">
                    {item.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Updated {new Date(item.lastUpdated).toLocaleDateString()}
                  </p>
                  <div className="mt-4 flex items-center justify-between text-xs sm:text-sm text-slate-700">
                    <span className="rounded-full border border-slate-300 px-2 sm:px-3 py-1 text-xs">
                      {item.status}
                    </span>
                    <span className="text-xs text-slate-500">
                      Versions {item.versionsCount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  const versionColumns: ColumnDef<EvidenceVersion>[] = [
    {
      accessorKey: "version",
      header: "Version",
      cell: (row) => (
        <span className="font-mono font-semibold text-xs sm:text-sm">
          {row.getValue() as string}
        </span>
      ),
    },
    {
      accessorKey: "uploader",
      header: "Uploader",
      cell: (row) => (
        <span className="text-xs sm:text-sm">{row.getValue() as string}</span>
      ),
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: (row) => (
        <span className="text-xs sm:text-sm">
          {new Date(row.getValue() as string).toLocaleDateString()}
        </span>
      ),
    },
    {
      accessorKey: "notes",
      header: "Notes",
      cell: (row) => (
        <span className="text-xs sm:text-sm truncate max-w-[150px] sm:max-w-[200px] block">
          {row.getValue() as string}
        </span>
      ),
    },
    {
      accessorKey: "fileSize",
      header: "File Size",
      cell: (row) => (
        <span className="text-xs sm:text-sm">{row.getValue() as string}</span>
      ),
    },
  ];

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50">
      <div className="p-4 sm:p-6 lg:p-8">
        <section className="mb-6 sm:mb-8 rounded-2xl sm:rounded-3xl border border-slate-200 bg-linear-to-br from-white via-blue-50 to-indigo-50 p-5 sm:p-6 lg:p-8 shadow-lg">
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-2 sm:space-y-3">
                <p className="text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] text-blue-600">
                  Document Detail
                </p>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-semibold text-slate-900 wrap-break-word">
                  {evidence.name}
                </h1>
                <p className="text-sm sm:text-base text-slate-600">
                  {evidence.type}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 transition-colors duration-200 w-full sm:w-auto justify-center"
                >
                  <Link href="/vault">
                    <Vault className="w-4 h-4" />
                    <span className="text-sm">Back to Vault</span>
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 transition-colors duration-200 w-full sm:w-auto justify-center"
                >
                  <Link href="/">
                    <Home className="w-4 h-4" />
                    <span className="text-sm">Back to Home</span>
                  </Link>
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm">
              <StatusChip status={evidence.status} />
              <span className="rounded-full border border-slate-300 px-2 sm:px-3 py-1 text-[10px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.35em] text-slate-700">
                Expiry {new Date(evidence.expiryDate).toLocaleDateString()}
              </span>
              <span className="rounded-full border border-slate-300 px-2 sm:px-3 py-1 text-[10px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.35em] text-slate-700">
                Updated {new Date(evidence.lastUpdated).toLocaleDateString()}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              Managed by SentryLink Comply, this evidence is versioned, tracked,
              and ready for buyer fulfillment. Keep audits tight by reviewing
              the version history below before issuing a pack.
            </p>
          </div>
        </section>

        <div className="flex flex-col gap-4 sm:gap-6">
          <Card className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white shadow-lg">
            <CardHeader className="border-b border-slate-200 p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg text-slate-900">
                Document Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-700">
                <div className="rounded-xl sm:rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:p-4">
                  <p className="text-[10px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.3em] text-slate-500">
                    Type
                  </p>
                  <p className="mt-2 text-sm sm:text-base font-semibold text-slate-900">
                    {evidence.type}
                  </p>
                </div>
                <div className="rounded-xl sm:rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:p-4">
                  <p className="text-[10px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.3em] text-slate-500">
                    Status
                  </p>
                  <p className="mt-2 text-sm sm:text-base font-semibold text-slate-900">
                    {evidence.status}
                  </p>
                </div>
                <div className="rounded-xl sm:rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:p-4">
                  <p className="text-[10px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.3em] text-slate-500">
                    Expiry
                  </p>
                  <p className="mt-2 text-sm sm:text-base font-semibold text-slate-900">
                    {new Date(evidence.expiryDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="rounded-xl sm:rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:p-4">
                  <p className="text-[10px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.3em] text-slate-500">
                    Last Updated
                  </p>
                  <p className="mt-2 text-sm sm:text-base font-semibold text-slate-900">
                    {new Date(evidence.lastUpdated).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="rounded-xl sm:rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:p-4 text-xs sm:text-sm text-slate-700">
                <p>
                  Versions stored:{" "}
                  <span className="font-semibold text-slate-900">
                    {evidence.versionsCount}
                  </span>
                </p>
                <p className="mt-1 text-slate-600 leading-relaxed">
                  All uploads are encrypted, time-stamped, and capped by
                  organization policy. Share only versions that have been
                  approved for buyer requests.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white shadow-lg">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 p-4 sm:p-6 gap-3 sm:gap-0">
              <CardTitle className="text-base sm:text-lg text-slate-900">
                Version History
              </CardTitle>
              <Button
                onClick={() => setIsModalOpen(true)}
                variant="outline"
                className="gap-2 text-slate-700 border-slate-300 text-sm w-full sm:w-auto"
              >
                <Upload className="w-4 h-4" />
                Upload New Version
              </Button>
            </CardHeader>
            <CardContent className="p-3 sm:p-6">
              <div className="overflow-x-auto -mx-3 sm:-mx-6 lg:mx-0">
                <div className="min-w-[500px] sm:min-w-[600px] lg:min-w-full">
                  <DataTable
                    columns={versionColumns}
                    data={versions}
                    rowKey="version"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Modal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          title="Upload New Version"
          description={`Add a new version for ${evidence.name}`}
          submitLabel="Upload"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="space-y-4">
            <div>
              <Label htmlFor="notes" className="text-sm font-medium">
                Notes <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="notes"
                placeholder="Enter notes for this version..."
                className="mt-1.5 min-h-[100px] text-sm"
                {...register("notes")}
              />
              {errors.notes && (
                <p className="text-xs sm:text-sm text-destructive mt-1">
                  {errors.notes.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="expiryDate" className="text-sm font-medium">
                Expiry Date (Optional)
              </Label>
              <Input
                type="date"
                id="expiryDate"
                className="mt-1.5 text-sm"
                {...register("expiryDate")}
              />
            </div>

            <div>
              <Label htmlFor="file" className="text-sm font-medium">
                File (Optional)
              </Label>
              <Input
                type="file"
                id="file"
                className="mt-1.5 text-sm"
                {...register("file")}
              />
            </div>
          </div>
        </Modal>
      </div>
    </main>
  );
}
