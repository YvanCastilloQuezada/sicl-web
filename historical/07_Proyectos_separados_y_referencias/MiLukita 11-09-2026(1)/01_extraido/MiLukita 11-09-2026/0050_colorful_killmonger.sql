CREATE TABLE `territorial_asset_versions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`publicId` varchar(48) NOT NULL,
	`assetId` int NOT NULL,
	`version` int NOT NULL,
	`format` varchar(16) NOT NULL,
	`originalName` varchar(255) NOT NULL,
	`mimeType` varchar(128) NOT NULL,
	`byteSize` int NOT NULL,
	`storageKey` varchar(768) NOT NULL,
	`storageUrl` varchar(1024) NOT NULL,
	`checksum` varchar(128) NOT NULL,
	`metadataJson` text NOT NULL,
	`status` enum('DRAFT','VALIDATED','AUTHORIZED','PUBLISHED','ARCHIVED','REJECTED') NOT NULL DEFAULT 'DRAFT',
	`createdByUserId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `territorial_asset_versions_id` PRIMARY KEY(`id`),
	CONSTRAINT `territorial_asset_version_public_unique` UNIQUE(`publicId`),
	CONSTRAINT `territorial_asset_version_unique` UNIQUE(`assetId`,`version`)
);
--> statement-breakpoint
ALTER TABLE `territorial_assets` ADD `format` varchar(16) DEFAULT 'UNKNOWN' NOT NULL;--> statement-breakpoint
ALTER TABLE `territorial_assets` ADD `metadataJson` text;--> statement-breakpoint
ALTER TABLE `territorial_assets` ADD `status` enum('DRAFT','VALIDATED','AUTHORIZED','PUBLISHED','ARCHIVED','REJECTED') DEFAULT 'DRAFT' NOT NULL;--> statement-breakpoint
ALTER TABLE `territorial_assets` ADD `currentVersion` int DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE `territorial_assets` ADD `publishedVersion` int;--> statement-breakpoint
ALTER TABLE `territorial_assets` ADD `updatedAt` timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL ON UPDATE CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `territorial_asset_versions` ADD CONSTRAINT `territorial_asset_versions_assetId_territorial_assets_id_fk` FOREIGN KEY (`assetId`) REFERENCES `territorial_assets`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `territorial_asset_versions` ADD CONSTRAINT `territorial_asset_versions_createdByUserId_users_id_fk` FOREIGN KEY (`createdByUserId`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `territorial_asset_version_status_index` ON `territorial_asset_versions` (`assetId`,`status`);--> statement-breakpoint
CREATE INDEX `territorial_asset_status_index` ON `territorial_assets` (`status`);