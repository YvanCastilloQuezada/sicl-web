CREATE TABLE `market_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`publicId` varchar(40) NOT NULL,
	`title` varchar(220) NOT NULL,
	`description` text NOT NULL,
	`category` varchar(48) NOT NULL,
	`sourceLabel` varchar(160) NOT NULL,
	`sourceUrl` varchar(512) NOT NULL,
	`resolutionRule` text NOT NULL,
	`state` enum('draft','open','closed','settled','voided') NOT NULL DEFAULT 'draft',
	`yesPriceCredits` int NOT NULL DEFAULT 50,
	`noPriceCredits` int NOT NULL DEFAULT 50,
	`payoutCredits` int NOT NULL DEFAULT 100,
	`closesAt` timestamp NOT NULL,
	`resolvesAt` timestamp,
	`outcome` enum('yes','no'),
	`resolutionUrl` varchar(512),
	`pilotOnly` boolean NOT NULL DEFAULT true,
	`createdByUserId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `market_events_id` PRIMARY KEY(`id`),
	CONSTRAINT `market_event_public_unique` UNIQUE(`publicId`)
);
--> statement-breakpoint
CREATE TABLE `market_positions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`publicId` varchar(40) NOT NULL,
	`userId` int NOT NULL,
	`marketId` int NOT NULL,
	`side` enum('yes','no') NOT NULL,
	`contracts` int NOT NULL,
	`unitCostCredits` int NOT NULL,
	`virtualCost` int NOT NULL,
	`virtualPayout` int NOT NULL DEFAULT 0,
	`status` enum('active','settled','refunded') NOT NULL DEFAULT 'active',
	`idempotencyKey` varchar(96) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`settledAt` timestamp,
	CONSTRAINT `market_positions_id` PRIMARY KEY(`id`),
	CONSTRAINT `market_position_public_unique` UNIQUE(`publicId`),
	CONSTRAINT `market_position_idempotency_unique` UNIQUE(`idempotencyKey`)
);
--> statement-breakpoint
CREATE TABLE `social_impact_cycles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`publicId` varchar(40) NOT NULL,
	`title` varchar(160) NOT NULL,
	`periodLabel` varchar(96) NOT NULL,
	`institutionalRateBps` int NOT NULL DEFAULT 100,
	`status` enum('pilot_disclosure','planned','paid','cancelled') NOT NULL DEFAULT 'pilot_disclosure',
	`beneficiaryName` varchar(160),
	`policyText` text NOT NULL,
	`approvedAmount` int NOT NULL DEFAULT 0,
	`paidAmount` int NOT NULL DEFAULT 0,
	`reportUrl` varchar(512),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `social_impact_cycles_id` PRIMARY KEY(`id`),
	CONSTRAINT `social_impact_cycle_public_unique` UNIQUE(`publicId`)
);
--> statement-breakpoint
ALTER TABLE `game_rounds` MODIFY COLUMN `gameType` enum('ruleta','jackpot','bingo','loteria','cartas') NOT NULL;--> statement-breakpoint
ALTER TABLE `game_rulesets` MODIFY COLUMN `gameType` enum('ruleta','jackpot','bingo','loteria','cartas') NOT NULL;--> statement-breakpoint
ALTER TABLE `pilot_tickets` MODIFY COLUMN `gameType` enum('ruleta','jackpot','bingo','loteria','cartas') NOT NULL;--> statement-breakpoint
ALTER TABLE `wallet_transactions` MODIFY COLUMN `type` enum('welcome_bonus','daily_reward','mission_reward','ticket_debit','virtual_prize','promotion_bonus','market_debit','market_payout','market_refund','manual_adjustment') NOT NULL;--> statement-breakpoint
ALTER TABLE `market_events` ADD CONSTRAINT `market_events_createdByUserId_users_id_fk` FOREIGN KEY (`createdByUserId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `market_positions` ADD CONSTRAINT `market_positions_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `market_positions` ADD CONSTRAINT `market_positions_marketId_market_events_id_fk` FOREIGN KEY (`marketId`) REFERENCES `market_events`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `market_event_state_close_index` ON `market_events` (`state`,`closesAt`);--> statement-breakpoint
CREATE INDEX `market_position_market_index` ON `market_positions` (`marketId`,`createdAt`);--> statement-breakpoint
CREATE INDEX `market_position_user_index` ON `market_positions` (`userId`,`createdAt`);