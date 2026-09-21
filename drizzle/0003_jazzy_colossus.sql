CREATE TABLE `arki_command_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ownerId` int NOT NULL,
	`projectId` varchar(128) NOT NULL,
	`sessionId` varchar(128) NOT NULL,
	`commandName` varchar(180) NOT NULL,
	`parameters` text NOT NULL,
	`previewResult` text NOT NULL,
	`tutorialStep` int NOT NULL DEFAULT 0,
	`exerciseScore` int,
	`exerciseState` varchar(32) NOT NULL DEFAULT 'IN_PROGRESS',
	`lastAction` varchar(64) NOT NULL DEFAULT 'AUTOSAVE',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `arki_command_sessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `arki_command_sessions_sessionId_unique` UNIQUE(`sessionId`)
);
