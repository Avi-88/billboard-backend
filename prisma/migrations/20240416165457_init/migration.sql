/*
  Warnings:

  - Added the required column `size` to the `Billboard` table without a default value. This is not possible if the table is not empty.
  - Made the column `category` on table `Billboard` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Billboard" ADD COLUMN     "size" TEXT NOT NULL,
ALTER COLUMN "category" SET NOT NULL;
