-- DropForeignKey
ALTER TABLE `layanans` DROP FOREIGN KEY `layanans_kategori_id_fkey`;

-- DropForeignKey
ALTER TABLE `layanans` DROP FOREIGN KEY `layanans_sub_category_id_fkey`;

-- DropIndex
DROP INDEX `layanans_kategori_id_fkey` ON `layanans`;

-- DropIndex
DROP INDEX `layanans_sub_category_id_fkey` ON `layanans`;
