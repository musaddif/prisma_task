-- Allow the same email on multiple checkout attempts
DROP INDEX IF EXISTS "User_email_key";

-- Replace raw cardNumber with a non-reversible fingerprint (duplicate checks only)
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "cardFingerprint" TEXT;

UPDATE "User"
SET "cardFingerprint" = 'migrated-' || "id"
WHERE "cardFingerprint" IS NULL OR "cardFingerprint" = '';

ALTER TABLE "User" ALTER COLUMN "cardFingerprint" SET NOT NULL;

ALTER TABLE "User" DROP COLUMN IF EXISTS "cardNumber";

CREATE UNIQUE INDEX IF NOT EXISTS "User_cardFingerprint_key" ON "User"("cardFingerprint");
