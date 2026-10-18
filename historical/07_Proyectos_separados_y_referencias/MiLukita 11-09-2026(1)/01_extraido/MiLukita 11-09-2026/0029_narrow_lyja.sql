CREATE TABLE `online_tv_actions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`publicId` varchar(64) NOT NULL,
	`sessionId` varchar(64) NOT NULL,
	`participantId` varchar(64) NOT NULL,
	`actionType` varchar(32) NOT NULL,
	`payloadJson` text NOT NULL,
	`accepted` boolean NOT NULL,
	`scoreDelta` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `online_tv_actions_id` PRIMARY KEY(`id`),
	CONSTRAINT `online_tv_action_public_unique` UNIQUE(`publicId`),
	CONSTRAINT `online_tv_action_replay_unique` UNIQUE(`sessionId`,`participantId`,`publicId`)
);
--> statement-breakpoint
CREATE INDEX `online_tv_action_session_index` ON `online_tv_actions` (`sessionId`,`createdAt`);