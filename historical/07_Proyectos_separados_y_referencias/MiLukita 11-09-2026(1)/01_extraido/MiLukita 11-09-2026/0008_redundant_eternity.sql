CREATE TABLE `virtual_plan_enrollments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`publicId` varchar(40) NOT NULL,
	`userId` int NOT NULL,
	`gameType` enum('loteria_29','loteria_39','loteria_49','loteria_59') NOT NULL,
	`planCode` varchar(32) NOT NULL,
	`picksJson` text NOT NULL,
	`remainingConfirmations` int NOT NULL,
	`status` enum('active','paused','expired','cancelled') NOT NULL DEFAULT 'active',
	`consentedAt` timestamp NOT NULL DEFAULT (now()),
	`expiresAt` timestamp NOT NULL,
	`cancelledAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `virtual_plan_enrollments_id` PRIMARY KEY(`id`),
	CONSTRAINT `virtual_plan_public_unique` UNIQUE(`publicId`)
);
--> statement-breakpoint
ALTER TABLE `virtual_plan_enrollments` ADD CONSTRAINT `virtual_plan_enrollments_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `virtual_plan_user_status_index` ON `virtual_plan_enrollments` (`userId`,`status`,`expiresAt`);