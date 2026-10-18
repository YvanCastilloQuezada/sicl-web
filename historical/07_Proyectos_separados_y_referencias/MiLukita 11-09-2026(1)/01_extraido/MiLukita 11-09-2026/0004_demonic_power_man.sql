CREATE TABLE `missions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(64) NOT NULL,
	`title` varchar(128) NOT NULL,
	`description` varchar(255) NOT NULL,
	`targetCount` int NOT NULL,
	`rewardCredits` int NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `missions_id` PRIMARY KEY(`id`),
	CONSTRAINT `mission_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `player_mission_progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`missionId` int NOT NULL,
	`progressCount` int NOT NULL DEFAULT 0,
	`completedAt` timestamp,
	`claimedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `player_mission_progress_id` PRIMARY KEY(`id`),
	CONSTRAINT `player_mission_unique` UNIQUE(`userId`,`missionId`)
);
--> statement-breakpoint
CREATE TABLE `promotion_rules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(64) NOT NULL,
	`label` varchar(128) NOT NULL,
	`kind` enum('volume_discount','streak_bonus','multiplier') NOT NULL,
	`conditionsJson` text NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdByUserId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `promotion_rules_id` PRIMARY KEY(`id`),
	CONSTRAINT `promotion_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
ALTER TABLE `game_rounds` ADD `jackpotPoolCredits` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `pilot_tickets` ADD `virtualPrizeAmount` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `player_mission_progress` ADD CONSTRAINT `player_mission_progress_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `player_mission_progress` ADD CONSTRAINT `player_mission_progress_missionId_missions_id_fk` FOREIGN KEY (`missionId`) REFERENCES `missions`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `promotion_rules` ADD CONSTRAINT `promotion_rules_createdByUserId_users_id_fk` FOREIGN KEY (`createdByUserId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;