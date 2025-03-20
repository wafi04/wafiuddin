/*
  Warnings:

  - You are about to drop the column `providerAccountId` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `sessionToken` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerified` on the `users_auth` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[provider,provider_account_id]` on the table `accounts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[session_token]` on the table `sessions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `provider_account_id` to the `accounts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `accounts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `session_token` to the `sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `sessions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `accounts` DROP FOREIGN KEY `accounts_userId_fkey`;

-- DropForeignKey
ALTER TABLE `sessions` DROP FOREIGN KEY `sessions_userId_fkey`;

-- DropIndex
DROP INDEX `accounts_provider_providerAccountId_key` ON `accounts`;

-- DropIndex
DROP INDEX `accounts_userId_fkey` ON `accounts`;

-- DropIndex
DROP INDEX `sessions_sessionToken_key` ON `sessions`;

-- DropIndex
DROP INDEX `sessions_userId_fkey` ON `sessions`;

-- AlterTable
ALTER TABLE `accounts` DROP COLUMN `providerAccountId`,
    DROP COLUMN `userId`,
    ADD COLUMN `provider_account_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `user_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `sessions` DROP COLUMN `sessionToken`,
    DROP COLUMN `userId`,
    ADD COLUMN `session_token` VARCHAR(191) NOT NULL,
    ADD COLUMN `user_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `users_auth` DROP COLUMN `emailVerified`,
    ADD COLUMN `email_verified` DATETIME(3) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `accounts_provider_provider_account_id_key` ON `accounts`(`provider`, `provider_account_id`);

-- CreateIndex
CREATE UNIQUE INDEX `sessions_session_token_key` ON `sessions`(`session_token`);

-- AddForeignKey
ALTER TABLE `accounts` ADD CONSTRAINT `accounts_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users_auth`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users_auth`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
