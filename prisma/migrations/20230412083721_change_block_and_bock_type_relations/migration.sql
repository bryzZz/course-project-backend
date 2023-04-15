/*
  Warnings:

  - A unique constraint covering the columns `[blockId]` on the table `Devider` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[blockId]` on the table `Dish` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Devider_blockId_key" ON "Devider"("blockId");

-- CreateIndex
CREATE UNIQUE INDEX "Dish_blockId_key" ON "Dish"("blockId");
