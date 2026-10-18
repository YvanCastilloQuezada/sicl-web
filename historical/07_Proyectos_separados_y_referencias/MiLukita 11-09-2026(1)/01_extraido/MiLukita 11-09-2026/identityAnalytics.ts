export type AnalyticsDateRange = {
  from?: string;
  to?: string;
};

export type DeviceAnalyticsRecord = {
  createdAt: Date | string | number;
  deviceType?: string | null;
};

export type DeviceDistributionPoint = {
  name: string;
  users: number;
};

export type ComparedDeviceDistributionPoint = {
  name: string;
  firstUsers: number;
  secondUsers: number;
};

function boundary(value: string | undefined, endOfDay: boolean) {
  if (!value) return endOfDay ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
  const parsed = new Date(`${value}T${endOfDay ? "23:59:59.999" : "00:00:00"}`).getTime();
  return Number.isNaN(parsed) ? (endOfDay ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY) : parsed;
}

export function isWithinAnalyticsRange(value: Date | string | number, range: AnalyticsDateRange) {
  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) return false;
  return timestamp >= boundary(range.from, false) && timestamp <= boundary(range.to, true);
}

export function summarizeDeviceDistribution(devices: DeviceAnalyticsRecord[], range: AnalyticsDateRange = {}) {
  const counts = new Map<string, number>();
  for (const device of devices) {
    if (!isWithinAnalyticsRange(device.createdAt, range)) continue;
    const name = device.deviceType?.trim() || "UNKNOWN";
    counts.set(name, (counts.get(name) ?? 0) + 1);
  }
  return Array.from(counts, ([name, users]) => ({ name, users })).sort((a, b) => b.users - a.users || a.name.localeCompare(b.name));
}

export function compareDeviceDistributions(devices: DeviceAnalyticsRecord[], firstRange: AnalyticsDateRange, secondRange: AnalyticsDateRange) {
  const first = summarizeDeviceDistribution(devices, firstRange);
  const second = summarizeDeviceDistribution(devices, secondRange);
  const names = new Set([...first.map((point) => point.name), ...second.map((point) => point.name)]);
  return Array.from(names, (name) => ({
    name,
    firstUsers: first.find((point) => point.name === name)?.users ?? 0,
    secondUsers: second.find((point) => point.name === name)?.users ?? 0,
  })).sort((a, b) => (b.firstUsers + b.secondUsers) - (a.firstUsers + a.secondUsers) || a.name.localeCompare(b.name));
}
