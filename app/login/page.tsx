"use client";
import React from "react";
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
import Link from "next/link";
import { showToast } from "@/lib/toast";

const formSchema = z.object({
  email: z.string().email("Geçerli bir mail adresi giriniz."),
  password: z
    .string()
    .min(6, { message: "Şifre en az altı karakter içermelidir." }),
});

const LoginPage = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
      credentials: "include",
    });

    const data = await res.json();
    if (res.ok) {
      const userRes = await fetch("/api/auth", { credentials: "include" });
      const userData = await userRes.json();

      if (userRes.ok && userData.user) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("loginType", "hasta");
      }
      router.push("/");
    } else {
      showToast("Kullanıcı adı veya şifre yanlış!", "error");
    }
  }

  return (
    <div>
      <Card className="flex justify-center w-[750px] mx-auto mt-56 shadow-teal-500 shadow-2xl text-white ">
        <CardHeader>
          <CardTitle className="text-center bg-sky-900 p-3 text-white text-xl font-bold">
            Giriş Yap
          </CardTitle>
        </CardHeader>
        <CardContent>
          {" "}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                Giriş Yap
              </Button>
            </form>
          </Form>
          <h2 className="text-center mt-5 text-black ">
            Hesabın yoksa
            <Link
              href={"/register"}
              className="font-bold hover:text-red-600 underline 
                "
            >
              {" "}
              kayıt ol!
            </Link>
          </h2>
          <h2 className="text-center mt-5 text-black ">
            <Button
              className="font-bold bg-sky-700 hover:bg-sky-950
                "
            >
              <Link href={"/adlogin"}> Admin Girişi</Link>
            </Button>
          </h2>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
