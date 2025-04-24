/*
  Warnings:

  - You are about to drop the column `uzmanlikAlani` on the `doktorlar` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "doktorlar" DROP COLUMN "uzmanlikAlani",
ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "hastalar" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "klinikler" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "randevuSaatleri" ALTER COLUMN "id" SET DEFAULT gen_random_uuid(),
ALTER COLUMN "tarih" SET DATA TYPE DATE;

-- AlterTable
ALTER TABLE "randevular" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- CreateTable
CREATE TABLE "kullanicilar" (
    "kullaniciId" BIGSERIAL NOT NULL,
    "kullaniciAdiSoyadi" TEXT,

    CONSTRAINT "kullanicilar_pkey" PRIMARY KEY ("kullaniciId")
);
