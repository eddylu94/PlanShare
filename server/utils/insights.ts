import crypto from "crypto";

export const INSIGHTS_PROJECT = "planshare";
export const INSIGHTS_SERIES_DAYS = 366;

export const unauthorizedBody = { error: "Unauthorized" };

const BEARER_PREFIX = "Bearer ";

export const normalizeAuthorizationHeader = (
  authorization: unknown
): string | null => {
  const value = Array.isArray(authorization) ? authorization[0] : authorization;
  if (typeof value !== "string") {
    return null;
  }
  const header = value.trim();
  return header.length > 0 ? header : null;
};

export const hasBearerPrefix = (authorization: unknown): boolean => {
  const header = normalizeAuthorizationHeader(authorization);
  if (!header) {
    return false;
  }
  return header.toLowerCase().slice(0, BEARER_PREFIX.length) === "bearer ";
};

export const extractBearerToken = (authorization: unknown): string | null => {
  const header = normalizeAuthorizationHeader(authorization);
  if (!header || !hasBearerPrefix(header)) {
    return null;
  }

  const token = header.slice(BEARER_PREFIX.length).trim();
  return token.length > 0 ? token : null;
};

export const getInsightsSecret = (
  secret: string | undefined = process.env.INSIGHTS_SECRET
): string | null => {
  if (typeof secret !== "string") {
    return null;
  }
  const trimmed = secret.trim();
  return trimmed.length > 0 ? trimmed : null;
};

export const timingSafeEqualString = (a: string, b: string): boolean => {
  const aHash = crypto
    .createHash("sha256")
    .update(a)
    .digest();
  const bHash = crypto
    .createHash("sha256")
    .update(b)
    .digest();
  return crypto.timingSafeEqual(aHash, bHash);
};

export const isAuthorizedInsightsRequest = (
  authorizationHeader: unknown,
  secret: string | undefined
): boolean => {
  const loadedSecret = getInsightsSecret(secret);
  if (!loadedSecret) {
    return false;
  }

  const token = extractBearerToken(authorizationHeader);
  if (!token) {
    return false;
  }

  return timingSafeEqualString(token, loadedSecret);
};

export const utcDateString = (date: Date): string => {
  return date.toISOString().slice(0, 10);
};

export const addUtcDays = (yyyyMmDd: string, days: number): string => {
  const parts = yyyyMmDd.split("-");
  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);
  const next = new Date(Date.UTC(year, month - 1, day + days));
  return utcDateString(next);
};

export const toUtcDayString = (joinedDate: unknown, fallback: Date): string => {
  if (typeof joinedDate === "number" && Number.isFinite(joinedDate)) {
    return utcDateString(new Date(joinedDate));
  }

  if (joinedDate instanceof Date && !Number.isNaN(joinedDate.getTime())) {
    return utcDateString(joinedDate);
  }

  if (typeof joinedDate === "string" && joinedDate.length > 0) {
    const parsed = new Date(joinedDate);
    if (!Number.isNaN(parsed.getTime())) {
      return utcDateString(parsed);
    }
  }

  return utcDateString(fallback);
};

export type InsightsSeriesPoint = {
  date: string;
  count: number;
};

export const buildUsersSeries = (
  countsByDay: Map<string, number>,
  todayUtc: string,
  windowDays: number = INSIGHTS_SERIES_DAYS
): InsightsSeriesPoint[] => {
  if (countsByDay.size === 0) {
    return [];
  }

  const sortedDays = Array.from(countsByDay.keys()).sort();
  const firstDay = sortedDays[0];
  const series: InsightsSeriesPoint[] = [];
  let running = 0;

  for (let day = firstDay; day <= todayUtc; day = addUtcDays(day, 1)) {
    running += countsByDay.get(day) || 0;
    series.push({
      date: String(day),
      count: Number(running)
    });
  }

  const cutoff = addUtcDays(todayUtc, -(windowDays - 1));
  return series.filter(point => point.date >= cutoff);
};

export type InsightsUserDoc = {
  _id?: { getTimestamp?: () => Date };
  joinedDate?: unknown;
};

export const buildInsightsPayload = (
  users: InsightsUserDoc[],
  generatedAt: Date = new Date()
) => {
  const total = Number(users.length);
  const generatedAtIso = generatedAt.toISOString();

  if (total === 0) {
    return {
      project: INSIGHTS_PROJECT,
      generatedAt: generatedAtIso,
      users: {
        total: 0,
        series: [] as InsightsSeriesPoint[]
      }
    };
  }

  const countsByDay = new Map<string, number>();
  for (const user of users) {
    const fallback =
      user._id && typeof user._id.getTimestamp === "function"
        ? user._id.getTimestamp()
        : generatedAt;
    const day = toUtcDayString(user.joinedDate, fallback);
    countsByDay.set(day, (countsByDay.get(day) || 0) + 1);
  }

  const series = buildUsersSeries(
    countsByDay,
    utcDateString(generatedAt),
    INSIGHTS_SERIES_DAYS
  );

  return {
    project: INSIGHTS_PROJECT,
    generatedAt: generatedAtIso,
    users: {
      total,
      series
    }
  };
};
