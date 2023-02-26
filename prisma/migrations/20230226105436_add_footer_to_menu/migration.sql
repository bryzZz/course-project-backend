-- AlterTable
ALTER TABLE "Menu" ADD COLUMN     "footer" TEXT,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "description" DROP DEFAULT;
