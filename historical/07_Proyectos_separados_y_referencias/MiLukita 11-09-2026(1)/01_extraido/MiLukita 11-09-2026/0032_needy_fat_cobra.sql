CREATE TABLE `lrci_review_notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`publicId` varchar(40) NOT NULL,
	`casePublicId` varchar(40) NOT NULL,
	`kind` enum('EXPIRING_SOON','EXPIRED') NOT NULL,
	`severity` enum('HIGH','CRITICAL') NOT NULL,
	`title` varchar(160) NOT NULL,
	`message` text NOT NULL,
	`dueAt` timestamp,
	`readAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `lrci_review_notifications_id` PRIMARY KEY(`id`),
	CONSTRAINT `lrci_notification_public_unique` UNIQUE(`publicId`),
	CONSTRAINT `lrci_notification_case_kind_unique` UNIQUE(`casePublicId`,`kind`)
);
--> statement-breakpoint
CREATE INDEX `lrci_notification_read_created_index` ON `lrci_review_notifications` (`readAt`,`createdAt`);