-- DropIndex
DROP INDEX "PaymentMethod_paymentMethodId_key";

-- AlterTable
ALTER TABLE "PaymentMethod" DROP COLUMN "paymentMethodId",
DROP COLUMN "provider",
ADD COLUMN     "safepayCustomerToken" TEXT NOT NULL,
ADD COLUMN     "safepayPaymentToken" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "PaymentMethod_safepayPaymentToken_key" ON "PaymentMethod"("safepayPaymentToken");
