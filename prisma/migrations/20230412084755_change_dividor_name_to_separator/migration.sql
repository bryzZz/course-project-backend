/*
  Warnings:

  - The values [DEVIDER] on the enum `BlockType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `Devider` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BlockType_new" AS ENUM ('DISH', 'SEPARATOR');
ALTER TABLE "Block" ALTER COLUMN "type" TYPE "BlockType_new" USING ("type"::text::"BlockType_new");
ALTER TYPE "BlockType" RENAME TO "BlockType_old";
ALTER TYPE "BlockType_new" RENAME TO "BlockType";
DROP TYPE "BlockType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Devider" DROP CONSTRAINT "Devider_blockId_fkey";

-- DropTable
DROP TABLE "Devider";

-- CreateTable
CREATE TABLE "Separator" (
    "id" TEXT NOT NULL,
    "text" TEXT,
    "blockId" TEXT NOT NULL,

    CONSTRAINT "Separator_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Separator_id_key" ON "Separator"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Separator_blockId_key" ON "Separator"("blockId");

-- AddForeignKey
ALTER TABLE "Separator" ADD CONSTRAINT "Separator_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "Block"("id") ON DELETE CASCADE ON UPDATE CASCADE;
