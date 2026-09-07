-- Allow the same email on multiple registrations
DROP INDEX IF EXISTS "User_email_key";

-- Make existing duplicate cards unique so the constraint can be created.
-- Keeps every row; only renames later duplicates (does not delete users).
WITH ranked AS (
  SELECT
    id,
    ROW_NUMBER() OVER (
      PARTITION BY "cardNumber"
      ORDER BY "createdAt" ASC, id ASC
    ) AS rn
  FROM "User"
)
UPDATE "User" AS u
SET "cardNumber" = u."cardNumber" || '-dup-' || u.id
FROM ranked AS r
WHERE u.id = r.id
  AND r.rn > 1;

-- Enforce unique card numbers going forward
CREATE UNIQUE INDEX IF NOT EXISTS "User_cardNumber_key" ON "User"("cardNumber");
