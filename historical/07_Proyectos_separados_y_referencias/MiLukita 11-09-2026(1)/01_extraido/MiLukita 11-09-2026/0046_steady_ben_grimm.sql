CREATE TABLE `share_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`publicId` varchar(48) NOT NULL,
	`targetId` int NOT NULL,
	`tokenHash` varchar(128) NOT NULL,
	`userId` int,
	`status` enum('ACTIVE','REVOKED','EXPIRED') NOT NULL DEFAULT 'ACTIVE',
	`expiresAt` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`revokedAt` timestamp,
	CONSTRAINT `share_sessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `share_session_public_unique` UNIQUE(`publicId`),
	CONSTRAINT `share_session_token_unique` UNIQUE(`tokenHash`)
);
--> statement-breakpoint
CREATE TABLE `share_targets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`publicId` varchar(48) NOT NULL,
	`ownerUserId` int NOT NULL,
	`targetType` enum('PUBLIC_LUKA','EXPERIENCE','CONTROLLER','LANDING','CONTENT') NOT NULL,
	`destinationPath` varchar(512) NOT NULL,
	`metadataJson` text NOT NULL,
	`capability` enum('PUBLIC_EXPERIENCE','TERRITORIAL_RUNTIME','CONTROLLER_LAB','AUDIT_VIEW','AR_VIEW') NOT NULL,
	`priority` int NOT NULL DEFAULT 50,
	`status` enum('ACTIVE','REVOKED','EXPIRED') NOT NULL DEFAULT 'ACTIVE',
	`expiresAt` timestamp,
	`revokedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `share_targets_id` PRIMARY KEY(`id`),
	CONSTRAINT `share_target_public_unique` UNIQUE(`publicId`)
);
--> statement-breakpoint
ALTER TABLE `share_sessions` ADD CONSTRAINT `share_sessions_targetId_share_targets_id_fk` FOREIGN KEY (`targetId`) REFERENCES `share_targets`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `share_sessions` ADD CONSTRAINT `share_sessions_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `share_targets` ADD CONSTRAINT `share_targets_ownerUserId_users_id_fk` FOREIGN KEY (`ownerUserId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `share_session_target_index` ON `share_sessions` (`targetId`,`status`,`expiresAt`);--> statement-breakpoint
CREATE INDEX `share_target_lookup_index` ON `share_targets` (`destinationPath`,`status`,`priority`);--> statement-breakpoint
CREATE INDEX `share_target_owner_index` ON `share_targets` (`ownerUserId`,`status`);