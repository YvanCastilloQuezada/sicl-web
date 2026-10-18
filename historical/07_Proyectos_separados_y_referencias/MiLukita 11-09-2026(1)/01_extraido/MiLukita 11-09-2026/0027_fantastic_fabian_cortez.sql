CREATE TABLE `virtual_reward_ledger` (
	`id` int AUTO_INCREMENT NOT NULL,
	`publicId` varchar(40) NOT NULL,
	`userId` int NOT NULL,
	`kind` enum('TOURNAMENT_PRIZE','COOPERATIVE_ACHIEVEMENT') NOT NULL,
	`amount` int NOT NULL,
	`reason` varchar(255) NOT NULL,
	`idempotencyKey` varchar(128) NOT NULL,
	`metadataJson` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `virtual_reward_ledger_id` PRIMARY KEY(`id`),
	CONSTRAINT `virtual_reward_public_unique` UNIQUE(`publicId`),
	CONSTRAINT `virtual_reward_idempotency_unique` UNIQUE(`idempotencyKey`)
);
--> statement-breakpoint
ALTER TABLE `wallet_transactions` MODIFY COLUMN `type` enum('welcome_bonus','daily_reward','mission_reward','ticket_debit','virtual_prize','promotion_bonus','tournament_reward','cooperative_achievement','market_debit','market_payout','market_refund','manual_adjustment') NOT NULL;--> statement-breakpoint
ALTER TABLE `virtual_reward_ledger` ADD CONSTRAINT `virtual_reward_ledger_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `virtual_reward_user_index` ON `virtual_reward_ledger` (`userId`,`createdAt`);