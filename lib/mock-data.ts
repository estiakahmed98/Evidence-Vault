export interface Evidence {
  id: string
  name: string
  type: "Certificate" | "License" | "Report" | "Document"
  status: "Active" | "Expired" | "Expiring Soon" | "Pending"
  expiryDate: string
  versionsCount: number
  lastUpdated: string
}

export interface EvidenceVersion {
  version: string
  uploader: string
  date: string
  notes: string
  fileSize: string
}

export interface BuyerRequest {
  id: string
  docType: "Certificate" | "License" | "Report" | "Document"
  dueDate: string
  status: "Pending" | "Fulfilled" | "Overdue"
}

const uploaderNames = ["SentryLink Compliance", "Operations QA", "Factory Audit Squad", "Vendor Support"]
const versionTemplates = [
  { version: "v3", notes: "Latest compliance checkpoint" },
  { version: "v2", notes: "Mid-cycle alignment" },
  { version: "v1", notes: "Initial issue" },
]

const formatDate = (timestamp: number) => new Date(timestamp).toISOString().split("T")[0]

export const evidenceVaultData: Evidence[] = [
  {
    id: "1",
    name: "ISO 9001:2015 Certificate",
    type: "Certificate",
    status: "Active",
    expiryDate: "2025-12-31",
    versionsCount: 3,
    lastUpdated: "2024-11-15",
  },
  {
    id: "2",
    name: "Factory Safety License",
    type: "License",
    status: "Expiring Soon",
    expiryDate: "2025-02-28",
    versionsCount: 2,
    lastUpdated: "2024-12-01",
  },
  {
    id: "3",
    name: "Quality Audit Report",
    type: "Report",
    status: "Active",
    expiryDate: "2026-06-30",
    versionsCount: 5,
    lastUpdated: "2024-10-20",
  },
  {
    id: "4",
    name: "Environmental Compliance",
    type: "Document",
    status: "Expired",
    expiryDate: "2024-08-15",
    versionsCount: 1,
    lastUpdated: "2024-08-10",
  },
  {
    id: "5",
    name: "Product Certification",
    type: "Certificate",
    status: "Active",
    expiryDate: "2025-09-30",
    versionsCount: 4,
    lastUpdated: "2024-11-25",
  },
  {
    id: "6",
    name: "Worker Safety Training Log",
    type: "Document",
    status: "Pending",
    expiryDate: "2025-04-12",
    versionsCount: 2,
    lastUpdated: "2024-12-05",
  },
  {
    id: "7",
    name: "Emissions Test Report",
    type: "Report",
    status: "Expiring Soon",
    expiryDate: "2025-01-20",
    versionsCount: 3,
    lastUpdated: "2024-12-03",
  },
  {
    id: "8",
    name: "Supplier Onboarding Document",
    type: "Document",
    status: "Active",
    expiryDate: "2025-10-01",
    versionsCount: 2,
    lastUpdated: "2024-12-01",
  },
  {
    id: "9",
    name: "Equipment Calibration",
    type: "Document",
    status: "Expired",
    expiryDate: "2024-09-30",
    versionsCount: 1,
    lastUpdated: "2024-09-28",
  },
  {
    id: "10",
    name: "Electrical Safety Certificate",
    type: "Certificate",
    status: "Active",
    expiryDate: "2025-11-15",
    versionsCount: 3,
    lastUpdated: "2024-11-10",
  },
  {
    id: "11",
    name: "Fire Suppression Plan",
    type: "Document",
    status: "Pending",
    expiryDate: "2025-03-18",
    versionsCount: 1,
    lastUpdated: "2024-12-07",
  },
  {
    id: "12",
    name: "Packaging Compliance Report",
    type: "Report",
    status: "Expiring Soon",
    expiryDate: "2025-02-05",
    versionsCount: 3,
    lastUpdated: "2024-11-22",
  },
  {
    id: "13",
    name: "Supplier Insurance Certificate",
    type: "Certificate",
    status: "Active",
    expiryDate: "2026-03-10",
    versionsCount: 2,
    lastUpdated: "2024-12-02",
  },
  {
    id: "14",
    name: "Data Privacy Declaration",
    type: "Document",
    status: "Active",
    expiryDate: "2026-05-31",
    versionsCount: 2,
    lastUpdated: "2024-10-04",
  },
  {
    id: "15",
    name: "Release Management Audit",
    type: "Report",
    status: "Pending",
    expiryDate: "2025-05-12",
    versionsCount: 2,
    lastUpdated: "2024-12-08",
  },
]

export const versionHistoryData: Record<string, EvidenceVersion[]> = evidenceVaultData.reduce((acc, item, index) => {
  const baseTimestamp = Date.UTC(2024, 11, 28) - index * 5 * 24 * 60 * 60 * 1000
  acc[item.id] = versionTemplates.map((template, templateIndex) => ({
    version: template.version,
    uploader: uploaderNames[(index + templateIndex) % uploaderNames.length],
    date: formatDate(baseTimestamp - templateIndex * 25 * 24 * 60 * 60 * 1000),
    notes: `${template.notes} for ${item.name}`,
    fileSize: `${(2 + templateIndex * 0.4).toFixed(1)} MB`,
  }))
  return acc
}, {} as Record<string, EvidenceVersion[]>)

export const buyerRequestsData: BuyerRequest[] = [
  {
    id: "1",
    docType: "Certificate",
    dueDate: "2025-01-31",
    status: "Pending",
  },
  {
    id: "2",
    docType: "License",
    dueDate: "2025-02-15",
    status: "Pending",
  },
  {
    id: "3",
    docType: "Report",
    dueDate: "2025-01-15",
    status: "Fulfilled",
  },
  {
    id: "4",
    docType: "Document",
    dueDate: "2025-03-01",
    status: "Pending",
  },
]
