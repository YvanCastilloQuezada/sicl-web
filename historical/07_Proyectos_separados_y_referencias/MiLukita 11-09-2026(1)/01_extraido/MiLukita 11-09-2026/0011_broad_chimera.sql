CREATE TABLE `market_batch_previews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`publicId` varchar(40) NOT NULL,
	`userId` int NOT NULL,
	`marketId` int NOT NULL,
	`selectionsJson` text NOT NULL,
	`selectionHash` varchar(128) NOT NULL,
	`signature` varchar(128) NOT NULL,
	`expiresAt` timestamp NOT NULL,
	`confirmedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `market_batch_previews_id` PRIMARY KEY(`id`),
	CONSTRAINT `market_batch_preview_public_unique` UNIQUE(`publicId`)
);
--> statement-breakpoint
RENAME TABLE `lottery_batch_previews` TO `game_batch_previews`;--> statement-breakpoint
ALTER TABLE `game_batch_previews` DROP INDEX `lottery_batch_preview_public_unique`;--> statement-breakpoint
ALTER TABLE `game_batch_previews` DROP FOREIGN KEY `lottery_batch_previews_userId_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `game_batch_previews` DROP FOREIGN KEY `lottery_batch_previews_roundId_game_rounds_id_fk`;
--> statement-breakpoint
DROP INDEX `lottery_batch_preview_user_expiry_index` ON `game_batch_previews`;--> statement-breakpoint
ALTER TABLE `game_batch_previews` MODIFY COLUMN `gameType` enum('ruleta','jackpot','bingo','loteria','loteria_29','loteria_39','loteria_49','loteria_59','cartas') NOT NULL;--> statement-breakpoint
ALTER TABLE `game_batch_previews` ADD CONSTRAINT `game_batch_preview_public_unique` UNIQUE(`publicId`);--> statement-breakpoint
ALTER TABLE `market_batch_previews` ADD CONSTRAINT `market_batch_previews_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `market_batch_previews` ADD CONSTRAINT `market_batch_previews_marketId_market_events_id_fk` FOREIGN KEY (`marketId`) REFERENCES `market_events`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `market_batch_preview_user_expiry_index` ON `market_batch_previews` (`userId`,`expiresAt`);--> statement-breakpoint
ALTER TABLE `game_batch_previews` ADD CONSTRAINT `game_batch_previews_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `game_batch_previews` ADD CONSTRAINT `game_batch_previews_roundId_game_rounds_id_fk` FOREIGN KEY (`roundId`) REFERENCES `game_rounds`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `game_batch_preview_user_expiry_index` ON `game_batch_previews` (`userId`,`expiresAt`);
