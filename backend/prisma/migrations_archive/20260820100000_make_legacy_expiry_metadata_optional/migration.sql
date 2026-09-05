-- Preserve the formatted expiry entered in the card widget and keep legacy fields for compatibility.
ALTER TABLE "PaymentMethod"
ADD COLUMN "expiry" TEXT,
ALTER COLUMN "expMonth" DROP NOT NULL,
ALTER COLUMN "expYear" DROP NOT NULL;