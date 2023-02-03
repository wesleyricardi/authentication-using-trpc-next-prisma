-- DropForeignKey
ALTER TABLE "UserActivationCode" DROP CONSTRAINT "UserActivationCode_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserRecoveryCode" DROP CONSTRAINT "UserRecoveryCode_userId_fkey";

-- AddForeignKey
ALTER TABLE "UserRecoveryCode" ADD CONSTRAINT "UserRecoveryCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserActivationCode" ADD CONSTRAINT "UserActivationCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
