-- DropForeignKey
ALTER TABLE "expenses" DROP CONSTRAINT "expenses_userId_fkey";

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
