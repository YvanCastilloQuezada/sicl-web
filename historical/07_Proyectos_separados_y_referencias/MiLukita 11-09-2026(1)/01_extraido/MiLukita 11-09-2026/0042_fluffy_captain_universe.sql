CREATE TABLE `territorial_capture_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`publicId` varchar(48) NOT NULL,
	`name` varchar(180) NOT NULL,
	`territory` varchar(180) NOT NULL,
	`mapperUserId` int NOT NULL,
	`status` enum('DRAFT','ACTIVE','PAUSED','COMPLETED','ARCHIVED') NOT NULL DEFAULT 'DRAFT',
	`syncStatus` enum('OFFLINE','PENDING','SYNCED','CONFLICT') NOT NULL DEFAULT 'SYNCED',
	`areaJson` text NOT NULL,
	`objectCount` int NOT NULL DEFAULT 0,
	`evidenceCount` int NOT NULL DEFAULT 0,
	`startsAt` timestamp NOT NULL DEFAULT (now()),
	`endsAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `territorial_capture_sessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `territorial_capture_session_public_unique` UNIQUE(`publicId`)
);
--> statement-breakpoint
ALTER TABLE `world_objects` ADD `captureSessionId` int;--> statement-breakpoint
ALTER TABLE `territorial_capture_sessions` ADD CONSTRAINT `tcs_mapper_fk` FOREIGN KEY (`mapperUserId`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `tcs_mapper_idx` ON `territorial_capture_sessions` (`mapperUserId`,`status`,`updatedAt`);--> statement-breakpoint
ALTER TABLE `world_objects` ADD CONSTRAINT `wo_capture_session_fk` FOREIGN KEY (`captureSessionId`) REFERENCES `territorial_capture_sessions`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `wo_capture_session_idx` ON `world_objects` (`captureSessionId`,`updatedAt`);