-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('BOOKED', 'PURCHASED', 'CANCELLED');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(120) NOT NULL,
    "phone_number" VARCHAR(120),
    "password" VARCHAR(255),
    "provider" TEXT,
    "provider_id" VARCHAR(255),
    "role" "Role" NOT NULL,
    "isBlocked" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flight" (
    "id" SERIAL NOT NULL,
    "from" VARCHAR(255) NOT NULL,
    "to" VARCHAR(255) NOT NULL,
    "departureTime" TIMESTAMP(3) NOT NULL,
    "arrivalTime" TIMESTAMP(3) NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "seatCount" INTEGER NOT NULL,
    "availableSeats" INTEGER NOT NULL,
    "airline" VARCHAR(255) NOT NULL,

    CONSTRAINT "flight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "train" (
    "id" SERIAL NOT NULL,
    "from" VARCHAR(255) NOT NULL,
    "to" VARCHAR(255) NOT NULL,
    "departureTime" TIMESTAMP(3) NOT NULL,
    "arrivalTime" TIMESTAMP(3) NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "seatCount" INTEGER NOT NULL,
    "availableSeats" INTEGER NOT NULL,
    "trainNumber" VARCHAR(100) NOT NULL,

    CONSTRAINT "train_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "passenger_info" (
    "id" SERIAL NOT NULL,
    "fullName" VARCHAR(255) NOT NULL,
    "gender" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "passport" VARCHAR(100) NOT NULL,
    "ticketId" INTEGER NOT NULL,

    CONSTRAINT "passenger_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ticket" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "flightId" INTEGER,
    "trainId" INTEGER,
    "seatNumber" INTEGER NOT NULL,
    "status" VARCHAR(50) NOT NULL,
    "passengerInfoId" INTEGER,

    CONSTRAINT "ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "otp_code" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "code" VARCHAR(10) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "otp_code_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "ticket" ADD CONSTRAINT "ticket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ticket" ADD CONSTRAINT "ticket_flightId_fkey" FOREIGN KEY ("flightId") REFERENCES "flight"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ticket" ADD CONSTRAINT "ticket_trainId_fkey" FOREIGN KEY ("trainId") REFERENCES "train"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ticket" ADD CONSTRAINT "ticket_passengerInfoId_fkey" FOREIGN KEY ("passengerInfoId") REFERENCES "passenger_info"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
