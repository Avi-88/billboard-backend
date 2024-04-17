-- AlterTable
ALTER TABLE "Seller" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'seller';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'user';
