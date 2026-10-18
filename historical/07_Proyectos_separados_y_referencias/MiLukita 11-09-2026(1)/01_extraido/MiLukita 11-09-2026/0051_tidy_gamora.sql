ALTER TABLE `territorial_asset_versions` MODIFY COLUMN `metadataJson` text NOT NULL;--> statement-breakpoint
ALTER TABLE `territorial_assets` MODIFY COLUMN `metadataJson` text;