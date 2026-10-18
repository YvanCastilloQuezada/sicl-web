CREATE TABLE `audit_report_artifacts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`publicId` varchar(40) NOT NULL,
	`title` varchar(160) NOT NULL,
	`format` enum('pdf') NOT NULL DEFAULT 'pdf',
	`version` int NOT NULL DEFAULT 1,
	`storageKey` varchar(512) NOT NULL,
	`storageUrl` varchar(768) NOT NULL,
	`sha256` varchar(64) NOT NULL,
	`byteSize` int NOT NULL,
	`createdByUserId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `audit_report_artifacts_id` PRIMARY KEY(`id`),
	CONSTRAINT `audit_report_public_unique` UNIQUE(`publicId`)
);
--> statement-breakpoint
ALTER TABLE `audit_report_artifacts` ADD CONSTRAINT `audit_report_artifacts_createdByUserId_users_id_fk` FOREIGN KEY (`createdByUserId`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `audit_report_created_index` ON `audit_report_artifacts` (`createdAt`);