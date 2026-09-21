import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const siclProjects = mysqlTable("sicl_projects", {
  id: int("id").autoincrement().primaryKey(),
  ownerId: int("ownerId").notNull(),
  projectId: varchar("projectId", { length: 128 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  location: varchar("location", { length: 255 }),
  status: mysqlEnum("status", ["DRAFT", "ACTIVE", "DECIDED", "ARCHIVED"]).default("DRAFT").notNull(),
  version: int("version").default(1).notNull(),
  snapshot: text("snapshot").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const parametricFiles = mysqlTable("parametric_files", {
  id: int("id").autoincrement().primaryKey(),
  ownerId: int("ownerId").notNull(),
  projectId: varchar("projectId", { length: 128 }).notNull(),
  artifactId: varchar("artifactId", { length: 128 }).notNull().unique(),
  fileName: varchar("fileName", { length: 180 }).notNull(),
  format: varchar("format", { length: 32 }).notNull(),
  sizeBytes: int("sizeBytes").notNull(),
  checksum: varchar("checksum", { length: 96 }).notNull(),
  parsed: int("parsed").notNull().default(0),
  declaredDependencies: text("declaredDependencies").notNull(),
  capabilities: text("capabilities").notNull(),
  hostRequired: varchar("hostRequired", { length: 255 }),
  status: mysqlEnum("status", ["INSPECTED", "OPAQUE_HOST_REQUIRED", "REJECTED", "ARCHIVED"]).notNull(),
  storageKey: varchar("storageKey", { length: 512 }).notNull(),
  storageUrl: varchar("storageUrl", { length: 1024 }).notNull(),
  humanReviewRequired: int("humanReviewRequired").notNull().default(1),
  uploadedAt: timestamp("uploadedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type SiclProject = typeof siclProjects.$inferSelect;
export type InsertSiclProject = typeof siclProjects.$inferInsert;
export type ParametricFile = typeof parametricFiles.$inferSelect;
export type InsertParametricFile = typeof parametricFiles.$inferInsert;
