CREATE TABLE `sicl_projects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ownerId` int NOT NULL,
	`projectId` varchar(128) NOT NULL,
	`name` varchar(255) NOT NULL,
	`location` varchar(255),
	`status` enum('DRAFT','ACTIVE','DECIDED','ARCHIVED') NOT NULL DEFAULT 'DRAFT',
	`version` int NOT NULL DEFAULT 1,
	`snapshot` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `sicl_projects_id` PRIMARY KEY(`id`),
	CONSTRAINT `sicl_projects_projectId_unique` UNIQUE(`projectId`)
);
