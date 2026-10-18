CREATE TABLE `game_schedules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`gameType` varchar(32) NOT NULL,
	`label` varchar(128) NOT NULL,
	`cronExpression` varchar(64) NOT NULL,
	`timezone` varchar(64) NOT NULL DEFAULT 'UTC',
	`scheduleCronTaskUid` varchar(65),
	`isEnabled` boolean NOT NULL DEFAULT false,
	`lastRunAt` timestamp,
	`lastRoundPublicId` varchar(40),
	`metadataJson` text NOT NULL,
	`createdByUserId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `game_schedules_id` PRIMARY KEY(`id`),
	CONSTRAINT `game_schedule_game_type_unique` UNIQUE(`gameType`),
	CONSTRAINT `game_schedule_task_uid_unique` UNIQUE(`scheduleCronTaskUid`)
);
--> statement-breakpoint
CREATE TABLE `virtual_award_installments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`publicId` varchar(40) NOT NULL,
	`userId` int NOT NULL,
	`ticketId` int NOT NULL,
	`roundId` int NOT NULL,
	`totalInstallments` int NOT NULL,
	`installmentsPaid` int NOT NULL DEFAULT 0,
	`installmentCredits` int NOT NULL,
	`nextPaymentAt` timestamp NOT NULL,
	`status` enum('pending','active','completed','cancelled') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`completedAt` timestamp,
	CONSTRAINT `virtual_award_installments_id` PRIMARY KEY(`id`),
	CONSTRAINT `virtual_award_installment_public_unique` UNIQUE(`publicId`),
	CONSTRAINT `virtual_award_ticket_unique` UNIQUE(`ticketId`)
);
--> statement-breakpoint
ALTER TABLE `game_batch_previews` MODIFY COLUMN `gameType` enum('ruleta','ruleta_7','ruleta_17','ruleta_27','ruleta_37','jackpot','bingo','bingo_flash','bingo_keno','bingo_75','loteria_19','loteria_29','loteria_39','loteria_49','loteria_59','cartas','sueldo_vida','raspa_digital','pick_3','pick_4','loto_diario','loto_express') NOT NULL;--> statement-breakpoint
ALTER TABLE `game_rounds` MODIFY COLUMN `gameType` enum('ruleta','ruleta_7','ruleta_17','ruleta_27','ruleta_37','jackpot','bingo','bingo_flash','bingo_keno','bingo_75','loteria_19','loteria_29','loteria_39','loteria_49','loteria_59','cartas','sueldo_vida','raspa_digital','pick_3','pick_4','loto_diario','loto_express') NOT NULL;--> statement-breakpoint
ALTER TABLE `game_rulesets` MODIFY COLUMN `gameType` enum('ruleta','ruleta_7','ruleta_17','ruleta_27','ruleta_37','jackpot','bingo','bingo_flash','bingo_keno','bingo_75','loteria_19','loteria_29','loteria_39','loteria_49','loteria_59','cartas','sueldo_vida','raspa_digital','pick_3','pick_4','loto_diario','loto_express') NOT NULL;--> statement-breakpoint
ALTER TABLE `pilot_tickets` MODIFY COLUMN `gameType` enum('ruleta','ruleta_7','ruleta_17','ruleta_27','ruleta_37','jackpot','bingo','bingo_flash','bingo_keno','bingo_75','loteria_19','loteria_29','loteria_39','loteria_49','loteria_59','cartas','sueldo_vida','raspa_digital','pick_3','pick_4','loto_diario','loto_express') NOT NULL;--> statement-breakpoint
ALTER TABLE `game_schedules` ADD CONSTRAINT `game_schedules_createdByUserId_users_id_fk` FOREIGN KEY (`createdByUserId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `virtual_award_installments` ADD CONSTRAINT `virtual_award_installments_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `virtual_award_installments` ADD CONSTRAINT `virtual_award_installments_ticketId_pilot_tickets_id_fk` FOREIGN KEY (`ticketId`) REFERENCES `pilot_tickets`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `virtual_award_installments` ADD CONSTRAINT `virtual_award_installments_roundId_game_rounds_id_fk` FOREIGN KEY (`roundId`) REFERENCES `game_rounds`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `game_schedule_enabled_index` ON `game_schedules` (`isEnabled`,`gameType`);--> statement-breakpoint
CREATE INDEX `virtual_award_due_index` ON `virtual_award_installments` (`status`,`nextPaymentAt`);