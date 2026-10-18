ALTER TABLE `territorial_verification_reviews` ADD `confidenceScore` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `territorial_verification_reviews` ADD `previousStatus` varchar(24) DEFAULT 'UNKNOWN' NOT NULL;--> statement-breakpoint
ALTER TABLE `territorial_verification_reviews` ADD `resultingStatus` varchar(24) DEFAULT 'UNKNOWN' NOT NULL;