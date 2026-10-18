CREATE TABLE `lrci_review_cases` (
	`id` int AUTO_INCREMENT NOT NULL,
	`publicId` varchar(40) NOT NULL,
	`title` varchar(160) NOT NULL,
	`domain` varchar(48) NOT NULL,
	`status` enum('NO_DATA','TECHNICAL_CONTROL_ONLY','REQUIRES_PROFESSIONAL_REVIEW','POLICY_BLOCKED','SOURCE_EXPIRED','HUMAN_APPROVED','REJECTED') NOT NULL DEFAULT 'NO_DATA',
	`scope` varchar(255) NOT NULL,
	`jurisdiction` varchar(64) NOT NULL,
	`expiresAt` timestamp,
	`responsibleUserId` int,
	`responsibleLabel` varchar(160) NOT NULL,
	`sourceRef` varchar(512),
	`evidenceSummary` text,
	`reviewerComment` text,
	`reviewedAt` timestamp,
	`createdByUserId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `lrci_review_cases_id` PRIMARY KEY(`id`),
	CONSTRAINT `lrci_review_case_public_unique` UNIQUE(`publicId`)
);
--> statement-breakpoint
ALTER TABLE `lrci_review_cases` ADD CONSTRAINT `lrci_review_cases_responsibleUserId_users_id_fk` FOREIGN KEY (`responsibleUserId`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `lrci_review_cases` ADD CONSTRAINT `lrci_review_cases_createdByUserId_users_id_fk` FOREIGN KEY (`createdByUserId`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `lrci_review_case_status_expiry_index` ON `lrci_review_cases` (`status`,`expiresAt`);--> statement-breakpoint
CREATE INDEX `lrci_review_case_jurisdiction_index` ON `lrci_review_cases` (`jurisdiction`,`updatedAt`);