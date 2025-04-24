import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import { showToast } from "@/lib/toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Menu = () => {
  const router = useRouter();
  const [loginType, setLoginType] = useState<string | null>(null);

  useEffect(() => {
    const type = localStorage.getItem("loginType");
    console.log(type);
    setLoginType(type);
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", { method: "POST" });
      if (res.ok) {
        showToast("Çıkış başarılı", "success");
        router.push("/login");
      } else {
        console.log("Çıkış işlemi başarısız!");
      }
    } catch (error) {
      console.log("Çıkış yapılırken hata oluştu!", error);
    }
  };

  return (
    <div>
      <Menubar className="h-15 border-none  bg-sky-700 justify-center">
        <MenubarMenu>
          {loginType === "admin" && (
            <>
              <MenubarTrigger
                className="h-10 w-[130px] font-bold flex justify-center items-center text-md m-4
  bg-white hover:bg-sky-950 hover:text-white"
              >
                <Link
                  href={"/addoktorlar"}
                  className="flex items-center gap-1 "
                >
                  Doktorlar
                </Link>
              </MenubarTrigger>
              <MenubarTrigger
                className="h-10 w-[130px] font-bold flex justify-center items-center text-md m-4
  bg-white hover:bg-sky-950 hover:text-white"
              >
                <Link
                  href={"/adklinikler"}
                  className="flex items-center gap-1 "
                >
                  Klinikler
                </Link>
              </MenubarTrigger>
              <MenubarTrigger
                className="h-10 w-[130px] font-bold flex justify-center items-center text-md m-4
  bg-white hover:bg-sky-950 hover:text-white"
              >
                <Link
                  href={"/adrandevular"}
                  className="flex items-center gap-1 "
                >
                  Randevular
                </Link>
              </MenubarTrigger>
            </>
          )}
          {loginType === "hasta" && (
            <>
              <MenubarTrigger
                className="h-10 w-[130px] font-bold flex justify-center items-center text-md m-4
  bg-white hover:bg-sky-950 hover:text-white"
              >
                <Link href={"/"} className="flex items-center gap-1 ">
                  Randevu Al
                </Link>
              </MenubarTrigger>
              <MenubarTrigger
                className="h-10 w-[130px] font-bold flex justify-center items-center text-md m-4
  bg-white"
              >
                <Link href={"/randevular"} className="flex items-center gap-1">
                  Randevularım
                </Link>
              </MenubarTrigger>
            </>
          )}
          <MenubarTrigger className="h-10 w-[130px] font-bold flex justify-center items-center text-md m-4 bg-red-500  hover:bg-red-700 text-white absolute right-6 ">
            <Link
              href={"#"}
              onClick={handleLogout}
              className="flex items-center gap-1"
            >
              Çıkış Yap
            </Link>
          </MenubarTrigger>
        </MenubarMenu>
      </Menubar>
    </div>
  );
};

export default Menu;
