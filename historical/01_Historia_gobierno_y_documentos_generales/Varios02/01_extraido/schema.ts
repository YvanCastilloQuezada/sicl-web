import {
  boolean,
  index,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  avatarKey: varchar("avatarKey", { length: 512 }),
  avatarUrl: varchar("avatarUrl", { length: 1024 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Controller Lab capabilities are deliberately separate from the core account role.
 * Every authenticated person starts as USER; only an administrator can assign
 * PRESENTER or OPERATOR, and none of these roles grants protected-core authority.
 */
export const controllerRoleAssignments = mysqlTable(
  "controller_role_assignments",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    controllerRole: mysqlEnum("controllerRole", [
      "USER",
      "PRESENTER",
      "OPERATOR",
    ])
      .default("USER")
      .notNull(),
    assignedByUserId: int("assignedByUserId").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [
    uniqueIndex("controller_role_assignment_user_unique").on(table.userId),
  ]
);

export const controllerSessions = mysqlTable(
  "controller_sessions",
  {
    id: int("id").autoincrement().primaryKey(),
    publicId: varchar("publicId", { length: 48 }).notNull(),
    createdByUserId: int("createdByUserId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    connectedUserId: int("connectedUserId").references(() => users.id, {
      onDelete: "set null",
    }),
    mobileTokenHash: varchar("mobileTokenHash", { length: 128 }).notNull(),
    screenTokenHash: varchar("screenTokenHash", { length: 128 }).notNull(),
    manualLinkCodeHash: varchar("manualLinkCodeHash", { length: 128 }),
    status: mysqlEnum("status", ["PENDING", "CONNECTED", "EXPIRED", "CLOSED"])
      .default("PENDING")
      .notNull(),
    expiresAt: timestamp("expiresAt").notNull(),
    lastSeenAt: timestamp("lastSeenAt").defaultNow().notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    closedAt: timestamp("closedAt"),
  },
  table => [
    uniqueIndex("controller_session_public_unique").on(table.publicId),
    uniqueIndex("controller_session_manual_code_unique").on(
      table.manualLinkCodeHash
    ),
    index("controller_session_status_expiry_index").on(
      table.status,
      table.expiresAt
    ),
  ]
);

export const controllerCommands = mysqlTable(
  "controller_commands",
  {
    id: int("id").autoincrement().primaryKey(),
    publicId: varchar("publicId", { length: 48 }).notNull(),
    sessionId: int("sessionId")
      .notNull()
      .references(() => controllerSessions.id, { onDelete: "cascade" }),
    actorUserId: int("actorUserId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    mode: mysqlEnum("mode", [
      "REMOTE",
      "GAMEPAD",
      "TRACKPAD",
      "KEYBOARD",
    ]).notNull(),
    commandType: mysqlEnum("commandType", [
      "NAVIGATE",
      "SELECT",
      "BACK",
      "HOME",
      "EXIT",
      "TEXT",
      "PLAYBACK",
      "QR_VISIBILITY",
    ]).notNull(),
    payloadJson: text("payloadJson").notNull(),
    requestId: varchar("requestId", { length: 96 }).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => [
    uniqueIndex("controller_command_public_unique").on(table.publicId),
    uniqueIndex("controller_command_session_request_unique").on(
      table.sessionId,
      table.requestId
    ),
    index("controller_command_session_id_index").on(table.sessionId, table.id),
  ]
);

/** Configuración visual compartible del Controller Lab; no contiene tokens ni estado de sesión. */
export const controllerSharedProfiles = mysqlTable(
  "controller_shared_profiles",
  {
    id: int("id").autoincrement().primaryKey(),
    shareCode: varchar("shareCode", { length: 12 }).notNull(),
    ownerUserId: int("ownerUserId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    profileJson: text("profileJson").notNull(),
    expiresAt: timestamp("expiresAt").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => [
    uniqueIndex("controller_shared_profile_code_unique").on(table.shareCode),
    index("controller_shared_profile_expiry_index").on(table.expiresAt),
  ]
);

/** Public L★/QR destination registry. Tokens are never stored in plaintext. */
export const shareTargets = mysqlTable(
  "share_targets",
  {
    id: int("id").autoincrement().primaryKey(),
    publicId: varchar("publicId", { length: 48 }).notNull(),
    ownerUserId: int("ownerUserId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    targetType: mysqlEnum("targetType", [
      "PUBLIC_LUKA",
      "EXPERIENCE",
      "CONTROLLER",
      "LANDING",
      "CONTENT",
    ]).notNull(),
    destinationPath: varchar("destinationPath", { length: 512 }).notNull(),
    metadataJson: text("metadataJson").notNull(),
    capability: mysqlEnum("capability", [
      "PUBLIC_EXPERIENCE",
      "TERRITORIAL_RUNTIME",
      "CONTROLLER_LAB",
      "AUDIT_VIEW",
      "AR_VIEW",
    ]).notNull(),
    priority: int("priority").default(50).notNull(),
    status: mysqlEnum("status", ["ACTIVE", "REVOKED", "EXPIRED"])
      .default("ACTIVE")
      .notNull(),
    expiresAt: timestamp("expiresAt"),
    revokedAt: timestamp("revokedAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [
    uniqueIndex("share_target_public_unique").on(table.publicId),
    index("share_target_lookup_index").on(table.destinationPath, table.status, table.priority),
    index("share_target_owner_index").on(table.ownerUserId, table.status),
  ]
);

/** Opaque, expiring session links for QR resolution; only hashes are persisted. */
export const shareSessions = mysqlTable(
  "share_sessions",
  {
    id: int("id").autoincrement().primaryKey(),
    publicId: varchar("publicId", { length: 48 }).notNull(),
    targetId: int("targetId")
      .notNull()
      .references(() => shareTargets.id, { onDelete: "cascade" }),
    tokenHash: varchar("tokenHash", { length: 128 }).notNull(),
    userId: int("userId").references(() => users.id, { onDelete: "set null" }),
    status: mysqlEnum("status", ["ACTIVE", "REVOKED", "EXPIRED"])
      .default("ACTIVE")
      .notNull(),
    expiresAt: timestamp("expiresAt").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    revokedAt: timestamp("revokedAt"),
  },
  table => [
    uniqueIndex("share_session_public_unique").on(table.publicId),
    uniqueIndex("share_session_token_unique").on(table.tokenHash),
    index("share_session_target_index").on(table.targetId, table.status, table.expiresAt),
  ]
);

export const userNotificationPreferences = mysqlTable(
  "user_notification_preferences",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    inAppEnabled: boolean("inAppEnabled").default(true).notNull(),
    qrUpdatesEnabled: boolean("qrUpdatesEnabled").default(true).notNull(),
    securityAlertsEnabled: boolean("securityAlertsEnabled")
      .default(true)
      .notNull(),
    sessionAlertsEnabled: boolean("sessionAlertsEnabled")
      .default(true)
      .notNull(),
    criticalExpiryEnabled: boolean("criticalExpiryEnabled")
      .default(true)
      .notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [
    uniqueIndex("user_notification_preferences_user_unique").on(table.userId),
  ]
);

export const milukitaIdentities = mysqlTable(
  "milukita_identities",
  {
    id: int("id").autoincrement().primaryKey(),
    publicId: varchar("publicId", { length: 40 }).notNull(),
    userId: int("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    identityLevel: mysqlEnum("identityLevel", [
      "VISITOR",
      "FREE",
      "VERIFIED_PREMIUM_READY",
    ])
      .default("FREE")
      .notNull(),
    verificationStatus: mysqlEnum("verificationStatus", [
      "UNVERIFIED",
      "BASIC",
      "VERIFIED",
      "REQUIRES_REVIEW",
    ])
      .default("BASIC")
      .notNull(),
    planCode: varchar("planCode", { length: 32 }).default("FREE").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [
    uniqueIndex("milukita_identity_public_unique").on(table.publicId),
    uniqueIndex("milukita_identity_user_unique").on(table.userId),
  ]
);

export const milukitaDevices = mysqlTable(
  "milukita_devices",
  {
    id: int("id").autoincrement().primaryKey(),
    publicId: varchar("publicId", { length: 40 }).notNull(),
    identityId: int("identityId")
      .notNull()
      .references(() => milukitaIdentities.id, { onDelete: "cascade" }),
    deviceHash: varchar("deviceHash", { length: 128 }).notNull(),
    deviceType: varchar("deviceType", { length: 32 })
      .default("UNKNOWN")
      .notNull(),
    deviceStatus: mysqlEnum("deviceStatus", ["ACTIVE", "REVOKED"])
      .default("ACTIVE")
      .notNull(),
    lastSeen: timestamp("lastSeen").defaultNow().notNull(),
    revokedAt: timestamp("revokedAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => [
    uniqueIndex("milukita_device_public_unique").on(table.publicId),
    uniqueIndex("milukita_device_identity_hash_unique").on(
      table.identityId,
      table.deviceHash
    ),
    index("milukita_device_status_index").on(
      table.deviceStatus,
      table.lastSeen
    ),
  ]
);

export const milukitaSessions = mysqlTable(
  "milukita_sessions",
  {
    id: int("id").autoincrement().primaryKey(),
    publicId: varchar("publicId", { length: 40 }).notNull(),
    identityId: int("identityId")
      .notNull()
      .references(() => milukitaIdentities.id, { onDelete: "cascade" }),
    deviceId: int("deviceId").references(() => milukitaDevices.id, {
      onDelete: "set null",
    }),
    status: mysqlEnum("status", ["ACTIVE", "EXPIRED", "REVOKED"])
      .default("ACTIVE")
      .notNull(),
    expiresAt: timestamp("expiresAt").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    lastSeen: timestamp("lastSeen").defaultNow().notNull(),
  },
  table => [
    uniqueIndex("milukita_session_public_unique").on(table.publicId),
    index("milukita_session_identity_status_index").on(
      table.identityId,
      table.status,
      table.expiresAt
    ),
  ]
);

export const milukitaEventContexts = mysqlTable(
  "milukita_event_contexts",
  {
    id: int("id").autoincrement().primaryKey(),
    publicId: varchar("publicId", { length: 40 }).notNull(),
    eventId: varchar("eventId", { length: 96 }).notNull(),
    showId: varchar("showId", { length: 96 }),
    segmentId: varchar("segmentId", { length: 96 }),
    campaignId: varchar("campaignId", { length: 96 }),
    distributionContext: varchar("distributionContext", { length: 96 }),
    expiresAt: timestamp("expiresAt").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => [
    uniqueIndex("milukita_event_context_public_unique").on(table.publicId),
    index("milukita_event_context_event_index").on(
      table.eventId,
      table.expiresAt
    ),
  ]
);

export const milukitaParticipationSessions = mysqlTable(
  "milukita_participation_sessions",
  {
    id: int("id").autoincrement().primaryKey(),
    publicId: varchar("publicId", { length: 40 }).notNull(),
    identityId: int("identityId")
      .notNull()
      .references(() => milukitaIdentities.id, { onDelete: "cascade" }),
    deviceId: int("deviceId").references(() => milukitaDevices.id, {
      onDelete: "set null",
    }),
    sessionId: int("sessionId").references(() => milukitaSessions.id, {
      onDelete: "set null",
    }),
    eventContextId: int("eventContextId").references(
      () => milukitaEventContexts.id,
      { onDelete: "set null" }
    ),
    eventId: varchar("eventId", { length: 96 }).notNull(),
    status: mysqlEnum("status", [
      "CREATED",
      "IDENTIFIED",
      "ELIGIBLE",
      "STARTED",
      "SUBMITTED",
      "COMPLETED",
      "EXPIRED",
      "REJECTED",
      "CANCELLED",
    ])
      .default("CREATED")
      .notNull(),
    source: varchar("source", { length: 32 }).default("qr").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    startedAt: timestamp("startedAt"),
    completedAt: timestamp("completedAt"),
  },
  table => [
    uniqueIndex("milukita_participation_public_unique").on(table.publicId),
    index("milukita_participation_identity_event_index").on(
      table.identityId,
      table.eventId,
      table.createdAt
    ),
  ]
);

export const milukitaConsents = mysqlTable(
  "milukita_consents",
  {
    id: int("id").autoincrement().primaryKey(),
    publicId: varchar("publicId", { length: 40 }).notNull(),
    identityId: int("identityId")
      .notNull()
      .references(() => milukitaIdentities.id, { onDelete: "cascade" }),
    consentType: mysqlEnum("consentType", [
      "terms",
      "privacy",
      "marketing",
      "analytics",
      "personalization",
    ]).notNull(),
    version: varchar("version", { length: 32 }).notNull(),
    status: mysqlEnum("status", ["GRANTED", "REVOKED"]).notNull(),
    source: varchar("source", { length: 32 }).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => [
    uniqueIndex("milukita_consent_public_unique").on(table.publicId),
    index("milukita_consent_identity_type_index").on(
      table.identityId,
      table.consentType,
      table.createdAt
    ),
  ]
);

export const gameRulesets = mysqlTable(
  "game_rulesets",
  {
    id: int("id").autoincrement().primaryKey(),
    gameType: mysqlEnum("gameType", [
      "ruleta",
      "ruleta_7",
      "ruleta_17",
      "ruleta_27",
      "ruleta_37",
      "jackpot",
      "bingo",
      "bingo_flash",
      "bingo_keno",
      "bingo_75",
      "loteria_19",
      "loteria_29",
      "loteria_39",
      "loteria_39_5",
      "loteria_49",
      "loteria_59",
      "cartas",
      "sueldo_vida",
      "raspa_digital",
      "pick_3",
      "pick_4",
      "loto_diario",
      "loto_express",
    ]).notNull(),
    version: varchar("version", { length: 32 }).notNull(),
    title: varchar("title", { length: 128 }).notNull(),
    rulesJson: text("rulesJson").notNull(),
    prizePolicyJson: text("prizePolicyJson").notNull(),
    isPublished: boolean("isPublished").default(false).notNull(),
    createdByUserId: int("createdByUserId").references(() => users.id),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => [
    uniqueIndex("ruleset_game_version_unique").on(
      table.gameType,
      table.version
    ),
  ]
);

export const gameRounds = mysqlTable(
  "game_rounds",
  {
    id: int("id").autoincrement().primaryKey(),
    publicId: varchar("publicId", { length: 40 }).notNull(),
    gameType: mysqlEnum("gameType", [
      "ruleta",
      "ruleta_7",
      "ruleta_17",
      "ruleta_27",
      "ruleta_37",
      "jackpot",
      "bingo",
      "bingo_flash",
      "bingo_keno",
      "bingo_75",
      "loteria_19",
      "loteria_29",
      "loteria_39",
      "loteria_39_5",
      "loteria_49",
      "loteria_59",
      "cartas",
      "sueldo_vida",
      "raspa_digital",
      "pick_3",
      "pick_4",
      "loto_diario",
      "loto_express",
    ]).notNull(),
    rulesetId: int("rulesetId")
      .notNull()
      .references(() => gameRulesets.id),
    state: mysqlEnum("state", [
      "draft",
      "open",
      "locked",
      "drawn",
      "settled",
      "archived",
    ])
      .default("draft")
      .notNull(),
    opensAt: timestamp("opensAt").notNull(),
    closesAt: timestamp("closesAt").notNull(),
    serverSeedHash: varchar("serverSeedHash", { length: 128 }).notNull(),
    serverSeedSecret: text("serverSeedSecret").notNull(),
    revealedServerSeed: text("revealedServerSeed"),
    publicSeed: text("publicSeed"),
    ticketSetHash: varchar("ticketSetHash", { length: 128 }),
    resultJson: text("resultJson"),
    jackpotPoolCredits: int("jackpotPoolCredits").default(0).notNull(),
    algorithmVersion: varchar("algorithmVersion", { length: 64 }).notNull(),
    createdByUserId: int("createdByUserId").references(() => users.id),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    lockedAt: timestamp("lockedAt"),
    drawnAt: timestamp("drawnAt"),
    settledAt: timestamp("settledAt"),
  },
  table => [
    uniqueIndex("game_round_public_id_unique").on(table.publicId),
    index("game_round_type_state_index").on(table.gameType, table.state),
  ]
);

export const virtualWallets = mysqlTable(
  "virtual_wallets",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId")
      .notNull()
      .references(() => users.id),
    balance: int("balance").default(0).notNull(),
    welcomeBonusClaimed: boolean("welcomeBonusClaimed")
      .default(false)
      .notNull(),
    lastDailyRewardAt: timestamp("lastDailyRewardAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [uniqueIndex("wallet_user_unique").on(table.userId)]
);

export const playerSettings = mysqlTable(
  "player_settings",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId")
      .notNull()
      .references(() => users.id),
    countryCode: varchar("countryCode", { length: 2 }).default("PE").notNull(),
    sessionLimitMinutes: int("sessionLimitMinutes").default(60).notNull(),
    voluntaryPauseUntil: timestamp("voluntaryPauseUntil"),
    marketingEnabled: boolean("marketingEnabled").default(false).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [uniqueIndex("player_settings_user_unique").on(table.userId)]
);

export const virtualRewardLedger = mysqlTable(
  "virtual_reward_ledger",
  {
    id: int("id").autoincrement().primaryKey(),
    publicId: varchar("publicId", { length: 40 }).notNull(),
    userId: int("userId")
      .notNull()
      .references(() => users.id),
    kind: mysqlEnum("kind", [
      "TOURNAMENT_PRIZE",
      "COOPERATIVE_ACHIEVEMENT",
    ]).notNull(),
    amount: int("amount").notNull(),
    reason: varchar("reason", { length: 255 }).notNull(),
    idempotencyKey: varchar("idempotencyKey", { length: 128 }).notNull(),
    metadataJson: text("metadataJson"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => [
    uniqueIndex("virtual_reward_public_unique").on(table.publicId),
    uniqueIndex("virtual_reward_idempotency_unique").on(table.idempotencyKey),
    index("virtual_reward_user_index").on(table.userId, table.createdAt),
  ]
);

export const walletTransactions = mysqlTable(
  "wallet_transactions",
  {
    id: int("id").autoincrement().primaryKey(),
    publicId: varchar("publicId", { length: 40 }).notNull(),
    userId: int("userId")
      .notNull()
      .references(() => users.id),
    type: mysqlEnum("type", [
      "welcome_bonus",
      "daily_reward",
      "mission_reward",
      "ticket_debit",
      "virtual_prize",
      "promotion_bonus",
      "tournament_reward",
      "cooperative_achievement",
      "market_debit",
      "market_payout",
      "market_refund",
      "manual_adjustment",
    ]).notNull(),
    amount: int("amount").notNull(),
    balanceAfter: int("balanceAfter").notNull(),
    idempotencyKey: varchar("idempotencyKey", { length: 96 }).notNull(),
    description: varchar("description", { length: 255 }).notNull(),
    metadataJson: text("metadataJson"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => [
    uniqueIndex("wallet_transaction_public_unique").on(table.publicId),
    uniqueIndex("wallet_transaction_idempotency_unique").on(
      table.idempotencyKey
    ),
    index("wallet_transaction_user_index").on(table.userId, table.createdAt),
  ]
);

export const pilotTickets = mysqlTable(
  "pilot_tickets",
  {
    id: int("id").autoincrement().primaryKey(),
    publicId: varchar("publicId", { length: 40 }).notNull(),
    userId: int("userId")
      .notNull()
      .references(() => users.id),
    roundId: int("roundId")
      .notNull()
      .references(() => gameRounds.id),
    gameType: mysqlEnum("gameType", [
      "ruleta",
      "ruleta_7",
      "ruleta_17",
      "ruleta_27",
      "ruleta_37",
      "jackpot",
      "bingo",
      "bingo_flash",
      "bingo_keno",
      "bingo_75",
      "loteria_19",
      "loteria_29",
      "loteria_39",
      "loteria_39_5",
      "loteria_49",
      "loteria_59",
      "cartas",
      "sueldo_vida",
      "raspa_digital",
      "pick_3",
      "pick_4",
      "loto_diario",
      "loto_express",
    ]).notNull(),
    picksJson: text("picksJson").notNull(),
    extraPick: int("extraPick"),
    bonusBallCount: int("bonusBallCount").default(0).notNull(),
    quantity: int("quantity").default(1).notNull(),
    virtualCost: int("virtualCost").notNull(),
    virtualPrizeAmount: int("virtualPrizeAmount").default(0).notNull(),
    benefitTier: varchar("benefitTier", { length: 32 }).notNull(),
    status: mysqlEnum("status", [
      "reserved",
      "confirmed",
      "settled",
      "cancelled",
    ])
      .default("reserved")
      .notNull(),
    resultJson: text("resultJson"),
    ticketHash: varchar("ticketHash", { length: 128 }).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => [
    uniqueIndex("pilot_ticket_public_unique").on(table.publicId),
    index("pilot_ticket_round_index").on(table.roundId, table.createdAt),
    index("pilot_ticket_user_index").on(table.userId, table.createdAt),
  ]
);

export const gameBatchPreviews = mysqlTable(
  "game_batch_previews",
  {
    id: int("id").autoincrement().primaryKey(),
    publicId: varchar("publicId", { length: 40 }).notNull(),
    userId: int("userId")
      .notNull()
      .references(() => users.id),
    roundId: int("roundId")
      .notNull()
      .references(() => gameRounds.id),
    gameType: mysqlEnum("gameType", [
      "ruleta",
      "ruleta_7",
      "ruleta_17",
      "ruleta_27",
      "ruleta_37",
      "jackpot",
      "bingo",
      "bingo_flash",
      "bingo_keno",
      "bingo_75",
      "loteria_19",
      "loteria_29",
      "loteria_39",
      "loteria_39_5",
      "loteria_49",
      "loteria_59",
      "cartas",
      "sueldo_vida",
      "raspa_digital",
      "pick_3",
      "pick_4",
      "loto_diario",
      "loto_express",
    ]).notNull(),
    selectionsJson: text("selectionsJson").notNull(),
    selectionHash: varchar("selectionHash", { length: 128 }).notNull(),
    signature: varchar("signature", { length: 128 }).notNull(),
    expiresAt: timestamp("expiresAt").notNull(),
    confirmedAt: timestamp("confirmedAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => [
    uniqueIndex("game_batch_preview_public_unique").on(table.publicId),
    index("game_batch_preview_user_expiry_index").on(
      table.userId,
      table.expiresAt
    ),
  ]
);

export const gameSchedules = mysqlTable(
  "game_schedules",
  {
    id: int("id").autoincrement().primaryKey(),
    gameType: varchar("gameType", { length: 32 }).notNull(),
    label: varchar("label", { length: 128 }).notNull(),
    cronExpression: varchar("cronExpression", { length: 64 }).notNull(),
    timezone: varchar("timezone", { length: 64 }).default("UTC").notNull(),
    scheduleCronTaskUid: varchar("scheduleCronTaskUid", { length: 65 }),
    isEnabled: boolean("isEnabled").default(false).notNull(),
    lastRunAt: timestamp("lastRunAt"),
    lastRoundPublicId: varchar("lastRoundPublicId", { length: 40 }),
    metadataJson: text("metadataJson").notNull(),
    createdByUserId: int("createdByUserId").references(() => users.id),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [
    uniqueIndex("game_schedule_game_type_unique").on(table.gameType),
    uniqueIndex("game_schedule_task_uid_unique").on(table.scheduleCronTaskUid),
    index("game_schedule_enabled_index").on(table.isEnabled, table.gameType),
  ]
);

export const virtualAwardInstallments = mysqlTable(
  "virtual_award_installments",
  {
    id: int("id").autoincrement().primaryKey(),
    publicId: varchar("publicId", { length: 40 }).notNull(),
    userId: int("userId")
      .notNull()
      .references(() => users.id),
    ticketId: int("ticketId")
      .notNull()
      .references(() => pilotTickets.id),
    roundId: int("roundId")
      .notNull()
      .references(() => gameRounds.id),
    totalInstallments: int("totalInstallments").notNull(),
    installmentsPaid: int("installmentsPaid").default(0).notNull(),
    installmentCredits: int("installmentCredits").notNull(),
    nextPaymentAt: timestamp("nextPaymentAt").notNull(),
    status: mysqlEnum("status", ["pending", "active", "completed", "cancelled"])
      .default("pending")
      .notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
    completedAt: timestamp("completedAt"),
  },
  table => [
    uniqueIndex("virtual_award_installment_public_unique").on(table.publicId),
    uniqueIndex("virtual_award_ticket_unique").on(table.ticketId),
    index("virtual_award_due_index").on(table.status, table.nextPaymentAt),
  ]
);

export const virtualPlanEnrollments = mysqlTable(
  "virtual_plan_enrollments",
  {
    id: int("id").autoincrement().primaryKey(),
    publicId: varchar("publicId", { length: 40 }).notNull(),
    userId: int("userId")
      .notNull()
      .references(() => users.id),
    gameType: mysqlEnum("gameType", [
      "loteria_29",
      "loteria_39",
      "loteria_39_5",
      "loteria_49",
      "loteria_59",
    ]).notNull(),
    planCode: varchar("planCode", { length: 32 }).notNull(),
    picksJson: text("picksJson").notNull(),
    remainingConfirmations: int("remainingConfirmations").notNull(),
    status: mysqlEnum("status", ["active", "paused", "expired", "cancelled"])
      .default("active")
      .notNull(),
    consentedAt: timestamp("consentedAt").defaultNow().notNull(),
    expiresAt: timestamp("expiresAt").notNull(),
    cancelledAt: timestamp("cancelledAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [
    uniqueIndex("virtual_plan_public_unique").on(table.publicId),
    index("virtual_plan_user_status_index").on(
      table.userId,
      table.status,
      table.expiresAt
    ),
  ]
);

export const lukitaScriptVersions = mysqlTable(
  "lukita_script_versions",
  {
    id: int("id").autoincrement().primaryKey(),
    publicId: varchar("publicId", { length: 40 }).notNull(),
    trigger: varchar("trigger", { length: 32 }).notNull(),
    locale: varchar("locale", { length: 16 }).default("es-PE").notNull(),
    text: varchar("text", { length: 280 }).notNull(),
    fallback: varchar("fallback", { length: 280 }).notNull(),
    enabled: boolean("enabled").default(true).notNull(),
    version: int("version").default(1).notNull(),
    source: mysqlEnum("source", [
      "deterministic_template",
      "operator_edit",
      "ai_generated",
    ])
      .default("deterministic_template")
      .notNull(),
    status: mysqlEnum("status", ["draft", "active", "archived"])
      .default("active")
      .notNull(),
    category: varchar("category", { length: 40 }).default("general").notNull(),
    tagsJson: varchar("tagsJson", { length: 512 }).default("[]").notNull(),
    createdByUserId: int("createdByUserId").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [
    uniqueIndex("lukita_script_public_unique").on(table.publicId),
    index("lukita_script_trigger_status_index").on(
      table.trigger,
      table.status,
      table.version
    ),
  ]
);

export const auditReportArtifacts = mysqlTable(
  "audit_report_artifacts",
  {
    id: int("id").autoincrement().primaryKey(),
    publicId: varchar("publicId", { length: 40 }).notNull(),
    title: varchar("title", { length: 160 }).notNull(),
    format: mysqlEnum("format", ["pdf"]).default("pdf").notNull(),
    version: int("version").default(1).notNull(),
    storageKey: varchar("storageKey", { length: 512 }).notNull(),
    storageUrl: varchar("storageUrl", { length: 768 }).notNull(),
    sha256: varchar("sha256", { length: 64 }).notNull(),
    byteSize: int("byteSize").notNull(),
    createdByUserId: int("createdByUserId").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => [
    uniqueIndex("audit_report_public_unique").on(table.publicId),
    index("audit_report_created_index").on(table.createdAt),
  ]
);

export const auditEvents = mysqlTable(
  "audit_events",
  {
    id: int("id").autoincrement().primaryKey(),
    publicId: varchar("publicId", { length: 40 }).notNull(),
    actorUserId: int("actorUserId").references(() => users.id),
    actorRole: varchar("actorRole", { length: 48 }),
    eventType: varchar("eventType", { length: 64 }).notNull(),
    entityType: varchar("entityType", { length: 64 }).notNull(),
    entityPublicId: varchar("entityPublicId", { length: 64 }).notNull(),
    action: varchar("action", { length: 96 }),
    previousStateJson: text("previousStateJson"),
    newStateJson: text("newStateJson"),
    metadataJson: text("metadataJson"),
    correlationId: varchar("correlationId", { length: 96 }),
    payloadJson: text("payloadJson").notNull(),
    previousHash: varchar("previousHash", { length: 128 }),
    eventHash: varchar("eventHash", { length: 128 }).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => [
    uniqueIndex("audit_event_public_unique").on(table.publicId),
    index("audit_event_entity_index").on(
      table.entityType,
      table.entityPublicId,
      table.createdAt
    ),
  ]
);

export const lrciReviewCases = mysqlTable(
  "lrci_review_cases",
  {
    id: int("id").autoincrement().primaryKey(),
    publicId: varchar("publicId", { length: 40 }).notNull(),
    title: varchar("title", { length: 160 }).notNull(),
    domain: varchar("domain", { length: 48 }).notNull(),
    status: mysqlEnum("status", [
      "NO_DATA",
      "TECHNICAL_CONTROL_ONLY",
      "REQUIRES_PROFESSIONAL_REVIEW",
      "POLICY_BLOCKED",
      "SOURCE_EXPIRED",
      "HUMAN_APPROVED",
      "REJECTED",
    ])
      .default("NO_DATA")
      .notNull(),
    scope: varchar("scope", { length: 255 }).notNull(),
    jurisdiction: varchar("jurisdiction", { length: 64 }).notNull(),
    expiresAt: timestamp("expiresAt"),
    responsibleUserId: int("responsibleUserId").references(() => users.id, {
      onDelete: "set null",
    }),
    responsibleLabel: varchar("responsibleLabel", { length: 160 }).notNull(),
    sourceRef: varchar("sourceRef", { length: 512 }),
    evidenceSummary: text("evidenceSummary"),
    reviewerComment: text("reviewerComment"),
    reviewedAt: timestamp("reviewedAt"),
    createdByUserId: int("createdByUserId").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [
    uniqueIndex("lrci_review_case_public_unique").on(table.publicId),
    index("lrci_review_case_status_expiry_index").on(
      table.status,
      table.expiresAt
    ),
    index("lrci_review_case_jurisdiction_index").on(
      table.jurisdiction,
      table.updatedAt
    ),
  ]
);

export const lrciReviewNotifications = mysqlTable(
  "lrci_review_notifications",
  {
    id: int("id").autoincrement().primaryKey(),
    publicId: varchar("publicId", { length: 40 }).notNull(),
    casePublicId: varchar("casePublicId", { length: 40 }).notNull(),
    kind: mysqlEnum("kind", ["EXPIRING_SOON", "EXPIRED"]).notNull(),
    severity: mysqlEnum("severity", ["HIGH", "CRITICAL"]).notNull(),
    title: varchar("title", { length: 160 }).notNull(),
    message: text("message").notNull(),
    dueAt: timestamp("dueAt"),
    readAt: timestamp("readAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => [
    uniqueIndex("lrci_notification_public_unique").on(table.publicId),
    uniqueIndex("lrci_notification_case_kind_unique").on(
      table.casePublicId,
      table.kind
    ),
    index("lrci_notification_read_created_index").on(
      table.readAt,
      table.createdAt
    ),
  ]
);

export const operationalEvents = mysqlTable(
  "operational_events",
  {
    id: int("id").autoincrement().primaryKey(),
    publicId: varchar("publicId", { length: 40 }).notNull(),
    eventType: varchar("eventType", { length: 96 }).notNull(),
    aggregateType: varchar("aggregateType", { length: 64 }).notNull(),
    aggregateId: varchar("aggregateId", { length: 96 }).notNull(),
    actorUserId: int("actorUserId").references(() => users.id, {
      onDelete: "set null",
    }),
    source: varchar("source", { length: 64 }).notNull(),
    payloadJson: text("payloadJson").notNull(),
    version: int("version").default(1).notNull(),
    correlationId: varchar("correlationId", { length: 96 }).notNull(),
    idempotencyKey: varchar("idempotencyKey", { length: 128 }).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => [
    uniqueIndex("operational_event_public_unique").on(table.publicId),
    uniqueIndex("operational_event_idempotency_unique").on(
      table.idempotencyKey
    ),
    index("operational_event_aggregate_index").on(
      table.aggregateType,
      table.aggregateId,
      table.createdAt
    ),
    index("operational_event_type_index").on(table.eventType, table.createdAt),
  ]
);

export const productAnalyticsEvents = mysqlTable(
  "product_analytics_events",
  {
    id: int("id").autoincrement().primaryKey(),
    publicId: varchar("publicId", { length: 40 }).notNull(),
    userId: int("userId").references(() => users.id, { onDelete: "set null" }),
    anonymousSessionId: varchar("anonymousSessionId", { length: 96 }),
    eventType: varchar("eventType", { length: 64 }).notNull(),
    gameType: varchar("gameType", { length: 32 }),
    sessionId: varchar("sessionId", { length: 96 }),
    source: varchar("source", { length: 32 }).default("web").notNull(),
    payloadJson: text("payloadJson"),
    idempotencyKey: varchar("idempotencyKey", { length: 128 }).notNull(),
    occurredAt: timestamp("occurredAt").defaultNow().notNull(),
  },
  table => [
    uniqueIndex("product_analytics_public_unique").on(table.publicId),
    uniqueIndex("product_analytics_idempotency_unique").on(
      table.idempotencyKey
    ),
    index("product_analytics_user_time_index").on(
      table.userId,
      table.occurredAt
    ),
    index("product_analytics_event_time_index").on(
      table.eventType,
      table.occurredAt
    ),
  ]
);

export const systemControlState = mysqlTable(
  "system_control_state",
  {
    id: int("id").autoincrement().primaryKey(),
    mode: varchar("mode", { length: 24 }).default("NORMAL").notNull(),
    reason: varchar("reason", { length: 255 }),
    updatedByUserId: int("updatedByUserId").references(() => users.id),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [uniqueIndex("system_control_singleton_unique").on(table.id)]
);

export const adminQrTimerPalettes = mysqlTable(
  "admin_qr_timer_palettes",
  {
    id: int("id").autoincrement().primaryKey(),
    publicId: varchar("publicId", { length: 40 }).notNull(),
    name: varchar("name", { length: 96 }).notNull(),
    paletteJson: text("paletteJson").notNull(),
    isActive: boolean("isActive").default(false).notNull(),
    createdByUserId: int("createdByUserId")
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [
    uniqueIndex("admin_qr_timer_palette_public_unique").on(table.publicId),
    uniqueIndex("admin_qr_timer_palette_name_unique").on(table.name),
    index("admin_qr_timer_palette_active_index").on(
      table.isActive,
      table.updatedAt
    ),
  ]
);

export const paymentReferences = mysqlTable(
  "payment_references",
  {
    id: int("id").autoincrement().primaryKey(),
    publicId: varchar("publicId", { length: 40 }).notNull(),
    userId: int("userId")
      .notNull()
      .references(() => users.id),
    provider: mysqlEnum("provider", ["yape"]).default("yape").notNull(),
    status: mysqlEnum("status", [
      "disabled",
      "pending",
      "confirmed",
      "rejected",
      "expired",
    ])
      .default("disabled")
      .notNull(),
    countryCode: varchar("countryCode", { length: 2 }).default("PE").notNull(),
    virtualAmount: int("virtualAmount").notNull(),
    idempotencyKey: varchar("idempotencyKey", { length: 96 }).notNull(),
    providerReference: varchar("providerReference", { length: 128 }),
    metadataJson: text("metadataJson"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [
    uniqueIndex("payment_reference_public_unique").on(table.publicId),
    uniqueIndex("payment_reference_idempotency_unique").on(
      table.idempotencyKey
    ),
  ]
);

export const missions = mysqlTable(
  "missions",
  {
    id: int("id").autoincrement().primaryKey(),
    code: varchar("code", { length: 64 }).notNull(),
    title: varchar("title", { length: 128 }).notNull(),
    badgeLabel: varchar("badgeLabel", { length: 96 }).notNull(),
    description: varchar("description", { length: 255 }).notNull(),
    targetCount: int("targetCount").notNull(),
    rewardCredits: int("rewardCredits").notNull(),
    isActive: boolean("isActive").default(true).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => [uniqueIndex("mission_code_unique").on(table.code)]
);

export const playerMissionProgress = mysqlTable(
  "player_mission_progress",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId")
      .notNull()
      .references(() => users.id),
    missionId: int("missionId")
      .notNull()
      .references(() => missions.id),
    progressCount: int("progressCount").default(0).notNull(),
    completedAt: timestamp("completedAt"),
    claimedAt: timestamp("claimedAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [
    uniqueIndex("player_mission_unique").on(table.userId, table.missionId),
  ]
);

export const promotionRules = mysqlTable(
  "promotion_rules",
  {
    id: int("id").autoincrement().primaryKey(),
    code: varchar("code", { length: 64 }).notNull(),
    label: varchar("label", { length: 128 }).notNull(),
    kind: mysqlEnum("kind", [
      "volume_discount",
      "streak_bonus",
      "multiplier",
    ]).notNull(),
    conditionsJson: text("conditionsJson").notNull(),
    isActive: boolean("isActive").default(true).notNull(),
    createdByUserId: int("createdByUserId").references(() => users.id),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [uniqueIndex("promotion_code_unique").on(table.code)]
);

export const marketEvents = mysqlTable(
  "market_events",
  {
    id: int("id").autoincrement().primaryKey(),
    publicId: varchar("publicId", { length: 40 }).notNull(),
    title: varchar("title", { length: 220 }).notNull(),
    description: text("description").notNull(),
    category: varchar("category", { length: 48 }).notNull(),
    sourceLabel: varchar("sourceLabel", { length: 160 }).notNull(),
    sourceUrl: varchar("sourceUrl", { length: 512 }).notNull(),
    resolutionRule: text("resolutionRule").notNull(),
    state: mysqlEnum("state", ["draft", "open", "closed", "settled", "voided"])
      .default("draft")
      .notNull(),
    yesPriceCredits: int("yesPriceCredits").default(50).notNull(),
    noPriceCredits: int("noPriceCredits").default(50).notNull(),
    payoutCredits: int("payoutCredits").default(100).notNull(),
    closesAt: timestamp("closesAt").notNull(),
    resolvesAt: timestamp("resolvesAt"),
    outcome: mysqlEnum("outcome", ["yes", "no"]),
    resolutionUrl: varchar("resolutionUrl", { length: 512 }),
    pilotOnly: boolean("pilotOnly").default(true).notNull(),
    createdByUserId: int("createdByUserId").references(() => users.id),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [
    uniqueIndex("market_event_public_unique").on(table.publicId),
    index("market_event_state_close_index").on(table.state, table.closesAt),
  ]
);

export const marketPositions = mysqlTable(
  "market_positions",
  {
    id: int("id").autoincrement().primaryKey(),
    publicId: varchar("publicId", { length: 40 }).notNull(),
    userId: int("userId")
      .notNull()
      .references(() => users.id),
    marketId: int("marketId")
      .notNull()
      .references(() => marketEvents.id),
    side: mysqlEnum("side", ["yes", "no"]).notNull(),
    contracts: int("contracts").notNull(),
    unitCostCredits: int("unitCostCredits").notNull(),
    virtualCost: int("virtualCost").notNull(),
    virtualPayout: int("virtualPayout").default(0).notNull(),
    status: mysqlEnum("status", ["active", "settled", "refunded"])
      .default("active")
      .notNull(),
    idempotencyKey: varchar("idempotencyKey", { length: 96 }).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    settledAt: timestamp("settledAt"),
  },
  table => [
    uniqueIndex("market_position_public_unique").on(table.publicId),
    uniqueIndex("market_position_idempotency_unique").on(table.idempotencyKey),
    index("market_position_market_index").on(table.marketId, table.createdAt),
    index("market_position_user_index").on(table.userId, table.createdAt),
  ]
);

export const marketBatchPreviews = mysqlTable(
  "market_batch_previews",
  {
    id: int("id").autoincrement().primaryKey(),
    publicId: varchar("publicId", { length: 40 }).notNull(),
    userId: int("userId")
      .notNull()
      .references(() => users.id),
    marketId: int("marketId")
      .notNull()
      .references(() => marketEvents.id),
    selectionsJson: text("selectionsJson").notNull(),
    selectionHash: varchar("selectionHash", { length: 128 }).notNull(),
    signature: varchar("signature", { length: 128 }).notNull(),
    expiresAt: timestamp("expiresAt").notNull(),
    confirmedAt: timestamp("confirmedAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => [
    uniqueIndex("market_batch_preview_public_unique").on(table.publicId),
    index("market_batch_preview_user_expiry_index").on(
      table.userId,
      table.expiresAt
    ),
  ]
);

export const broadcastSignalMetrics = mysqlTable(
  "broadcast_signal_metrics",
  {
    id: int("id").autoincrement().primaryKey(),
    publicId: varchar("publicId", { length: 40 }).notNull(),
    broadcastId: varchar("broadcastId", { length: 96 }).notNull(),
    videoId: varchar("videoId", { length: 64 }),
    source: mysqlEnum("source", ["local_probe", "youtube_api", "operator"])
      .default("local_probe")
      .notNull(),
    status: mysqlEnum("status", ["healthy", "degraded", "offline", "unknown"])
      .default("unknown")
      .notNull(),
    latencyMs: int("latencyMs"),
    droppedFramesPercent: int("droppedFramesPercent"),
    detail: varchar("detail", { length: 255 }),
    measuredAt: timestamp("measuredAt").defaultNow().notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => [
    uniqueIndex("broadcast_signal_metric_public_unique").on(table.publicId),
    index("broadcast_signal_metric_lookup").on(
      table.broadcastId,
      table.measuredAt
    ),
  ]
);

export const socialImpactCycles = mysqlTable(
  "social_impact_cycles",
  {
    id: int("id").autoincrement().primaryKey(),
    publicId: varchar("publicId", { length: 40 }).notNull(),
    title: varchar("title", { length: 160 }).notNull(),
    periodLabel: varchar("periodLabel", { length: 96 }).notNull(),
    institutionalRateBps: int("institutionalRateBps").default(100).notNull(),
    status: mysqlEnum("status", [
      "pilot_disclosure",
      "planned",
      "paid",
      "cancelled",
    ])
      .default("pilot_disclosure")
      .notNull(),
    beneficiaryName: varchar("beneficiaryName", { length: 160 }),
    policyText: text("policyText").notNull(),
    approvedAmount: int("approvedAmount").default(0).notNull(),
    paidAmount: int("paidAmount").default(0).notNull(),
    reportUrl: varchar("reportUrl", { length: 512 }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [uniqueIndex("social_impact_cycle_public_unique").on(table.publicId)]
);

export type GameRuleset = typeof gameRulesets.$inferSelect;
export type GameRound = typeof gameRounds.$inferSelect;
export type VirtualWallet = typeof virtualWallets.$inferSelect;
export type PilotTicket = typeof pilotTickets.$inferSelect;

export const onlineTvSessions = mysqlTable(
  "online_tv_sessions",
  {
    id: int("id").autoincrement().primaryKey(),
    publicId: varchar("publicId", { length: 64 }).notNull(),
    gameId: varchar("gameId", { length: 32 }).notNull(),
    difficulty: mysqlEnum("difficulty", ["EASY", "STANDARD", "HARD"]).notNull(),
    contentVersion: varchar("contentVersion", { length: 64 }).notNull(),
    phase: mysqlEnum("phase", [
      "WAITING",
      "ACTIVE",
      "RESULT",
      "FINISHED",
    ]).notNull(),
    startedAt: timestamp("startedAt").notNull(),
    expiresAt: timestamp("expiresAt").notNull(),
    participantCount: int("participantCount").default(1).notNull(),
    score: int("score").default(0).notNull(),
    progress: int("progress").default(0).notNull(),
    threshold: int("threshold").notNull(),
    targetJson: text("targetJson").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [
    uniqueIndex("online_tv_session_public_unique").on(table.publicId),
    index("online_tv_session_expiry_index").on(table.expiresAt),
  ]
);

export const onlineTvContentItems = mysqlTable(
  "online_tv_content_items",
  {
    id: int("id").autoincrement().primaryKey(),
    gameId: varchar("gameId", { length: 32 }).notNull(),
    difficulty: mysqlEnum("difficulty", ["EASY", "STANDARD", "HARD"]).notNull(),
    contentVersion: varchar("contentVersion", { length: 64 }).notNull(),
    payloadJson: text("payloadJson").notNull(),
    enabled: boolean("enabled").default(true).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => [
    index("online_tv_content_lookup_index").on(
      table.gameId,
      table.difficulty,
      table.contentVersion,
      table.enabled
    ),
  ]
);

export const onlineTvActions = mysqlTable(
  "online_tv_actions",
  {
    id: int("id").autoincrement().primaryKey(),
    publicId: varchar("publicId", { length: 64 }).notNull(),
    sessionId: varchar("sessionId", { length: 64 }).notNull(),
    participantId: varchar("participantId", { length: 64 }).notNull(),
    actionType: varchar("actionType", { length: 32 }).notNull(),
    payloadJson: text("payloadJson").notNull(),
    accepted: boolean("accepted").notNull(),
    scoreDelta: int("scoreDelta").default(0).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => [
    uniqueIndex("online_tv_action_public_unique").on(table.publicId),
    uniqueIndex("online_tv_action_replay_unique").on(
      table.sessionId,
      table.participantId,
      table.publicId
    ),
    index("online_tv_action_session_index").on(
      table.sessionId,
      table.createdAt
    ),
  ]
);


/** Territorial trust layer: Mapper captures, The Eye verifies, Human Authority publishes. */
export const territorialCaptureSessions = mysqlTable(
  "territorial_capture_sessions",
  {
    id: int("id").autoincrement().primaryKey(),
    publicId: varchar("publicId", { length: 48 }).notNull(),
    name: varchar("name", { length: 180 }).notNull(),
    territory: varchar("territory", { length: 180 }).notNull(),
    mapperUserId: int("mapperUserId").notNull().references(() => users.id, { onDelete: "restrict" }),
    status: mysqlEnum("status", ["DRAFT", "ACTIVE", "PAUSED", "COMPLETED", "ARCHIVED"]).default("DRAFT").notNull(),
    syncStatus: mysqlEnum("syncStatus", ["OFFLINE", "PENDING", "SYNCED", "CONFLICT"]).default("SYNCED").notNull(),
    areaJson: text("areaJson").notNull(),
    objectCount: int("objectCount").default(0).notNull(),
    evidenceCount: int("evidenceCount").default(0).notNull(),
    startsAt: timestamp("startsAt").defaultNow().notNull(),
    endsAt: timestamp("endsAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [uniqueIndex("territorial_capture_session_public_unique").on(table.publicId), index("territorial_capture_session_mapper_index").on(table.mapperUserId, table.status, table.updatedAt)]
);

export const worldObjects = mysqlTable(
  "world_objects",
  {
    id: int("id").autoincrement().primaryKey(),
    publicId: varchar("publicId", { length: 48 }).notNull(),
    objectType: varchar("objectType", { length: 48 }).notNull(),
    name: varchar("name", { length: 180 }).notNull(),
    description: text("description").notNull(),
    geometryJson: text("geometryJson").notNull(),
    latitude: varchar("latitude", { length: 32 }).notNull(),
    longitude: varchar("longitude", { length: 32 }).notNull(),
    accuracyMeters: int("accuracyMeters").notNull(),
    status: mysqlEnum("status", ["DRAFT", "CAPTURED", "UNDER_REVIEW", "EVIDENCE_REQUIRED", "VERIFIED", "PUBLISHED", "DISPUTED", "OUTDATED", "REJECTED", "ARCHIVED"]).default("DRAFT").notNull(),
    publicationStatus: mysqlEnum("publicationStatus", ["UNPUBLISHED", "AUTHORIZED", "PUBLISHED", "HELD"]).default("UNPUBLISHED").notNull(),
    publishedVersion: int("publishedVersion"),
    capturedAt: timestamp("capturedAt"),
    confidenceScore: int("confidenceScore").default(0).notNull(),
    attributesJson: text("attributesJson").notNull(),
    relationsJson: text("relationsJson").notNull(),
    assetsJson: text("assetsJson").notNull(),
    version: int("version").default(1).notNull(),
    createdByUserId: int("createdByUserId").notNull().references(() => users.id, { onDelete: "restrict" }),
    updatedByUserId: int("updatedByUserId").references(() => users.id, { onDelete: "set null" }),
    captureSessionId: int("captureSessionId").references(() => territorialCaptureSessions.id, { onDelete: "set null" }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [uniqueIndex("world_object_public_unique").on(table.publicId), index("world_object_status_index").on(table.status, table.updatedAt), index("world_object_geo_index").on(table.latitude, table.longitude), index("world_object_capture_session_index").on(table.captureSessionId, table.updatedAt)]
);

export const territorialClaims = mysqlTable(
  "territorial_claims",
  {
    id: int("id").autoincrement().primaryKey(),
    publicId: varchar("publicId", { length: 48 }).notNull(),
    worldObjectId: int("worldObjectId").notNull().references(() => worldObjects.id, { onDelete: "cascade" }),
    text: text("text").notNull(),
    claimType: varchar("claimType", { length: 48 }).notNull(),
    verificationStatus: mysqlEnum("verificationStatus", ["UNVERIFIED", "UNDER_REVIEW", "VERIFIED", "DISPUTED", "REJECTED"]).default("UNVERIFIED").notNull(),
    confidenceScore: int("confidenceScore").default(0).notNull(),
    observations: text("observations").notNull(),
    version: int("version").default(1).notNull(),
    createdByUserId: int("createdByUserId").notNull().references(() => users.id, { onDelete: "restrict" }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [uniqueIndex("territorial_claim_public_unique").on(table.publicId), index("territorial_claim_object_index").on(table.worldObjectId, table.verificationStatus)]
);

export const territorialSources = mysqlTable(
  "territorial_sources",
  {
    id: int("id").autoincrement().primaryKey(),
    publicId: varchar("publicId", { length: 48 }).notNull(),
    worldObjectId: int("worldObjectId").notNull().references(() => worldObjects.id, { onDelete: "cascade" }),
    institutionOrPerson: varchar("institutionOrPerson", { length: 180 }).notNull(),
    sourceType: varchar("sourceType", { length: 48 }).notNull(),
    referenceUrl: varchar("referenceUrl", { length: 768 }),
    sourceDate: timestamp("sourceDate"),
    author: varchar("author", { length: 180 }),
    documentRef: varchar("documentRef", { length: 512 }),
    authorityLevel: int("authorityLevel").default(0).notNull(),
    observations: text("observations").notNull(),
    createdByUserId: int("createdByUserId").notNull().references(() => users.id, { onDelete: "restrict" }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => [uniqueIndex("territorial_source_public_unique").on(table.publicId), index("territorial_source_object_index").on(table.worldObjectId, table.authorityLevel)]
);

export const territorialEvidence = mysqlTable(
  "territorial_evidence",
  {
    id: int("id").autoincrement().primaryKey(),
    publicId: varchar("publicId", { length: 48 }).notNull(),
    worldObjectId: int("worldObjectId").notNull().references(() => worldObjects.id, { onDelete: "cascade" }),
    claimId: int("claimId").references(() => territorialClaims.id, { onDelete: "set null" }),
    evidenceType: varchar("evidenceType", { length: 48 }).notNull(),
    origin: varchar("origin", { length: 512 }).notNull(),
    capturedAt: timestamp("capturedAt").notNull(),
    responsibleUserId: int("responsibleUserId").notNull().references(() => users.id, { onDelete: "restrict" }),
    integrityHash: varchar("integrityHash", { length: 128 }).notNull(),
    version: int("version").default(1).notNull(),
    metadataJson: text("metadataJson").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => [uniqueIndex("territorial_evidence_public_unique").on(table.publicId), index("territorial_evidence_object_index").on(table.worldObjectId, table.createdAt)]
);

export const territorialVerificationReviews = mysqlTable(
  "territorial_verification_reviews",
  {
    id: int("id").autoincrement().primaryKey(),
    publicId: varchar("publicId", { length: 48 }).notNull(),
    worldObjectId: int("worldObjectId").notNull().references(() => worldObjects.id, { onDelete: "cascade" }),
    reviewerUserId: int("reviewerUserId").notNull().references(() => users.id, { onDelete: "restrict" }),
    decision: mysqlEnum("decision", ["REQUEST_EVIDENCE", "VERIFY", "DISPUTE", "REJECT", "ARCHIVE"]).notNull(),
    evidenceReviewedJson: text("evidenceReviewedJson").notNull(),
    approvedVersion: int("approvedVersion"),
    confidenceScore: int("confidenceScore").default(0).notNull(),
    previousStatus: varchar("previousStatus", { length: 24 }).notNull(),
    resultingStatus: varchar("resultingStatus", { length: 24 }).notNull(),
    reason: text("reason").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => [uniqueIndex("territorial_review_public_unique").on(table.publicId), index("territorial_review_object_index").on(table.worldObjectId, table.createdAt)]
);


export const territorialRoleAssignments = mysqlTable(
  "territorial_role_assignments",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    role: mysqlEnum("role", ["MAPPER_OPERATOR", "EYE_REVIEWER", "HUMAN_AUTHORITY"]).notNull(),
    assignedByUserId: int("assignedByUserId").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [uniqueIndex("territorial_role_user_unique").on(table.userId), index("territorial_role_lookup_index").on(table.role, table.userId)]
);

export const territorialAssets = mysqlTable(
  "territorial_assets",
  {
    id: int("id").autoincrement().primaryKey(),
    publicId: varchar("publicId", { length: 48 }).notNull(),
    worldObjectId: int("worldObjectId").notNull().references(() => worldObjects.id, { onDelete: "cascade" }),
    evidenceId: int("evidenceId").references(() => territorialEvidence.id, { onDelete: "set null" }),
    sourceId: int("sourceId").references(() => territorialSources.id, { onDelete: "set null" }),
    assetType: varchar("assetType", { length: 32 }).notNull(),
    originalName: varchar("originalName", { length: 255 }).notNull(),
    mimeType: varchar("mimeType", { length: 128 }).notNull(),
    byteSize: int("byteSize").notNull(),
    storageKey: varchar("storageKey", { length: 768 }).notNull(),
    storageUrl: varchar("storageUrl", { length: 1024 }).notNull(),
    integrityHash: varchar("integrityHash", { length: 128 }).notNull(),
    format: varchar("format", { length: 16 }).default("UNKNOWN").notNull(),
    metadataJson: text("metadataJson"),
    status: mysqlEnum("status", ["DRAFT", "VALIDATED", "AUTHORIZED", "PUBLISHED", "ARCHIVED", "REJECTED"]).default("DRAFT").notNull(),
    currentVersion: int("currentVersion").default(1).notNull(),
    publishedVersion: int("publishedVersion"),
    accessScope: mysqlEnum("accessScope", ["ADMIN_ONLY", "REVIEW_ONLY", "PUBLISHED_RUNTIME"]).default("ADMIN_ONLY").notNull(),
    uploadedByUserId: int("uploadedByUserId").notNull().references(() => users.id, { onDelete: "restrict" }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [uniqueIndex("territorial_asset_public_unique").on(table.publicId), index("territorial_asset_object_index").on(table.worldObjectId, table.createdAt), index("territorial_asset_scope_index").on(table.accessScope), index("territorial_asset_status_index").on(table.status)]
);

export const territorialAssetVersions = mysqlTable(
  "territorial_asset_versions",
  {
    id: int("id").autoincrement().primaryKey(),
    publicId: varchar("publicId", { length: 48 }).notNull(),
    assetId: int("assetId").notNull().references(() => territorialAssets.id, { onDelete: "restrict" }),
    version: int("version").notNull(),
    format: varchar("format", { length: 16 }).notNull(),
    originalName: varchar("originalName", { length: 255 }).notNull(),
    mimeType: varchar("mimeType", { length: 128 }).notNull(),
    byteSize: int("byteSize").notNull(),
    storageKey: varchar("storageKey", { length: 768 }).notNull(),
    storageUrl: varchar("storageUrl", { length: 1024 }).notNull(),
    checksum: varchar("checksum", { length: 128 }).notNull(),
    metadataJson: text("metadataJson").notNull(),
    status: mysqlEnum("status", ["DRAFT", "VALIDATED", "AUTHORIZED", "PUBLISHED", "ARCHIVED", "REJECTED"]).default("DRAFT").notNull(),
    createdByUserId: int("createdByUserId").notNull().references(() => users.id, { onDelete: "restrict" }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => [uniqueIndex("territorial_asset_version_public_unique").on(table.publicId), uniqueIndex("territorial_asset_version_unique").on(table.assetId, table.version), index("territorial_asset_version_status_index").on(table.assetId, table.status)]
);

/** World Engine robustness: immutable snapshots and controlled offline queue. */
export const territorialWorldObjectSnapshots = mysqlTable(
  "territorial_world_object_snapshots",
  {
    id: int("id").autoincrement().primaryKey(),
    publicId: varchar("publicId", { length: 48 }).notNull(),
    worldObjectId: int("worldObjectId").notNull().references(() => worldObjects.id, { onDelete: "restrict" }),
    captureSessionId: int("captureSessionId").references(() => territorialCaptureSessions.id, { onDelete: "set null" }),
    version: int("version").notNull(),
    stateJson: text("stateJson").notNull(),
    snapshotHash: varchar("snapshotHash", { length: 128 }).notNull(),
    createdByUserId: int("createdByUserId").notNull().references(() => users.id, { onDelete: "restrict" }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => [
    uniqueIndex("territorial_snapshot_public_unique").on(table.publicId),
    uniqueIndex("territorial_snapshot_object_version_unique").on(table.worldObjectId, table.version),
    index("territorial_snapshot_object_index").on(table.worldObjectId, table.createdAt),
  ]
);

export const territorialOfflineCaptures = mysqlTable(
  "territorial_offline_captures",
  {
    id: int("id").autoincrement().primaryKey(),
    publicId: varchar("publicId", { length: 48 }).notNull(),
    captureSessionId: int("captureSessionId").references(() => territorialCaptureSessions.id, { onDelete: "set null" }),
    mapperUserId: int("mapperUserId").notNull().references(() => users.id, { onDelete: "restrict" }),
    deviceFingerprint: varchar("deviceFingerprint", { length: 128 }).notNull(),
    clientCaptureId: varchar("clientCaptureId", { length: 96 }).notNull(),
    payloadJson: text("payloadJson").notNull(),
    status: mysqlEnum("status", ["OFFLINE", "PENDING_SYNC", "SYNCED", "CONFLICT", "REJECTED"]).default("PENDING_SYNC").notNull(),
    conflictJson: text("conflictJson").notNull(),
    syncedAt: timestamp("syncedAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [
    uniqueIndex("territorial_offline_capture_public_unique").on(table.publicId),
    uniqueIndex("territorial_offline_capture_client_unique").on(table.mapperUserId, table.clientCaptureId),
    index("territorial_offline_capture_status_index").on(table.mapperUserId, table.status, table.updatedAt),
  ]
);


/** Field QA reports: operational evidence, not a substitute for production certification. */
export const territorialFieldReports = mysqlTable(
  "territorial_field_reports",
  {
    id: int("id").autoincrement().primaryKey(),
    publicId: varchar("publicId", { length: 48 }).notNull(),
    mapperUserId: int("mapperUserId").references(() => users.id, { onDelete: "set null" }),
    protocol: varchar("protocol", { length: 160 }).notNull(),
    deviceA: varchar("deviceA", { length: 255 }).notNull(),
    deviceB: varchar("deviceB", { length: 255 }).notNull(),
    severity: mysqlEnum("severity", ["PASS", "BLOCKER", "CRITICAL", "MAJOR", "MINOR", "OBSERVATION"]).default("OBSERVATION").notNull(),
    observations: text("observations").notNull(),
    stepResultsJson: text("stepResultsJson").notNull(),
    completedStepsJson: text("completedStepsJson").notNull(),
    syncStatus: mysqlEnum("syncStatus", ["LOCAL_PENDING", "SYNCING", "SYNCED", "SYNC_ERROR"]).default("SYNCED").notNull(),
    reportHash: varchar("reportHash", { length: 128 }).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [
    uniqueIndex("territorial_field_report_public_unique").on(table.publicId),
    uniqueIndex("territorial_field_report_hash_unique").on(table.reportHash),
    index("territorial_field_report_mapper_index").on(table.mapperUserId, table.syncStatus, table.updatedAt),
  ]
);
