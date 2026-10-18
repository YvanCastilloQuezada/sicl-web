ALTER TABLE `audit_events` ADD `actorRole` varchar(48);--> statement-breakpoint
ALTER TABLE `audit_events` ADD `action` varchar(96);--> statement-breakpoint
ALTER TABLE `audit_events` ADD `previousStateJson` text;--> statement-breakpoint
ALTER TABLE `audit_events` ADD `newStateJson` text;--> statement-breakpoint
ALTER TABLE `audit_events` ADD `metadataJson` text;--> statement-breakpoint
ALTER TABLE `audit_events` ADD `correlationId` varchar(96);