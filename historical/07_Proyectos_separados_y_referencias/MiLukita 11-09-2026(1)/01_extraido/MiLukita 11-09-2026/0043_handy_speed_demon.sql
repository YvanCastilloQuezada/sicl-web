CREATE TABLE `territorial_offline_captures` (
	`id` int AUTO_INCREMENT NOT NULL,
	`publicId` varchar(48) NOT NULL,
	`captureSessionId` int,
	`mapperUserId` int NOT NULL,
	`deviceFingerprint` varchar(128) NOT NULL,
	`clientCaptureId` varchar(96) NOT NULL,
	`payloadJson` text NOT NULL,
	`status` enum('OFFLINE','PENDING_SYNC','SYNCED','CONFLICT','REJECTED') NOT NULL DEFAULT 'PENDING_SYNC',
	`conflictJson` text NOT NULL,
	`syncedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `territorial_offline_captures_id` PRIMARY KEY(`id`),
	CONSTRAINT `territorial_offline_capture_public_unique` UNIQUE(`publicId`),
	CONSTRAINT `territorial_offline_capture_client_unique` UNIQUE(`mapperUserId`,`clientCaptureId`)
);
--> statement-breakpoint
CREATE TABLE `territorial_world_object_snapshots` (
	`id` int AUTO_INCREMENT NOT NULL,
	`publicId` varchar(48) NOT NULL,
	`worldObjectId` int NOT NULL,
	`captureSessionId` int,
	`version` int NOT NULL,
	`stateJson` text NOT NULL,
	`snapshotHash` varchar(128) NOT NULL,
	`createdByUserId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `territorial_world_object_snapshots_id` PRIMARY KEY(`id`),
	CONSTRAINT `territorial_snapshot_public_unique` UNIQUE(`publicId`),
	CONSTRAINT `territorial_snapshot_object_version_unique` UNIQUE(`worldObjectId`,`version`)
);
--> statement-breakpoint
ALTER TABLE `territorial_offline_captures` ADD CONSTRAINT `territ_offline_session_fk` FOREIGN KEY (`captureSessionId`) REFERENCES `territorial_capture_sessions`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `territorial_offline_captures` ADD CONSTRAINT `territ_offline_mapper_fk` FOREIGN KEY (`mapperUserId`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `territorial_world_object_snapshots` ADD CONSTRAINT `territ_snapshot_object_fk` FOREIGN KEY (`worldObjectId`) REFERENCES `world_objects`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `territorial_world_object_snapshots` ADD CONSTRAINT `territ_snapshot_session_fk` FOREIGN KEY (`captureSessionId`) REFERENCES `territorial_capture_sessions`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `territorial_world_object_snapshots` ADD CONSTRAINT `territ_snapshot_creator_fk` FOREIGN KEY (`createdByUserId`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `territorial_offline_capture_status_index` ON `territorial_offline_captures` (`mapperUserId`,`status`,`updatedAt`);--> statement-breakpoint
CREATE INDEX `territorial_snapshot_object_index` ON `territorial_world_object_snapshots` (`worldObjectId`,`createdAt`);