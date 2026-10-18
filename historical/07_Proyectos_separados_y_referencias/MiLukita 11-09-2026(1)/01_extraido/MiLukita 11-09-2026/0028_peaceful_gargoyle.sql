CREATE TABLE `online_tv_content_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`gameId` varchar(32) NOT NULL,
	`difficulty` enum('EASY','STANDARD','HARD') NOT NULL,
	`contentVersion` varchar(64) NOT NULL,
	`payloadJson` text NOT NULL,
	`enabled` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `online_tv_content_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `online_tv_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`publicId` varchar(64) NOT NULL,
	`gameId` varchar(32) NOT NULL,
	`difficulty` enum('EASY','STANDARD','HARD') NOT NULL,
	`contentVersion` varchar(64) NOT NULL,
	`phase` enum('WAITING','ACTIVE','RESULT','FINISHED') NOT NULL,
	`startedAt` timestamp NOT NULL,
	`expiresAt` timestamp NOT NULL,
	`participantCount` int NOT NULL DEFAULT 1,
	`score` int NOT NULL DEFAULT 0,
	`progress` int NOT NULL DEFAULT 0,
	`threshold` int NOT NULL,
	`targetJson` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `online_tv_sessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `online_tv_session_public_unique` UNIQUE(`publicId`)
);
--> statement-breakpoint
CREATE INDEX `online_tv_content_lookup_index` ON `online_tv_content_items` (`gameId`,`difficulty`,`contentVersion`,`enabled`);--> statement-breakpoint
CREATE INDEX `online_tv_session_expiry_index` ON `online_tv_sessions` (`expiresAt`);