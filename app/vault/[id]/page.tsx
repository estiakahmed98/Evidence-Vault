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
import { ChevronLeft, Home, Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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
    // Mock submission - in a real app, this would upload to backend
    console.log("New version data:", data);
    setIsModalOpen(false);
    reset();
  };

  if (!evidence) {
    const recommendations = evidenceVaultData.slice(0, 3);
    return (
      <main className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 py-10">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-4xl font-semibold text-slate-900">
                  Evidence not found
                </h1>
                <p className="text-slate-600">
                  We could not locate that document in the vault. Here are some
                  assets to explore while we search.
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-slate-700"
                >
                  <Link href="/vault">Back to Vault</Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-slate-700"
                >
                  <Link href="/">Back to Home</Link>
                </Button>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {recommendations.map((item) => (
                <div
                  key={item.id}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg"
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-blue-600">
                    {item.type}
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-slate-900">
                    {item.name}
                  </h2>
                  <p className="text-sm text-slate-600">
                    Updated {new Date(item.lastUpdated).toLocaleDateString()}
                  </p>
                  <div className="mt-4 flex items-center justify-between text-sm text-slate-700">
                    <span className="rounded-full border border-slate-300 px-3 py-1">
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

  const versionColumns = [
    {
      id: "version",
      header: "Version",
      cell: (row: EvidenceVersion) => (
        <span className="font-mono font-semibold">{row.version}</span>
      ),
    },
    {
      id: "uploader",
      header: "Uploader",
      cell: (row: EvidenceVersion) => row.uploader,
    },
    {
      id: "date",
      header: "Date",
      cell: (row: EvidenceVersion) => new Date(row.date).toLocaleDateString(),
    },
    {
      id: "notes",
      header: "Notes",
      cell: (row: EvidenceVersion) => row.notes,
    },
    {
      id: "fileSize",
      header: "File Size",
      cell: (row: EvidenceVersion) => row.fileSize,
    },
  ];

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50">
      <div className="p-8">
        <section className="mb-8 rounded-3xl border border-slate-200 bg-linear-to-br from-white via-blue-50 to-indigo-50 p-8 shadow-lg">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-blue-600">
                Document Detail
              </p>
              <h1 className="mt-3 text-4xl font-semibold text-slate-900 sm:text-5xl">
                {evidence.name}
              </h1>
              <p className="mt-2 text-base text-slate-600">{evidence.type}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="gap-2 text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 transition-colors duration-200"
              >
                <Link href="/vault">
                  <ChevronLeft className="w-4 h-4" />
                  Back to Vault
                </Link>
              </Button>
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
            </div>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
            <StatusChip status={evidence.status} />
            <span className="rounded-full border border-slate-300 px-3 py-1 text-xs uppercase tracking-[0.35em] text-slate-700">
              Expiry {new Date(evidence.expiryDate).toLocaleDateString()}
            </span>
            <span className="rounded-full border border-slate-300 px-3 py-1 text-xs uppercase tracking-[0.35em] text-slate-700">
              Last Updated {new Date(evidence.lastUpdated).toLocaleDateString()}
            </span>
          </div>
          <p className="mt-4 text-sm text-slate-600 max-w-3xl">
            Managed by SentryLink Comply, this evidence is versioned, tracked,
            and ready for buyer fulfillment. Keep audits tight by reviewing the
            version history below before issuing a pack.
          </p>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.4fr,1fr]">
          <Card className="rounded-3xl border border-slate-200 bg-white shadow-lg">
            <CardHeader className="border-b border-slate-200">
              <CardTitle className="text-lg text-slate-900">
                Document Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-3 text-sm text-slate-700 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                    Type
                  </p>
                  <p className="mt-2 text-base font-semibold text-slate-900">
                    {evidence.type}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                    Status
                  </p>
                  <p className="mt-2 text-base font-semibold text-slate-900">
                    {evidence.status}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                    Expiry
                  </p>
                  <p className="mt-2 text-base font-semibold text-slate-900">
                    {new Date(evidence.expiryDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                    Last Updated
                  </p>
                  <p className="mt-2 text-base font-semibold text-slate-900">
                    {new Date(evidence.lastUpdated).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                <p>
                  Versions stored:{" "}
                  <span className="font-semibold text-slate-900">
                    {evidence.versionsCount}
                  </span>
                </p>
                <p className="mt-1 text-slate-600">
                  All uploads are encrypted, time-stamped, and capped by
                  organization policy. Share only versions that have been
                  approved for buyer requests.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border border-slate-200 bg-white shadow-lg">
            <CardHeader className="flex items-center justify-between border-b border-slate-200">
              <CardTitle className="text-lg text-slate-900">
                Version History
              </CardTitle>
              <Button
                onClick={() => setIsModalOpen(true)}
                variant="outline"
                className="gap-2 text-slate-700 border-slate-300"
              >
                <Upload className="w-4 h-4" />
                Upload New Version
              </Button>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={versionColumns}
                data={versions}
                rowKey="version"
              />
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
                {...register("notes")}
              />
              {errors.notes && (
                <p className="text-sm text-destructive mt-1">
                  {errors.notes.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="expiryDate" className="text-sm font-medium">
                Expiry Date (Optional)
              </Label>
              <Input type="date" id="expiryDate" {...register("expiryDate")} />
            </div>

            <div>
              <Label htmlFor="file" className="text-sm font-medium">
                File (Optional)
              </Label>
              <Input type="file" id="file" {...register("file")} />
            </div>
          </div>
        </Modal>
      </div>
    </main>
  );
}
