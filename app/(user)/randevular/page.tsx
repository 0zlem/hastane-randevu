"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { showToast } from "@/lib/toast";

type Randevu = {
  id: string;
  durum: string;
  tarih: string;
  saat: string;
  doktorAdiSoyadi: string;
  klinik: string;
  klinikYeri: string;
};

const RandevuPage = () => {
  const [gelecekRandevu, setGelecekRandevu] = useState<Randevu[]>([]);
  const [gecmisRandevu, setGecmisRandevu] = useState<Randevu[]>([]);

  async function fetchRandevu() {
    try {
      const res = await fetch("/api/randevu", { credentials: "include" });
      const data = await res.json();

      if (!res.ok || !data.randevular) return;

      const randevu: Randevu[] = data.randevular.map((r: any) => ({
        id: r.id,
        durum: r.durum,
        tarih: r.randevuSaatleri?.tarih,
        saat: r.randevuSaatleri?.saat,
        doktorAdiSoyadi: r.doktorlar?.doktorAdiSoyadi,
        klinik: r.klinikler?.klinik,
        klinikYeri: r.klinikler?.klinikYeri,
      }));

      const today = new Date();
      const gecmisTarihAltLimit = new Date();
      gecmisTarihAltLimit.setDate(today.getDate() - 15);

      const gecmis: Randevu[] = [];
      const gelecek: Randevu[] = [];

      randevu.forEach((r) => {
        const rTarih = new Date(`${r.tarih}T${r.saat}`);

        if (
          (r.durum === "iptal" ||
            r.durum === "doktor tarafından iptal edilmiştir" ||
            rTarih < today) &&
          rTarih >= gecmisTarihAltLimit
        ) {
          gecmis.push(r);
        } else if (rTarih >= today) {
          gelecek.push(r);
        }
      });

      setGelecekRandevu(gelecek);
      setGecmisRandevu(gecmis);
    } catch (error) {
      console.log("Randevu çekme hatası:", error);
    }
  }

  useEffect(() => {
    fetchRandevu();
  }, []);

  const handleRandevuIptal = async (id: string) => {
    try {
      const res = await fetch("/api/randevu/sil", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        showToast("Randevu başarıyla iptal edildi!", "success");
        fetchRandevu();
      } else {
        showToast("Randevu iptal edilemedi!", "error");
      }
    } catch (error) {
      console.log(error, "İptal etme başarısız!");
    }
  };

  const renderRandevuCard = (r: Randevu, isFuture = false) => {
    return (
      <Card className="m-3  " key={r.id}>
        <CardContent>
          <h1>
            <strong>Tarih:</strong> {r.tarih}
          </h1>
          <h1>
            <strong>Saat:</strong> {r.saat}
          </h1>
          <h1>
            <strong>Doktor:</strong> {r.doktorAdiSoyadi}
          </h1>
          <h1>
            <strong>Klinik:</strong> {r.klinik}
          </h1>
          <h1>
            <strong>Klinik Yeri:</strong> {r.klinikYeri}
          </h1>
          {r.durum === "iptal" && (
            <h1 className="mt-2 text-sm font-semibold text-red-600">
              İptal Edildi
            </h1>
          )}
          {r.durum === "doktor tarafından iptal edilmiştir" && (
            <h1 className="mt-2 text-sm font-semibold text-red-600">
              Doktor Tarafından İptal Edilmiştir
            </h1>
          )}
          {isFuture && (
            <div className="">
              <Button
                className="bg-red-600 hover:bg-red-900 w-50 m-3"
                onClick={() => handleRandevuIptal(r.id)}
              >
                İptal Et
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div>
      <h1
        className="text-center p-3 flex justify-center bg-white
     mx-auto mt-16 font-bold text-xl rounded-lg w-[1500px]"
      >
        Randevularım
      </h1>

      <div className="bg-sky-800 m-5 rounded-lg w-[1500px] mx-auto mt-5 pb-2">
        <h1 className="text-center p-3 bg-sky-800 border-4 border-cyan-600 text-white font-bold text-lg rounded-lg">
          Gelecek Randevularım
        </h1>{" "}
        <ScrollArea className="w-[1500px] h-[450px] rounded-md overflow-y-auto px-4 ">
          {gelecekRandevu.length > 0 ? (
            gelecekRandevu.map((r) => renderRandevuCard(r, true))
          ) : (
            <p className="bg-white text-black text-center text-lg rounded-lg">
              Gelecek randevu bulunamadı.
            </p>
          )}
        </ScrollArea>
      </div>
      <div className="bg-sky-800 m-5 rounded-lg w-[1500px] mx-auto pb-2">
        <h1 className="text-center p-3 bg-sky-800 border-4 border-cyan-600 text-white font-bold text-lg rounded-lg">
          Geçmiş Randevularım
        </h1>
        <ScrollArea className="h-[600px] rounded-md overflow-y-auto px-4">
          {gecmisRandevu.length > 0 ? (
            gecmisRandevu.map((r) => renderRandevuCard(r))
          ) : (
            <p className="bg-white text-black text-center text-lg rounded-lg">
              Geçmiş randevu bulunamadı.
            </p>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};

export default RandevuPage;
