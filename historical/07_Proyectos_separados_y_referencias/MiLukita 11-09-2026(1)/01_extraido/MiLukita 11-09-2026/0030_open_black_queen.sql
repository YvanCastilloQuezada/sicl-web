CREATE TABLE `admin_qr_timer_palettes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`publicId` varchar(40) NOT NULL,
	`name` varchar(96) NOT NULL,
	`paletteJson` text NOT NULL,
	`isActive` boolean NOT NULL DEFAULT false,
	`createdByUserId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `admin_qr_timer_palettes_id` PRIMARY KEY(`id`),
	CONSTRAINT `admin_qr_timer_palette_public_unique` UNIQUE(`publicId`),
	CONSTRAINT `admin_qr_timer_palette_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
ALTER TABLE `admin_qr_timer_palettes` ADD CONSTRAINT `admin_qr_timer_palettes_createdByUserId_users_id_fk` FOREIGN KEY (`createdByUserId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `admin_qr_timer_palette_active_index` ON `admin_qr_timer_palettes` (`isActive`,`updatedAt`);