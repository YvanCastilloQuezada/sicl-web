CREATE TABLE `lottery_batch_previews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`publicId` varchar(40) NOT NULL,
	`userId` int NOT NULL,
	`roundId` int NOT NULL,
	`gameType` enum('loteria','loteria_29','loteria_39','loteria_49','loteria_59') NOT NULL,
	`selectionsJson` text NOT NULL,
	`selectionHash` varchar(128) NOT NULL,
	`signature` varchar(128) NOT NULL,
	`expiresAt` timestamp NOT NULL,
	`confirmedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `lottery_batch_previews_id` PRIMARY KEY(`id`),
	CONSTRAINT `lottery_batch_preview_public_unique` UNIQUE(`publicId`)
);
--> statement-breakpoint
ALTER TABLE `lottery_batch_previews` ADD CONSTRAINT `lottery_batch_previews_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `lottery_batch_previews` ADD CONSTRAINT `lottery_batch_previews_roundId_game_rounds_id_fk` FOREIGN KEY (`roundId`) REFERENCES `game_rounds`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `lottery_batch_preview_user_expiry_index` ON `lottery_batch_previews` (`userId`,`expiresAt`);