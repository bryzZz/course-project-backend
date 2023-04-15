/*
  Warnings:

  - You are about to drop the column `description` on the `Block` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Block` table. All the data in the column will be lost.
  - You are about to drop the column `text` on the `Block` table. All the data in the column will be lost.
  - Added the required column `type` to the `Block` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BlockType" AS ENUM ('DISH', 'DEVIDER');

-- AlterTable
ALTER TABLE "Block" DROP COLUMN "description",
DROP COLUMN "imageUrl",
DROP COLUMN "text",
ADD COLUMN     "type" "BlockType" NOT NULL;

-- CreateTable
CREATE TABLE "Dish" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "blockId" TEXT NOT NULL,

    CONSTRAINT "Dish_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Devider" (
    "id" TEXT NOT NULL,
    "text" TEXT,
    "blockId" TEXT NOT NULL,

    CONSTRAINT "Devider_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Dish_id_key" ON "Dish"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Devider_id_key" ON "Devider"("id");

-- AddForeignKey
ALTER TABLE "Dish" ADD CONSTRAINT "Dish_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "Block"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Devider" ADD CONSTRAINT "Devider_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "Block"("id") ON DELETE CASCADE ON UPDATE CASCADE;
