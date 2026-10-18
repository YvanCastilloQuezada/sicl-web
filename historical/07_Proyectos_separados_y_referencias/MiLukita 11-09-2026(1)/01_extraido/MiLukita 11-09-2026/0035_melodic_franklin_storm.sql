CREATE TABLE `user_notification_preferences` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`inAppEnabled` boolean NOT NULL DEFAULT true,
	`qrUpdatesEnabled` boolean NOT NULL DEFAULT true,
	`securityAlertsEnabled` boolean NOT NULL DEFAULT true,
	`sessionAlertsEnabled` boolean NOT NULL DEFAULT true,
	`criticalExpiryEnabled` boolean NOT NULL DEFAULT true,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_notification_preferences_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_notification_preferences_user_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
ALTER TABLE `user_notification_preferences` ADD CONSTRAINT `user_notification_preferences_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;