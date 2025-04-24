/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { showToast } from "@/lib/toast";
import { ScrollArea } from "@/components/ui/scroll-area";

const formSchema = z.object({
  doktorAdiSoyadi: z.string().min(2),
  klinikId: z.string().min(1),
});

const DoktorlarPage = () => {
  const [doktor, setDoktor] = useState<
    {
      klinikler: any;
      id: string;
      doktorAdiSoyadi: string;
      klinikId: string;
    }[]
  >([]);
  const [klinik, setKlinik] = useState<{ id: string; klinik: string }[]>([]);
  const [selectedDoktor, setSelectedDoktor] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      doktorAdiSoyadi: "",
      klinikId: "",
    },
  });

  async function fetchData() {
    try {
      const doktorRes = await fetch("/api/doktor");
      const doktorData = await doktorRes.json();

      setDoktor(doktorData || []);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchKlinik() {
    try {
      const klinikRes = await fetch("/api/klinik");
      const klinikData = await klinikRes.json();
      setKlinik(klinikData || []);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchData();
    fetchKlinik();
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await fetch("/api/doktor/ekle", {
        method: "POST",
        body: JSON.stringify(values),
        headers: { "Content-Type": "application/json" },
      });
      console.log(res);
      if (res.ok) {
        showToast("Doktor başarıyla eklendi", "success");
        await fetchData();
        form.reset();
      } else {
        showToast("Doktor eklenirken bir hata oluştur.", "error");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function onDelete(doktorId: string) {
    try {
      if (!doktorId) {
        showToast("Lütfen silinecek doktoru seçiniz!", "success");
        return;
      }

      const res = await fetch("/api/doktor/sil", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doktorId }),
      });

      const result = await res.json();
      console.log("Silme İşlemi Sonucu:", result);

      if (res.ok) {
        showToast("Doktor başarıyla silindi.", "success");
        await fetchData();
      } else {
        showToast("Doktor silinirken bir hata oluştur!", "success");
      }
    } catch (error) {
      console.error("Hata:", error);
    }
  }

  return (
    <div>
      <div className="flex flex-row justify-center m-5">
        <div>
          <Card className="w-[500px] m-2">
            <CardHeader>
              <CardTitle className="text-center text-xl">Doktor Ekle</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <FormField
                    control={form.control}
                    name="doktorAdiSoyadi"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ad Soyad</FormLabel>
                        <FormControl>
                          <Input type="text" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="klinikId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Uzmanlık Alanı</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={(value) => {
                              form.setValue("klinikId", value);
                            }}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Klinik adı seçiniz" />
                            </SelectTrigger>
                            <SelectContent>
                              {klinik.map((kliniks) => (
                                <SelectItem key={kliniks.id} value={kliniks.id}>
                                  {kliniks.klinik}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="bg-cyan-700 hover:bg-cyan-900 w-50 flex justify-center mx-auto font-bold "
                  >
                    Ekle
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="w-[500px] m-2">
            <CardHeader>
              <CardTitle className="text-center text-xl">Doktor Sil</CardTitle>
            </CardHeader>
            <CardContent>
              <Select onValueChange={setSelectedDoktor}>
                <SelectTrigger className="w-full mt-5 mb-5">
                  <SelectValue placeholder="Silmek için doktor seçin" />
                </SelectTrigger>
                <SelectContent>
                  {doktor.map((doktors) => (
                    <SelectItem key={doktors.id} value={doktors.id}>
                      {" "}
                      {doktors.doktorAdiSoyadi}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex justify-center items-center">
                <Button
                  onClick={() => onDelete(selectedDoktor)}
                  type="submit"
                  className="bg-red-700 hover:bg-red-900 w-50 flex justify-center mx-auto font-bold"
                >
                  Sil
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="flex justify-center mx-auto w-[1000px] bg-white rounded-lg p-5">
        <ScrollArea className="w-[1000px] h-[550px] rounded-md overflow-y-auto px-4 ">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-10">ID</TableHead>
                <TableHead>Doktor Adı</TableHead>
                <TableHead>Uzmanlık Alanı</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {doktor.map((doktors) => (
                <TableRow key={doktors.id}>
                  <TableCell className="pl-10">{doktors.id}</TableCell>
                  <TableCell>{doktors.doktorAdiSoyadi}</TableCell>
                  <TableCell>{doktors.klinikler?.klinik}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </div>
  );
};

export default DoktorlarPage;
