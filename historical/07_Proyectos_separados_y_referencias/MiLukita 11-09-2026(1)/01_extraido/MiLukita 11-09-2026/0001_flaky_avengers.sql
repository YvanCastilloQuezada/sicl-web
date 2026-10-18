CREATE TABLE `audit_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`publicId` varchar(40) NOT NULL,
	`actorUserId` int,
	`eventType` varchar(64) NOT NULL,
	`entityType` varchar(64) NOT NULL,
	`entityPublicId` varchar(64) NOT NULL,
	`payloadJson` text NOT NULL,
	`previousHash` varchar(128),
	`eventHash` varchar(128) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `audit_events_id` PRIMARY KEY(`id`),
	CONSTRAINT `audit_event_public_unique` UNIQUE(`publicId`)
);
--> statement-breakpoint
CREATE TABLE `game_rounds` (
	`id` int AUTO_INCREMENT NOT NULL,
	`publicId` varchar(40) NOT NULL,
	`gameType` enum('ruleta','jackpot','bingo','loteria') NOT NULL,
	`rulesetId` int NOT NULL,
	`state` enum('draft','open','locked','drawn','settled','archived') NOT NULL DEFAULT 'draft',
	`opensAt` timestamp NOT NULL,
	`closesAt` timestamp NOT NULL,
	`serverSeedHash` varchar(128) NOT NULL,
	`revealedServerSeed` text,
	`publicSeed` text,
	`ticketSetHash` varchar(128),
	`resultJson` text,
	`algorithmVersion` varchar(64) NOT NULL,
	`createdByUserId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`lockedAt` timestamp,
	`drawnAt` timestamp,
	`settledAt` timestamp,
	CONSTRAINT `game_rounds_id` PRIMARY KEY(`id`),
	CONSTRAINT `game_round_public_id_unique` UNIQUE(`publicId`)
);
--> statement-breakpoint
CREATE TABLE `game_rulesets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`gameType` enum('ruleta','jackpot','bingo','loteria') NOT NULL,
	`version` varchar(32) NOT NULL,
	`title` varchar(128) NOT NULL,
	`rulesJson` text NOT NULL,
	`prizePolicyJson` text NOT NULL,
	`isPublished` boolean NOT NULL DEFAULT false,
	`createdByUserId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `game_rulesets_id` PRIMARY KEY(`id`),
	CONSTRAINT `ruleset_game_version_unique` UNIQUE(`gameType`,`version`)
);
--> statement-breakpoint
CREATE TABLE `payment_references` (
	`id` int AUTO_INCREMENT NOT NULL,
	`publicId` varchar(40) NOT NULL,
	`userId` int NOT NULL,
	`provider` enum('yape') NOT NULL DEFAULT 'yape',
	`status` enum('disabled','pending','confirmed','rejected','expired') NOT NULL DEFAULT 'disabled',
	`countryCode` varchar(2) NOT NULL DEFAULT 'PE',
	`virtualAmount` int NOT NULL,
	`idempotencyKey` varchar(96) NOT NULL,
	`providerReference` varchar(128),
	`metadataJson` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `payment_references_id` PRIMARY KEY(`id`),
	CONSTRAINT `payment_reference_public_unique` UNIQUE(`publicId`),
	CONSTRAINT `payment_reference_idempotency_unique` UNIQUE(`idempotencyKey`)
);
--> statement-breakpoint
CREATE TABLE `pilot_tickets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`publicId` varchar(40) NOT NULL,
	`userId` int NOT NULL,
	`roundId` int NOT NULL,
	`gameType` enum('ruleta','jackpot','bingo','loteria') NOT NULL,
	`picksJson` text NOT NULL,
	`quantity` int NOT NULL DEFAULT 1,
	`virtualCost` int NOT NULL,
	`benefitTier` varchar(32) NOT NULL,
	`status` enum('reserved','confirmed','settled','cancelled') NOT NULL DEFAULT 'reserved',
	`resultJson` text,
	`ticketHash` varchar(128) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `pilot_tickets_id` PRIMARY KEY(`id`),
	CONSTRAINT `pilot_ticket_public_unique` UNIQUE(`publicId`)
);
--> statement-breakpoint
CREATE TABLE `virtual_wallets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`balance` int NOT NULL DEFAULT 0,
	`welcomeBonusClaimed` boolean NOT NULL DEFAULT false,
	`lastDailyRewardAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `virtual_wallets_id` PRIMARY KEY(`id`),
	CONSTRAINT `wallet_user_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `wallet_transactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`publicId` varchar(40) NOT NULL,
	`userId` int NOT NULL,
	`type` enum('welcome_bonus','daily_reward','mission_reward','ticket_debit','virtual_prize','promotion_bonus','manual_adjustment') NOT NULL,
	`amount` int NOT NULL,
	`balanceAfter` int NOT NULL,
	`idempotencyKey` varchar(96) NOT NULL,
	`description` varchar(255) NOT NULL,
	`metadataJson` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `wallet_transactions_id` PRIMARY KEY(`id`),
	CONSTRAINT `wallet_transaction_public_unique` UNIQUE(`publicId`),
	CONSTRAINT `wallet_transaction_idempotency_unique` UNIQUE(`idempotencyKey`)
);
--> statement-breakpoint
ALTER TABLE `audit_events` ADD CONSTRAINT `audit_events_actorUserId_users_id_fk` FOREIGN KEY (`actorUserId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `game_rounds` ADD CONSTRAINT `game_rounds_rulesetId_game_rulesets_id_fk` FOREIGN KEY (`rulesetId`) REFERENCES `game_rulesets`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `game_rounds` ADD CONSTRAINT `game_rounds_createdByUserId_users_id_fk` FOREIGN KEY (`createdByUserId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `game_rulesets` ADD CONSTRAINT `game_rulesets_createdByUserId_users_id_fk` FOREIGN KEY (`createdByUserId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payment_references` ADD CONSTRAINT `payment_references_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pilot_tickets` ADD CONSTRAINT `pilot_tickets_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pilot_tickets` ADD CONSTRAINT `pilot_tickets_roundId_game_rounds_id_fk` FOREIGN KEY (`roundId`) REFERENCES `game_rounds`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `virtual_wallets` ADD CONSTRAINT `virtual_wallets_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `wallet_transactions` ADD CONSTRAINT `wallet_transactions_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `audit_event_entity_index` ON `audit_events` (`entityType`,`entityPublicId`,`createdAt`);--> statement-breakpoint
CREATE INDEX `game_round_type_state_index` ON `game_rounds` (`gameType`,`state`);--> statement-breakpoint
CREATE INDEX `pilot_ticket_round_index` ON `pilot_tickets` (`roundId`,`createdAt`);--> statement-breakpoint
CREATE INDEX `pilot_ticket_user_index` ON `pilot_tickets` (`userId`,`createdAt`);--> statement-breakpoint
CREATE INDEX `wallet_transaction_user_index` ON `wallet_transactions` (`userId`,`createdAt`);