/*
  Warnings:

  - Made the column `is_digi` on table `pembelians` required. This step will fail if there are existing NULL values in that column.
  - Made the column `success_report_sended` on table `pembelians` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `kategoris` MODIFY `server_id` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `layanans` ALTER COLUMN `is_flash_sale` DROP DEFAULT;

-- AlterTable
ALTER TABLE `pembelians` MODIFY `is_digi` BOOLEAN NOT NULL,
    MODIFY `success_report_sended` BOOLEAN NOT NULL;
