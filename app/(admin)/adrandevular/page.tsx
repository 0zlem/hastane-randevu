"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { showToast } from "@/lib/toast";

type Randevu = {
  id: string;
  durum: string;
  hasta: string;
  doktor: string;
  tarih: string;
  saat: string;
  klinik: string;
  klinikYeri: string;
};

const RandevularPage = () => {
  const [randevu, setRandevu] = useState<Randevu[]>([]);
  const doktorGrup = new Map<string, Randevu[]>();

  randevu.forEach((r) => {
    if (!doktorGrup.has(r.doktor)) {
      doktorGrup.set(r.doktor, []);
    }
    doktorGrup.get(r.doktor)!.push(r);
  });

  async function fetchRandevu() {
    try {
      const res = await fetch("/api/randevu/adGet", {
        credentials: "include",
      });
      const data = await res.json();

      if (!res.ok || !data.randevular) return;

      const parsed: Randevu[] = data.randevular.map((r: any) => ({
        id: r.id,
        durum: r.durum,
        hasta: r.hastalar?.fullname,
        doktor: r.doktorlar?.doktorAdiSoyadi,
        tarih: r.randevuSaatleri?.tarih,
        saat: r.randevuSaatleri?.saat,
        klinik: r.klinikler?.klinik,
        klinikYeri: r.klinikler?.klinikYeri,
      }));

      const today = new Date();
      const bugunVeSonrasi = parsed.filter((r) => {
        const randevuZamani = new Date(`${r.tarih}T${r.saat}`);
        return (
          randevuZamani >= today &&
          r.durum.toLowerCase() !== "iptal" &&
          r.durum.toLowerCase() !== "doktor tarafından iptal edilmiştir"
        );
      });

      setRandevu(bugunVeSonrasi);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    fetchRandevu();
  }, []);

  const handleRandevuIptal = async (id: string) => {
    try {
      const res = await fetch("/api/randevu/adSil", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        fetchRandevu();
        showToast("Randevu başarıyla iptal edildi", "success");
      } else {
        showToast("Randevu iptal etme başarısız!", "error");
      }
    } catch (error) {
      console.log(error, "İptal etme başarısız!");
    }
  };

  return (
    <>
      <div>
        <h1 className="text-center bg-sky-800 text-white font-bold font-serif text-3xl mt-2 w-64 flex justify-center items-center mx-auto rounded-lg">
          Randevular
        </h1>
        <ScrollArea className="h-[960px] rounded-md overflow-y-auto px-4 ">
          {Array.from(doktorGrup.entries()).map(([doktor, randevu]) => (
            <div key={doktor}>
              {" "}
              <h1 className="text-left text-xl text-black bg-white p-2 mt-5 ml-10  font-bold rounded-lg">
                {doktor}
              </h1>
              <div className="p-12 gap-3 flex flex-row text-lg mb-3">
                {randevu.map((r) => (
                  <Card key={r.id} className="w-[500px]">
                    <CardContent>
                      <h1>
                        <strong>Hasta Adı Soyadı:</strong> {r.hasta}
                      </h1>
                      <hr className="m-2 border-2 w-full" />
                      <h1>
                        <strong>Tarih:</strong> {r.tarih}
                      </h1>
                      <h1>
                        <strong>Saat:</strong> {r.saat}
                      </h1>

                      <h1>
                        <strong>Klinik:</strong> {r.klinik}
                      </h1>
                      <h1>
                        <strong>Klinik Yeri:</strong> {r.klinikYeri}
                      </h1>
                      <Button
                        className="bg-red-600 hover:bg-red-800 mt-5 flex justify-center mx-auto w-50 "
                        onClick={() => {
                          handleRandevuIptal(r.id);
                        }}
                      >
                        İptal Et
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>
    </>
  );
};

export default RandevularPage;
