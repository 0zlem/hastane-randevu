-- CreateTable
CREATE TABLE "hastalar" (
    "id" UUID NOT NULL,
    "fullname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefon" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "hastalar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "klinikler" (
    "id" UUID NOT NULL,
    "klinik" TEXT NOT NULL,
    "klinikYeri" TEXT NOT NULL,

    CONSTRAINT "klinikler_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doktorlar" (
    "id" UUID NOT NULL,
    "doktorAdiSoyadi" TEXT NOT NULL,
    "uzmanlikAlani" TEXT NOT NULL,
    "klinikId" UUID NOT NULL,

    CONSTRAINT "doktorlar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "randevuSaatleri" (
    "id" UUID NOT NULL,
    "doktorId" UUID NOT NULL,
    "tarih" TIMESTAMP(3) NOT NULL,
    "saat" TEXT NOT NULL,
    "doluMu" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "randevuSaatleri_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "randevular" (
    "id" UUID NOT NULL,
    "hastaId" UUID NOT NULL,
    "doktorId" UUID NOT NULL,
    "klinikId" UUID NOT NULL,
    "randevuSaatId" UUID NOT NULL,
    "durum" TEXT NOT NULL,

    CONSTRAINT "randevular_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "hastalar_telefon_key" ON "hastalar"("telefon");

-- AddForeignKey
ALTER TABLE "doktorlar" ADD CONSTRAINT "doktorlar_klinikId_fkey" FOREIGN KEY ("klinikId") REFERENCES "klinikler"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "randevuSaatleri" ADD CONSTRAINT "randevuSaatleri_doktorId_fkey" FOREIGN KEY ("doktorId") REFERENCES "doktorlar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "randevular" ADD CONSTRAINT "randevular_hastaId_fkey" FOREIGN KEY ("hastaId") REFERENCES "hastalar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "randevular" ADD CONSTRAINT "randevular_doktorId_fkey" FOREIGN KEY ("doktorId") REFERENCES "doktorlar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "randevular" ADD CONSTRAINT "randevular_klinikId_fkey" FOREIGN KEY ("klinikId") REFERENCES "klinikler"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "randevular" ADD CONSTRAINT "randevular_randevuSaatId_fkey" FOREIGN KEY ("randevuSaatId") REFERENCES "randevuSaatleri"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
