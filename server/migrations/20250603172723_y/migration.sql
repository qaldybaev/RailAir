/*
  Warnings:

  - Added the required column `phone_number` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "phone_number" VARCHAR(120) NOT NULL;
