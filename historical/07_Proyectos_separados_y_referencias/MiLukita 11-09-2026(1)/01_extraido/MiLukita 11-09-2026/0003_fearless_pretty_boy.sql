CREATE TABLE `player_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`countryCode` varchar(2) NOT NULL DEFAULT 'PE',
	`sessionLimitMinutes` int NOT NULL DEFAULT 60,
	`voluntaryPauseUntil` timestamp,
	`marketingEnabled` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `player_settings_id` PRIMARY KEY(`id`),
	CONSTRAINT `player_settings_user_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
ALTER TABLE `player_settings` ADD CONSTRAINT `player_settings_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;