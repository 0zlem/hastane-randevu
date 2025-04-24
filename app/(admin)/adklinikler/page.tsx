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
  klinik: z.string().min(2),
  klinikYeri: z.string().min(2),
});

const KlinikPage = () => {
  const [klinik, setKlinik] = useState<
    {
      id: string;
      klinik: string;
      klinikYeri: string;
    }[]
  >([]);
  const [selectedKlinik, setSelectedKlinik] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      klinik: "",
      klinikYeri: "",
    },
  });

  async function fetchData() {
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
  }, []);

  async function onSubmit(values: { klinik: string; klinikYeri: string }) {
    try {
      console.log("Gönderilen Veri:", values);

      const res = await fetch("/api/klinik/ekle", {
        method: "POST",
        body: JSON.stringify(values),
        headers: { "Content-Type": "application/json" },
      });

      const result = await res.json();

      console.log("API Yanıtı:", result);

      if (res.ok) {
        showToast("Klinik başarıyla eklendi.", "success");
        await fetchData();
        form.reset();
      } else {
        showToast("klinik eklenirken bir hata oluştu.", "error");
      }
    } catch (error) {
      console.error("Hata:", error);
    }
  }

  async function onDelete(klinikId: string) {
    try {
      if (!klinikId) {
        return;
      }
      const res = await fetch("/api/klinik/sil", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ klinikId }),
      });
      if (res.ok) {
        showToast("Klinik başarıyla silindi.", "success");
        await fetchData();
      } else {
        showToast("Klinik silinirken bir hata oluştu!", "error");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <div className="flex flex-row justify-center m-5">
        <div>
          <Card className="w-[500px] m-2">
            <CardHeader>
              <CardTitle className="text-center text-xl">Klinik Ekle</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <FormField
                    control={form.control}
                    name="klinik"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Klinik Adı</FormLabel>
                        <FormControl>
                          <Input type="text" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="klinikYeri"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Klinik Yeri</FormLabel>
                        <FormControl>
                          <Input type="text" {...field} />
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
              <CardTitle className="text-center text-xl">Klinik Sil</CardTitle>
            </CardHeader>
            <CardContent>
              <Select onValueChange={setSelectedKlinik}>
                <SelectTrigger className="w-full mt-5 mb-5">
                  <SelectValue placeholder="Silmek için kategori seçin" />
                </SelectTrigger>
                <SelectContent>
                  {klinik.map((kliniks) => (
                    <SelectItem key={kliniks.id} value={kliniks.id}>
                      {kliniks.klinik}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex justify-center items-center">
                <Button
                  onClick={() => onDelete(selectedKlinik)}
                  type="submit"
                  className="bg-red-700 hover:bg-red-900 w-50 flex justify-center mx-auto font-bold "
                >
                  Sil
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="flex justify-center mx-auto w-[1000px] bg-white rounded-lg p-5">
        <ScrollArea className="w-[1000px] h-[400px] rounded-md overflow-y-auto px-4 ">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-10">ID</TableHead>
                <TableHead>Klinik Adı</TableHead>
                <TableHead>Klinik Yeri</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {klinik.map((kliniks) => (
                <TableRow key={kliniks.id}>
                  <TableCell className="pl-10">{kliniks.id}</TableCell>
                  <TableCell>{kliniks.klinik}</TableCell>
                  <TableCell>{kliniks.klinikYeri}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </div>
  );
};

export default KlinikPage;
