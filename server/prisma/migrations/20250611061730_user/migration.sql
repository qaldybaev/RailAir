/*
  Warnings:

  - Added the required column `userId` to the `passenger_info` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "passenger_info" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "passenger_info" ADD CONSTRAINT "passenger_info_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
