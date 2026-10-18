CREATE TABLE `territorial_assets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`publicId` varchar(48) NOT NULL,
	`worldObjectId` int NOT NULL,
	`evidenceId` int,
	`sourceId` int,
	`assetType` varchar(32) NOT NULL,
	`originalName` varchar(255) NOT NULL,
	`mimeType` varchar(128) NOT NULL,
	`byteSize` int NOT NULL,
	`storageKey` varchar(768) NOT NULL,
	`storageUrl` varchar(1024) NOT NULL,
	`integrityHash` varchar(128) NOT NULL,
	`accessScope` enum('ADMIN_ONLY','REVIEW_ONLY','PUBLISHED_RUNTIME') NOT NULL DEFAULT 'ADMIN_ONLY',
	`uploadedByUserId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `territorial_assets_id` PRIMARY KEY(`id`),
	CONSTRAINT `territorial_asset_public_unique` UNIQUE(`publicId`)
);
--> statement-breakpoint
CREATE TABLE `territorial_role_assignments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`role` enum('MAPPER_OPERATOR','EYE_REVIEWER','HUMAN_AUTHORITY') NOT NULL,
	`assignedByUserId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `territorial_role_assignments_id` PRIMARY KEY(`id`),
	CONSTRAINT `territorial_role_user_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
ALTER TABLE `territorial_assets` ADD CONSTRAINT `tar_asset_obj_fk` FOREIGN KEY (`worldObjectId`) REFERENCES `world_objects`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `territorial_assets` ADD CONSTRAINT `tar_asset_evidence_fk` FOREIGN KEY (`evidenceId`) REFERENCES `territorial_evidence`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `territorial_assets` ADD CONSTRAINT `tar_asset_source_fk` FOREIGN KEY (`sourceId`) REFERENCES `territorial_sources`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `territorial_assets` ADD CONSTRAINT `tar_asset_user_fk` FOREIGN KEY (`uploadedByUserId`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `territorial_role_assignments` ADD CONSTRAINT `tar_role_user_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `territorial_role_assignments` ADD CONSTRAINT `tar_role_assigned_fk` FOREIGN KEY (`assignedByUserId`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `tar_asset_object_idx` ON `territorial_assets` (`worldObjectId`,`createdAt`);--> statement-breakpoint
CREATE INDEX `tar_asset_scope_idx` ON `territorial_assets` (`accessScope`);--> statement-breakpoint
CREATE INDEX `tar_role_lookup_idx` ON `territorial_role_assignments` (`role`,`userId`);