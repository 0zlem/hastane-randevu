/*
  Warnings:

  - The primary key for the `kullanicilar` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `email` to the `kullanicilar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `kullanicilar` table without a default value. This is not possible if the table is not empty.
  - Made the column `kullaniciAdiSoyadi` on table `kullanicilar` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "kullanicilar" DROP CONSTRAINT "kullanicilar_pkey",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL,
ALTER COLUMN "kullaniciId" DROP DEFAULT,
ALTER COLUMN "kullaniciId" SET DATA TYPE TEXT,
ALTER COLUMN "kullaniciAdiSoyadi" SET NOT NULL,
ADD CONSTRAINT "kullanicilar_pkey" PRIMARY KEY ("kullaniciId");
DROP SEQUENCE "kullanicilar_kullaniciId_seq";
