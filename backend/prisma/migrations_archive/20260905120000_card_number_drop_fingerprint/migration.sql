-- Store the raw card number for duplicate checks (fingerprint removed per request)

ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "cardNumber" TEXT;

UPDATE "User"
SET "cardNumber" = 'migrated-' || "id"
WHERE "cardNumber" IS NULL OR "cardNumber" = '';

ALTER TABLE "User" ALTER COLUMN "cardNumber" SET NOT NULL;

DROP INDEX IF EXISTS "User_cardFingerprint_key";
ALTER TABLE "User" DROP COLUMN IF EXISTS "cardFingerprint";

CREATE UNIQUE INDEX IF NOT EXISTS "User_cardNumber_key" ON "User"("cardNumber");