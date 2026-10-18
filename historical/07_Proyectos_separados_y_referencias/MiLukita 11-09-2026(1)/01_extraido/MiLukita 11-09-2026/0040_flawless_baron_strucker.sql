CREATE TABLE `territorial_claims` (
	`id` int AUTO_INCREMENT NOT NULL,
	`publicId` varchar(48) NOT NULL,
	`worldObjectId` int NOT NULL,
	`text` text NOT NULL,
	`claimType` varchar(48) NOT NULL,
	`verificationStatus` enum('UNVERIFIED','UNDER_REVIEW','VERIFIED','DISPUTED','REJECTED') NOT NULL DEFAULT 'UNVERIFIED',
	`confidenceScore` int NOT NULL DEFAULT 0,
	`observations` text NOT NULL,
	`version` int NOT NULL DEFAULT 1,
	`createdByUserId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `territorial_claims_id` PRIMARY KEY(`id`),
	CONSTRAINT `territorial_claim_public_unique` UNIQUE(`publicId`)
);
--> statement-breakpoint
CREATE TABLE `territorial_evidence` (
	`id` int AUTO_INCREMENT NOT NULL,
	`publicId` varchar(48) NOT NULL,
	`worldObjectId` int NOT NULL,
	`claimId` int,
	`evidenceType` varchar(48) NOT NULL,
	`origin` varchar(512) NOT NULL,
	`capturedAt` timestamp NOT NULL,
	`responsibleUserId` int NOT NULL,
	`integrityHash` varchar(128) NOT NULL,
	`version` int NOT NULL DEFAULT 1,
	`metadataJson` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `territorial_evidence_id` PRIMARY KEY(`id`),
	CONSTRAINT `territorial_evidence_public_unique` UNIQUE(`publicId`)
);
--> statement-breakpoint
CREATE TABLE `territorial_sources` (
	`id` int AUTO_INCREMENT NOT NULL,
	`publicId` varchar(48) NOT NULL,
	`worldObjectId` int NOT NULL,
	`institutionOrPerson` varchar(180) NOT NULL,
	`sourceType` varchar(48) NOT NULL,
	`referenceUrl` varchar(768),
	`sourceDate` timestamp,
	`author` varchar(180),
	`documentRef` varchar(512),
	`authorityLevel` int NOT NULL DEFAULT 0,
	`observations` text NOT NULL,
	`createdByUserId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `territorial_sources_id` PRIMARY KEY(`id`),
	CONSTRAINT `territorial_source_public_unique` UNIQUE(`publicId`)
);
--> statement-breakpoint
CREATE TABLE `territorial_verification_reviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`publicId` varchar(48) NOT NULL,
	`worldObjectId` int NOT NULL,
	`reviewerUserId` int NOT NULL,
	`decision` enum('REQUEST_EVIDENCE','VERIFY','DISPUTE','REJECT','ARCHIVE') NOT NULL,
	`evidenceReviewedJson` text NOT NULL,
	`approvedVersion` int,
	`reason` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `territorial_verification_reviews_id` PRIMARY KEY(`id`),
	CONSTRAINT `territorial_review_public_unique` UNIQUE(`publicId`)
);
--> statement-breakpoint
CREATE TABLE `world_objects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`publicId` varchar(48) NOT NULL,
	`objectType` varchar(48) NOT NULL,
	`name` varchar(180) NOT NULL,
	`description` text NOT NULL,
	`geometryJson` text NOT NULL,
	`latitude` varchar(32) NOT NULL,
	`longitude` varchar(32) NOT NULL,
	`accuracyMeters` int NOT NULL,
	`status` enum('DRAFT','CAPTURED','UNDER_REVIEW','EVIDENCE_REQUIRED','VERIFIED','PUBLISHED','DISPUTED','OUTDATED','REJECTED','ARCHIVED') NOT NULL DEFAULT 'DRAFT',
	`confidenceScore` int NOT NULL DEFAULT 0,
	`attributesJson` text NOT NULL,
	`relationsJson` text NOT NULL,
	`assetsJson` text NOT NULL,
	`version` int NOT NULL DEFAULT 1,
	`createdByUserId` int NOT NULL,
	`updatedByUserId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `world_objects_id` PRIMARY KEY(`id`),
	CONSTRAINT `world_object_public_unique` UNIQUE(`publicId`)
);
--> statement-breakpoint
ALTER TABLE `territorial_claims` ADD CONSTRAINT `tor_claim_obj_fk` FOREIGN KEY (`worldObjectId`) REFERENCES `world_objects`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `territorial_claims` ADD CONSTRAINT `tor_claim_creator_fk` FOREIGN KEY (`createdByUserId`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `territorial_evidence` ADD CONSTRAINT `tor_evidence_obj_fk` FOREIGN KEY (`worldObjectId`) REFERENCES `world_objects`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `territorial_evidence` ADD CONSTRAINT `tor_evidence_claim_fk` FOREIGN KEY (`claimId`) REFERENCES `territorial_claims`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `territorial_evidence` ADD CONSTRAINT `tor_evidence_user_fk` FOREIGN KEY (`responsibleUserId`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `territorial_sources` ADD CONSTRAINT `tor_source_obj_fk` FOREIGN KEY (`worldObjectId`) REFERENCES `world_objects`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `territorial_sources` ADD CONSTRAINT `tor_source_creator_fk` FOREIGN KEY (`createdByUserId`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `territorial_verification_reviews` ADD CONSTRAINT `tor_review_obj_fk` FOREIGN KEY (`worldObjectId`) REFERENCES `world_objects`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `territorial_verification_reviews` ADD CONSTRAINT `tor_review_user_fk` FOREIGN KEY (`reviewerUserId`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `world_objects` ADD CONSTRAINT `tor_obj_creator_fk` FOREIGN KEY (`createdByUserId`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `world_objects` ADD CONSTRAINT `tor_obj_updater_fk` FOREIGN KEY (`updatedByUserId`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `territorial_claim_object_index` ON `territorial_claims` (`worldObjectId`,`verificationStatus`);--> statement-breakpoint
CREATE INDEX `territorial_evidence_object_index` ON `territorial_evidence` (`worldObjectId`,`createdAt`);--> statement-breakpoint
CREATE INDEX `territorial_source_object_index` ON `territorial_sources` (`worldObjectId`,`authorityLevel`);--> statement-breakpoint
CREATE INDEX `territorial_review_object_index` ON `territorial_verification_reviews` (`worldObjectId`,`createdAt`);--> statement-breakpoint
CREATE INDEX `world_object_status_index` ON `world_objects` (`status`,`updatedAt`);--> statement-breakpoint
CREATE INDEX `world_object_geo_index` ON `world_objects` (`latitude`,`longitude`);