/*
  Warnings:

  - The values [DISH,SEPARATOR] on the enum `BlockType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `imageUrl` on the `Dish` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Menu` table. All the data in the column will be lost.
  - Added the required column `image` to the `Dish` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BlockType_new" AS ENUM ('Dish', 'Separator');
ALTER TABLE "Block" ALTER COLUMN "type" TYPE "BlockType_new" USING ("type"::text::"BlockType_new");
ALTER TYPE "BlockType" RENAME TO "BlockType_old";
ALTER TYPE "BlockType_new" RENAME TO "BlockType";
DROP TYPE "BlockType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Dish" DROP COLUMN "imageUrl",
ADD COLUMN     "image" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Menu" DROP COLUMN "imageUrl",
ADD COLUMN     "image" TEXT;
