/*
  Warnings:

  - A unique constraint covering the columns `[passport]` on the table `passenger_info` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "passenger_info_passport_key" ON "passenger_info"("passport");
