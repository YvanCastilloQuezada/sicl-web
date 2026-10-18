CREATE TABLE `lukita_script_versions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`publicId` varchar(40) NOT NULL,
	`trigger` varchar(32) NOT NULL,
	`locale` varchar(16) NOT NULL DEFAULT 'es-PE',
	`text` varchar(280) NOT NULL,
	`fallback` varchar(280) NOT NULL,
	`enabled` boolean NOT NULL DEFAULT true,
	`version` int NOT NULL DEFAULT 1,
	`source` enum('deterministic_template','operator_edit','ai_generated') NOT NULL DEFAULT 'deterministic_template',
	`status` enum('draft','active','archived') NOT NULL DEFAULT 'active',
	`createdByUserId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `lukita_script_versions_id` PRIMARY KEY(`id`),
	CONSTRAINT `lukita_script_public_unique` UNIQUE(`publicId`)
);
--> statement-breakpoint
ALTER TABLE `lukita_script_versions` ADD CONSTRAINT `lukita_script_versions_createdByUserId_users_id_fk` FOREIGN KEY (`createdByUserId`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `lukita_script_trigger_status_index` ON `lukita_script_versions` (`trigger`,`status`,`version`);