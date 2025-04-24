/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { showToast } from "@/lib/toast";

const formSchema = z.object({
  kullaniciAdiSoyadi: z.string().min(2),
  email: z.string().email("Geçerli bir mail adresi giriniz."),
  password: z
    .string()
    .min(6, { message: "Şifre en az altı karakter içermelidir." }),
});

const RegisterPage = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      kullaniciAdiSoyadi: "",
      email: "",
      password: "",
    },
  });

  const router = useRouter();
  const [error, setError] = useState();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await fetch("/api/adregister", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Bir hata oluştu.");
        return;
      } else {
        showToast("Kayıt başarılı", "success");
      }
      router.push("/adlogin");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <Card className="flex justify-center w-[750px] mx-auto mt-56 shadow-teal-500 shadow-2xl text-white ">
        <CardHeader>
          <CardTitle className="text-center bg-sky-900 p-3 text-white text-xl font-bold">
            Admin Kayıt Ol
          </CardTitle>
        </CardHeader>
        <CardContent>
          {" "}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="kullaniciAdiSoyadi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="bg-sky-900 p-2 w-[85px]">
                      Ad Soyad
                    </FormLabel>
                    <FormControl>
                      <Input className="text-black" type="text" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="bg-sky-900 p-2 w-[85px]">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input className="text-black" type="email" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="bg-sky-900 p-2 w-[85px]">
                      Şifre
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="text-black"
                        type="password"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                className="flex justify-center mx-auto w-100 bg-sky-700 hover:bg-sky-950"
                type="submit"
              >
                Kayıt Ol
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;
