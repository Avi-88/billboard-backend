/*
  Warnings:

  - You are about to drop the column `package` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" RENAME COLUMN "package" TO "ctc";
