/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { showToast } from "@/lib/toast";

const formSchema = z.object({
  klinikId: z.string().min(1, "Klinik seçmelisiniz"),
  doktorId: z.string(),
  tarih: z.string().min(1, "Tarih seçmelisiniz"),
});

export default function Home() {
  const [klinikler, setKlinikler] = useState<
    { id: string; klinik: string; klinikYeri: string }[]
  >([]);
  const [doktorlar, setDoktorlar] = useState<
    { id: string; doktorAdiSoyadi: string; klinikId: string }[]
  >([]);
  const [uygunSaatler, setUygunSaatler] = useState<string[]>([]);

  const [selectSaat, setSelectSaat] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      klinikId: "",
      doktorId: "",
      tarih: "",
    },
  });

  const router = useRouter();

  useEffect(() => {
    async function authLogin() {
      try {
        const res = await fetch("/api/auth");
        const data = await res.json();

        if (!res.ok || !data.user) {
          router.push("/login");
          return;
        }

        const userId = data.user.id;
        const loginType = localStorage.getItem("loginType");

        if (loginType === "admin") {
          const kullaniciRes = await fetch(`/api/kullanici?id=${userId}`);
          const kullaniciData = await kullaniciRes.json();

          if (kullaniciData.varMi) {
            router.push("/adrandevular");
            return;
          }
        }

        if (loginType === "hasta") {
          const hastaRes = await fetch(`/api/hasta?id=${userId}`);
          const hastaData = await hastaRes.json();

          if (hastaData.varMi) {
            router.push("/");
            return;
          }
        }
      } catch (error) {
        router.push("/login");
      }
    }

    authLogin();
  }, []);

  useEffect(() => {
    fetchKlinikler();
  }, []);

  async function fetchKlinikler() {
    const res = await fetch("/api/klinik");
    const data = await res.json();
    setKlinikler(data || []);
  }

  async function fetchDoktorlar(klinikId: string) {
    if (!klinikId) {
      setDoktorlar([]);
      return;
    }

    try {
      const res = await fetch(`/api/doktor/klinikGet?klinikId=${klinikId}`);
      const data = await res.json();
      setDoktorlar(data || []);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    const klinikId = form.watch("klinikId");
    if (klinikId) {
      fetchDoktorlar(klinikId);
      form.setValue("doktorId", "");
    } else {
      setDoktorlar([]);
    }
  }, [form.watch("klinikId")]);

  async function fetchUygunSaatler(
    doktorId: string | undefined,
    tarih: string
  ) {
    if (!tarih) return;

    let url = `/api/randevuSaat?tarih=${tarih}`;
    if (doktorId) {
      url += `&doktorId=${doktorId}`;
    }

    const res = await fetch(url);
    const data = await res.json();
    setUygunSaatler(data.uygunSaatler || []);
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    fetchUygunSaatler(values.doktorId, values.tarih);
  }

  async function handleSaatSec(saat: string) {
    setSelectSaat(saat);
    setDialogOpen(true);
  }

  async function onRandevuSec(saat: string) {
    const values = form.getValues();

    if (!values.klinikId || !values.tarih) {
      showToast("Klinik ve tarih seçmediniz!", "error");
      return;
    }

    let user;
    try {
      const res = await fetch("/api/auth");
      const data = await res.json();

      if (!res.ok || !data.user) {
        showToast("Giriş yapmalısınız!", "error");
        return;
      }
      user = data.user;
    } catch (error) {
      console.log(error, "Kullanıcı doğrulama hatası");
      return;
    }

    const body = {
      hastaId: user.id,
      doktorId: values.doktorId || null,
      klinikId: values.klinikId,
      tarih: values.tarih,
      saat,
    };

    try {
      const res = await fetch("/api/randevu/ekle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (data.success) {
        showToast("Randevu başarıyla kaydedildi", "success");
        setUygunSaatler((prev) => prev.filter((s) => s !== saat));
      } else {
        showToast("Randevu alınırken bir hata oluştu", "error");
      }
    } catch (error) {
      console.error("Randevu ekleme hatası:", error);
      showToast("Bir hata oluştu, tekrar deneyiniz!", "error");
    }

    setDialogOpen(false);
    setSelectSaat(null);
  }

  return (
    <div className="container mx-auto">
      <Card className="flex justify-center w-[800px] mx-auto mt-16">
        <CardHeader>
          <CardTitle className="text-center bg-sky-900 p-2 font-bold text-xl text-white">
            Randevu Ara
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="klinikId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Klinik</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          form.setValue("doktorId", "");
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Klinik Seçiniz" />
                        </SelectTrigger>
                        <SelectContent>
                          {klinikler.map((klinik) => (
                            <SelectItem key={klinik.id} value={klinik.id}>
                              {klinik.klinik}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch("klinikId") && doktorlar.length > 0 && (
                <FormField
                  control={form.control}
                  name="doktorId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Doktor</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Doktor Seçiniz" />
                          </SelectTrigger>
                          <SelectContent>
                            {doktorlar.map((doktor) => (
                              <SelectItem key={doktor.id} value={doktor.id}>
                                {doktor.doktorAdiSoyadi}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="tarih"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tarih</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        min={new Date().toISOString().split("T")[0]}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                className="w-full bg-sky-600 hover:bg-sky-800"
                type="submit"
              >
                Randevu Ara
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {uygunSaatler.length > 0 && (
        <div className="mt-10 mb-10">
          <h1 className="text-center p-2 bg-white m-5 font-bold text-lg">
            Uygun Randevular
          </h1>
          <div className="grid grid-cols-2 gap-4 ">
            <Card className="w-[500px] ">
              <CardHeader className="bg-sky-900 p-3 rounded-lg text-white">
                <CardTitle>{form.getValues("tarih")}</CardTitle>
              </CardHeader>
              <CardContent>
                <h1 className="text-lg">
                  <strong>Doktor:</strong>{" "}
                  {
                    doktorlar.find((d) => d.id === form.getValues("doktorId"))
                      ?.doktorAdiSoyadi
                  }
                </h1>
                <h1 className="text-md">
                  <strong>Klinik:</strong>{" "}
                  {
                    klinikler.find((k) => k.id === form.getValues("klinikId"))
                      ?.klinik
                  }
                </h1>
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {uygunSaatler.map((saat) => (
                    <Button
                      onClick={() => handleSaatSec(saat)}
                      key={saat}
                      className="w-full bg-green-500 hover:bg-green-700"
                    >
                      {saat}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-white text-black font-bold">
          <DialogHeader>
            <DialogTitle>Randevuyu Onayla</DialogTitle>
            <DialogDescription>
              {form.getValues("tarih")} tarihinde saat {selectSaat} için randevu
              almak istiyor musunuz?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              className=" bg-gray-500 hover:bg-gray-700"
              onClick={() => {
                setDialogOpen(false);
                setSelectSaat(null);
              }}
            >
              Vazgeç
            </Button>
            <Button
              className="bg-sky-600 hover:bg-sky-800"
              onClick={() => onRandevuSec(selectSaat!)}
            >
              Onayla
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
