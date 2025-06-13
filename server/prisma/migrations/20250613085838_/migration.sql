/*
  Warnings:

  - A unique constraint covering the columns `[seatNumber]` on the table `ticket` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ticket_seatNumber_key" ON "ticket"("seatNumber");
