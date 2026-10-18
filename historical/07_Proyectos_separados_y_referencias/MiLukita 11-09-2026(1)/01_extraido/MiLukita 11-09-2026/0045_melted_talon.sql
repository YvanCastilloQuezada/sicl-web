CREATE TABLE `territorial_field_reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`publicId` varchar(48) NOT NULL,
	`mapperUserId` int,
	`protocol` varchar(160) NOT NULL,
	`deviceA` varchar(255) NOT NULL,
	`deviceB` varchar(255) NOT NULL,
	`severity` enum('PASS','BLOCKER','CRITICAL','MAJOR','MINOR','OBSERVATION') NOT NULL DEFAULT 'OBSERVATION',
	`observations` text NOT NULL,
	`stepResultsJson` text NOT NULL,
	`completedStepsJson` text NOT NULL,
	`syncStatus` enum('LOCAL_PENDING','SYNCING','SYNCED','SYNC_ERROR') NOT NULL DEFAULT 'SYNCED',
	`reportHash` varchar(128) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `territorial_field_reports_id` PRIMARY KEY(`id`),
	CONSTRAINT `territorial_field_report_public_unique` UNIQUE(`publicId`),
	CONSTRAINT `territorial_field_report_hash_unique` UNIQUE(`reportHash`)
);
--> statement-breakpoint
ALTER TABLE `territorial_field_reports` ADD CONSTRAINT `territorial_field_reports_mapperUserId_users_id_fk` FOREIGN KEY (`mapperUserId`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `territorial_field_report_mapper_index` ON `territorial_field_reports` (`mapperUserId`,`syncStatus`,`updatedAt`);