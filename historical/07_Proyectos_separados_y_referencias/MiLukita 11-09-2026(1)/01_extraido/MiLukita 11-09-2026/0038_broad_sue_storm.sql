CREATE TABLE `controller_shared_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`shareCode` varchar(12) NOT NULL,
	`ownerUserId` int NOT NULL,
	`profileJson` text NOT NULL,
	`expiresAt` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `controller_shared_profiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `controller_shared_profile_code_unique` UNIQUE(`shareCode`)
);
--> statement-breakpoint
ALTER TABLE `controller_shared_profiles` ADD CONSTRAINT `controller_shared_profiles_ownerUserId_users_id_fk` FOREIGN KEY (`ownerUserId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `controller_shared_profile_expiry_index` ON `controller_shared_profiles` (`expiresAt`);