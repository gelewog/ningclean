/*
  Warnings:

  - You are about to drop the column `guestEmail` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `guestName` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `guestPhone` on the `bookings` table. All the data in the column will be lost.
  - Made the column `customerId` on table `bookings` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_customerId_fkey";

-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "guestEmail",
DROP COLUMN "guestName",
DROP COLUMN "guestPhone",
ALTER COLUMN "customerId" SET NOT NULL;

-- AlterTable
ALTER TABLE "footer_settings" ALTER COLUMN "newsletterSubtitle" DROP DEFAULT;

-- AlterTable
ALTER TABLE "notification_settings" ALTER COLUMN "name" SET DEFAULT 'default';

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
