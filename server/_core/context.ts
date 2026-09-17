import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";

function localDevelopmentUser(): User | null {
  if (process.env.NODE_ENV !== "development" || process.env.LOCAL_DEV_AUTH_BYPASS !== "true") {
    return null;
  }

  const now = new Date();
  return {
    id: -1,
    openId: "local-dev-authority",
    name: "Local Development Actor",
    email: null,
    loginMethod: "local-development",
    role: "user",
    createdAt: now,
    updatedAt: now,
    lastSignedIn: now,
  };
}

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = localDevelopmentUser();

  if (!user) {
    try {
      user = await sdk.authenticateRequest(opts.req);
    } catch (error) {
      // Authentication is optional for public procedures.
      user = null;
    }
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
