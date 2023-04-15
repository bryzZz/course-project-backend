/*
  Warnings:

  - Added the required column `description` to the `Block` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Block" ADD COLUMN     "description" TEXT NOT NULL;
