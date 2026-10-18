CREATE TABLE `milukita_consents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`publicId` varchar(40) NOT NULL,
	`identityId` int NOT NULL,
	`consentType` enum('terms','privacy','marketing','analytics','personalization') NOT NULL,
	`version` varchar(32) NOT NULL,
	`status` enum('GRANTED','REVOKED') NOT NULL,
	`source` varchar(32) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `milukita_consents_id` PRIMARY KEY(`id`),
	CONSTRAINT `milukita_consent_public_unique` UNIQUE(`publicId`)
);
--> statement-breakpoint
CREATE TABLE `milukita_devices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`publicId` varchar(40) NOT NULL,
	`identityId` int NOT NULL,
	`deviceHash` varchar(128) NOT NULL,
	`deviceStatus` enum('ACTIVE','REVOKED') NOT NULL DEFAULT 'ACTIVE',
	`lastSeen` timestamp NOT NULL DEFAULT (now()),
	`revokedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `milukita_devices_id` PRIMARY KEY(`id`),
	CONSTRAINT `milukita_device_public_unique` UNIQUE(`publicId`),
	CONSTRAINT `milukita_device_identity_hash_unique` UNIQUE(`identityId`,`deviceHash`)
);
--> statement-breakpoint
CREATE TABLE `milukita_event_contexts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`publicId` varchar(40) NOT NULL,
	`eventId` varchar(96) NOT NULL,
	`showId` varchar(96),
	`segmentId` varchar(96),
	`campaignId` varchar(96),
	`distributionContext` varchar(96),
	`expiresAt` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `milukita_event_contexts_id` PRIMARY KEY(`id`),
	CONSTRAINT `milukita_event_context_public_unique` UNIQUE(`publicId`)
);
--> statement-breakpoint
CREATE TABLE `milukita_identities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`publicId` varchar(40) NOT NULL,
	`userId` int NOT NULL,
	`identityLevel` enum('VISITOR','FREE','VERIFIED_PREMIUM_READY') NOT NULL DEFAULT 'FREE',
	`verificationStatus` enum('UNVERIFIED','BASIC','VERIFIED','REQUIRES_REVIEW') NOT NULL DEFAULT 'BASIC',
	`planCode` varchar(32) NOT NULL DEFAULT 'FREE',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `milukita_identities_id` PRIMARY KEY(`id`),
	CONSTRAINT `milukita_identity_public_unique` UNIQUE(`publicId`),
	CONSTRAINT `milukita_identity_user_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `milukita_participation_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`publicId` varchar(40) NOT NULL,
	`identityId` int NOT NULL,
	`deviceId` int,
	`sessionId` int,
	`eventContextId` int,
	`eventId` varchar(96) NOT NULL,
	`status` enum('CREATED','IDENTIFIED','ELIGIBLE','STARTED','SUBMITTED','COMPLETED','EXPIRED','REJECTED','CANCELLED') NOT NULL DEFAULT 'CREATED',
	`source` varchar(32) NOT NULL DEFAULT 'qr',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`startedAt` timestamp,
	`completedAt` timestamp,
	CONSTRAINT `milukita_participation_sessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `milukita_participation_public_unique` UNIQUE(`publicId`)
);
--> statement-breakpoint
CREATE TABLE `milukita_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`publicId` varchar(40) NOT NULL,
	`identityId` int NOT NULL,
	`deviceId` int,
	`status` enum('ACTIVE','EXPIRED','REVOKED') NOT NULL DEFAULT 'ACTIVE',
	`expiresAt` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`lastSeen` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `milukita_sessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `milukita_session_public_unique` UNIQUE(`publicId`)
);
--> statement-breakpoint
ALTER TABLE `milukita_consents` ADD CONSTRAINT `milukita_consents_identityId_milukita_identities_id_fk` FOREIGN KEY (`identityId`) REFERENCES `milukita_identities`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `milukita_devices` ADD CONSTRAINT `milukita_devices_identityId_milukita_identities_id_fk` FOREIGN KEY (`identityId`) REFERENCES `milukita_identities`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `milukita_identities` ADD CONSTRAINT `milukita_identities_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `milukita_participation_sessions` ADD CONSTRAINT `milukita_participation_sessions_identityId_milukita_identities_id_fk` FOREIGN KEY (`identityId`) REFERENCES `milukita_identities`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `milukita_participation_sessions` ADD CONSTRAINT `milukita_participation_sessions_deviceId_milukita_devices_id_fk` FOREIGN KEY (`deviceId`) REFERENCES `milukita_devices`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `milukita_participation_sessions` ADD CONSTRAINT `milukita_participation_sessions_sessionId_milukita_sessions_id_fk` FOREIGN KEY (`sessionId`) REFERENCES `milukita_sessions`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `milukita_participation_sessions` ADD CONSTRAINT `milukita_participation_sessions_eventContextId_milukita_event_contexts_id_fk` FOREIGN KEY (`eventContextId`) REFERENCES `milukita_event_contexts`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `milukita_sessions` ADD CONSTRAINT `milukita_sessions_identityId_milukita_identities_id_fk` FOREIGN KEY (`identityId`) REFERENCES `milukita_identities`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `milukita_sessions` ADD CONSTRAINT `milukita_sessions_deviceId_milukita_devices_id_fk` FOREIGN KEY (`deviceId`) REFERENCES `milukita_devices`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `milukita_consent_identity_type_index` ON `milukita_consents` (`identityId`,`consentType`,`createdAt`);--> statement-breakpoint
CREATE INDEX `milukita_device_status_index` ON `milukita_devices` (`deviceStatus`,`lastSeen`);--> statement-breakpoint
CREATE INDEX `milukita_event_context_event_index` ON `milukita_event_contexts` (`eventId`,`expiresAt`);--> statement-breakpoint
CREATE INDEX `milukita_participation_identity_event_index` ON `milukita_participation_sessions` (`identityId`,`eventId`,`createdAt`);--> statement-breakpoint
CREATE INDEX `milukita_session_identity_status_index` ON `milukita_sessions` (`identityId`,`status`,`expiresAt`);