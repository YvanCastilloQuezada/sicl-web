ALTER TABLE `controller_sessions` ADD `manualLinkCodeHash` varchar(128);--> statement-breakpoint
ALTER TABLE `controller_sessions` ADD CONSTRAINT `controller_session_manual_code_unique` UNIQUE(`manualLinkCodeHash`);
