CREATE TABLE `controller_commands` (
	`id` int AUTO_INCREMENT NOT NULL,
	`publicId` varchar(48) NOT NULL,
	`sessionId` int NOT NULL,
	`actorUserId` int NOT NULL,
	`mode` enum('REMOTE','GAMEPAD','TRACKPAD','KEYBOARD') NOT NULL,
	`commandType` enum('NAVIGATE','SELECT','BACK','HOME','EXIT','TEXT','PLAYBACK','QR_VISIBILITY') NOT NULL,
	`payloadJson` text NOT NULL,
	`requestId` varchar(96) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `controller_commands_id` PRIMARY KEY(`id`),
	CONSTRAINT `controller_command_public_unique` UNIQUE(`publicId`),
	CONSTRAINT `controller_command_session_request_unique` UNIQUE(`sessionId`,`requestId`)
);
--> statement-breakpoint
CREATE TABLE `controller_role_assignments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`controllerRole` enum('USER','PRESENTER','OPERATOR') NOT NULL DEFAULT 'USER',
	`assignedByUserId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `controller_role_assignments_id` PRIMARY KEY(`id`),
	CONSTRAINT `controller_role_assignment_user_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `controller_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`publicId` varchar(48) NOT NULL,
	`createdByUserId` int NOT NULL,
	`connectedUserId` int,
	`mobileTokenHash` varchar(128) NOT NULL,
	`screenTokenHash` varchar(128) NOT NULL,
	`status` enum('PENDING','CONNECTED','EXPIRED','CLOSED') NOT NULL DEFAULT 'PENDING',
	`expiresAt` timestamp NOT NULL,
	`lastSeenAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`closedAt` timestamp,
	CONSTRAINT `controller_sessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `controller_session_public_unique` UNIQUE(`publicId`)
);
--> statement-breakpoint
ALTER TABLE `controller_commands` ADD CONSTRAINT `controller_commands_sessionId_controller_sessions_id_fk` FOREIGN KEY (`sessionId`) REFERENCES `controller_sessions`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `controller_commands` ADD CONSTRAINT `controller_commands_actorUserId_users_id_fk` FOREIGN KEY (`actorUserId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `controller_role_assignments` ADD CONSTRAINT `controller_role_assignments_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `controller_role_assignments` ADD CONSTRAINT `controller_role_assignments_assignedByUserId_users_id_fk` FOREIGN KEY (`assignedByUserId`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `controller_sessions` ADD CONSTRAINT `controller_sessions_createdByUserId_users_id_fk` FOREIGN KEY (`createdByUserId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `controller_sessions` ADD CONSTRAINT `controller_sessions_connectedUserId_users_id_fk` FOREIGN KEY (`connectedUserId`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `controller_command_session_id_index` ON `controller_commands` (`sessionId`,`id`);--> statement-breakpoint
CREATE INDEX `controller_session_status_expiry_index` ON `controller_sessions` (`status`,`expiresAt`);