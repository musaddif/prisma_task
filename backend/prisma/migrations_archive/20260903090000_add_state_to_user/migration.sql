-- AlterTable: Add state column and make apartment/postalCode required
ALTER TABLE "User" ADD COLUMN "state" TEXT NOT NULL DEFAULT '';
ALTER TABLE "User" ALTER COLUMN "apartment" SET NOT NULL;
ALTER TABLE "User" ALTER COLUMN "apartment" SET DEFAULT '';
ALTER TABLE "User" ALTER COLUMN "postalCode" SET NOT NULL;
ALTER TABLE "User" ALTER COLUMN "postalCode" SET DEFAULT '';
