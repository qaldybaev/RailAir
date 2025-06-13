/*
  Warnings:

  - You are about to drop the column `ticketId` on the `passenger_info` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ticket" DROP CONSTRAINT "ticket_flightId_fkey";

-- DropForeignKey
ALTER TABLE "ticket" DROP CONSTRAINT "ticket_passengerInfoId_fkey";

-- DropForeignKey
ALTER TABLE "ticket" DROP CONSTRAINT "ticket_trainId_fkey";

-- DropForeignKey
ALTER TABLE "ticket" DROP CONSTRAINT "ticket_userId_fkey";

-- AlterTable
ALTER TABLE "passenger_info" DROP COLUMN "ticketId";

-- AddForeignKey
ALTER TABLE "ticket" ADD CONSTRAINT "ticket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket" ADD CONSTRAINT "ticket_flightId_fkey" FOREIGN KEY ("flightId") REFERENCES "flight"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket" ADD CONSTRAINT "ticket_trainId_fkey" FOREIGN KEY ("trainId") REFERENCES "train"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket" ADD CONSTRAINT "ticket_passengerInfoId_fkey" FOREIGN KEY ("passengerInfoId") REFERENCES "passenger_info"("id") ON DELETE SET NULL ON UPDATE CASCADE;
