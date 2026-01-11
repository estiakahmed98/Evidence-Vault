import { evidenceVaultData, versionHistoryData } from "@/lib/mock-data";

export type RequestStatus = "Requested" | "Fulfilled" | "Overdue";
export type PackStatus = "pending" | "ready";

export interface RequestRecord {
  id: string;
  buyerId: string;
  factoryId: string;
  docType: "Certificate" | "License" | "Report" | "Document";
  dueDate: string;
  status: RequestStatus;
  evidenceId?: string;
  versionIds?: string[];
  fulfilledAt?: string;
}

export interface PackItem {
  evidenceId: string;
  versionIds: string[];
}

export interface PackRecord {
  id: string;
  buyerId: string;
  items: PackItem[];
  status: PackStatus;
  createdAt: string;
  readyAt?: string;
  downloadUrl?: string;
}

const requests = new Map<string, RequestRecord>();
const packs = new Map<string, PackRecord>();
const buyerAccess = new Map<string, Map<string, Set<string>>>();

const createId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const ensureBuyerAccess = (buyerId: string, evidenceId: string) => {
  if (!buyerAccess.has(buyerId)) {
    buyerAccess.set(buyerId, new Map());
  }
  const evidenceMap = buyerAccess.get(buyerId)!;
  if (!evidenceMap.has(evidenceId)) {
    evidenceMap.set(evidenceId, new Set());
  }
  return evidenceMap.get(evidenceId)!;
};

export const grantAccess = (
  buyerId: string,
  evidenceId: string,
  versionIds: string[]
) => {
  const set = ensureBuyerAccess(buyerId, evidenceId);
  versionIds.forEach((versionId) => set.add(versionId));
};

export const getAccessSet = (buyerId: string, evidenceId: string) => {
  return buyerAccess.get(buyerId)?.get(evidenceId);
};

export const createRequest = (input: {
  buyerId: string;
  factoryId: string;
  docType: RequestRecord["docType"];
  dueDate: string;
}) => {
  const request: RequestRecord = {
    id: createId(),
    buyerId: input.buyerId,
    factoryId: input.factoryId,
    docType: input.docType,
    dueDate: input.dueDate,
    status: "Requested",
  };
  requests.set(request.id, request);
  return request;
};

export const listRequests = (filters?: {
  buyerId?: string | null;
  factoryId?: string | null;
}) => {
  const items = Array.from(requests.values());
  return items.filter((item) => {
    if (filters?.buyerId && item.buyerId !== filters.buyerId) return false;
    if (filters?.factoryId && item.factoryId !== filters.factoryId)
      return false;
    return true;
  });
};

export const fulfillRequest = (
  requestId: string,
  evidenceId: string,
  versionIds: string[]
) => {
  const existing = requests.get(requestId);
  if (!existing) return null;
  const updated: RequestRecord = {
    ...existing,
    status: "Fulfilled",
    evidenceId,
    versionIds,
    fulfilledAt: new Date().toISOString(),
  };
  requests.set(requestId, updated);
  grantAccess(existing.buyerId, evidenceId, versionIds);
  return updated;
};

export const getBuyerEvidence = (buyerId: string, evidenceId: string) => {
  const evidence = evidenceVaultData.find((item) => item.id === evidenceId);
  if (!evidence) return null;
  const allowed = getAccessSet(buyerId, evidenceId);
  const versions = versionHistoryData[evidenceId] ?? [];
  const filtered = allowed
    ? versions.filter((version) => allowed.has(version.version))
    : [];
  return { evidence, versions: filtered };
};

export const createPack = (input: { buyerId: string; items: PackItem[] }) => {
  const pack: PackRecord = {
    id: createId(),
    buyerId: input.buyerId,
    items: input.items,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  packs.set(pack.id, pack);
  input.items.forEach((item) =>
    grantAccess(input.buyerId, item.evidenceId, item.versionIds)
  );

  setTimeout(() => {
    const current = packs.get(pack.id);
    if (!current || current.status !== "pending") return;
    packs.set(pack.id, {
      ...current,
      status: "ready",
      readyAt: new Date().toISOString(),
      downloadUrl: `https://example.com/downloads/packs/${pack.id}.zip`,
    });
  }, 1500);

  return pack;
};

export const getPack = (packId: string) => {
  return packs.get(packId) ?? null;
};
