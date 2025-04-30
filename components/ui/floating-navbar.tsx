"use client";
import React, { useState, useEffect } from "react"
import { useRouter, usePathname } from 'next/navigation'
import { SignInButton, SignUpButton, useAuth, UserButton } from '@clerk/nextjs'
import {
  motion,
  AnimatePresence,
} from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Playfair_Display } from "next/font/google";
import { GiCoffeeBeans } from "react-icons/gi";
import { CirclePlus, ShoppingBag, Bell, CircleUser } from "lucide-react";
import { useUser } from '@/context/UserContext'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: JSX.Element;
  }[];
  className?: string;
}) => {
  const { user } = useUser();
  const [scrollPosition, setScrollPosition] = useState(0);
  const [scrollDirection, setScrollDirection] = useState("up");
  const [visible, setVisible] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { userId } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const currentPosition = window.scrollY;
      const direction = currentPosition > scrollPosition ? "down" : "up";

      setScrollPosition(currentPosition);
      setScrollDirection(direction);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrollPosition]);
  if (pathname === '/payment-success' || pathname === '/profile' || pathname.startsWith('/profile') || pathname.startsWith('/library/')) return;
  return (
    <div
      className={`${scrollPosition === 0
        ? "z-[500] fixed top-0 w-full bg-transparent border-b border-transparent"
        : `z-[500] fixed top-0 w-full border-b backdrop-blur-sm ${pathname === "/"
          ? "bg-white/5 border-neutral-200/5"
          : "bg-neutral-200/5 border-white/[0.1]"
        }`
        }
      } ${scrollDirection === "down"
          ? "transition-transform duration-200 transform -translate-y-full"
          : "transition-transform duration-200 transform translate-y-0"
        }`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          initial={{
            opacity: 1,
            y: -100,
          }}
          animate={{
            y: visible ? 0 : -100,
            opacity: visible ? 1 : 0,
          }}
          transition={{
            duration: 0.2,
          }}
          className={cn(
            "container flex h-16 items-center sm:max-w-[] mx-auto",
            className
          )}
        >
          <h1 className="flex sm:hidden items-center justify-center space-x-2 text-2xl font-bold py-4 text-center dark:text-zinc-700 text-gray-100 mr-10 "></h1>
          <h1
            className={`hidden sm:flex items-center justify-center space-x-2 text-2xl font-bold py-4 text-center mr-10 ${playfair.className
              } ${pathname === "/"
                ? "text-gray-100 selection:bg-indigo-700/[0.2] selection:text-indigo-500"
                : "text-black selection:bg-blue-100 selection:text-blue-500"
              }`}
          >
            Pagina & Espresso
          </h1>
          <div className="relative items-center flex space-x-4">
            {navItems.map((navItem: any, idx: number) => (
              <Link
                key={`link=${idx}`}
                href={navItem.link}
                className={`${pathname === "/"
                  ? "text-zinc-100 hover:text-neutral-300"
                  : "text-black hover:text-neutral-500"
                  }
                ${pathname === navItem.link
                    ? "underline underline-offset-4"
                    : ""
                  }
              `}
              >
                <span className="block sm:hidden px-3">{navItem.icon}</span>
                <span className="hidden sm:block text-base text-center">
                  {navItem.name}
                </span>
              </Link>
            ))}
          </div>
          <div className={`flex justify-center items-center z-[5000] gap-10 `}>
            <div className=" flex items-center justify-center w-fit h-fit flex-row-reverse gap-2">
              <div
                onClick={() => {
                  router.push("/cart");
                }}
                className={`relative cursor-pointer ${pathname === "/"
                  ? "text-zinc-100 hover:text-neutral-300"
                  : "text-black hover:text-neutral-500"
                  }`}
              >
                <ShoppingBag size={24} />
                {user.cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {user.cart.length}
                  </span>
                )}
              </div>
              {userId && (
                <div className="flex justify-center items-center gap-2">
                  <Dialog>
                    <DialogTrigger
                      className={`cursor-pointer ${pathname === "/"
                        ? "text-zinc-100 hover:text-neutral-300"
                        : "text-black hover:text-neutral-500"
                        }`}
                    >
                      <Bell
                        size={24}
                        className={`cursor-pointer ${pathname === "/"
                          ? "text-zinc-100 hover:text-neutral-300"
                          : "text-black hover:text-neutral-500"
                          }`}
                      />
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] w-[50%]">
                      <DialogHeader>
                        <DialogTitle>Notifications</DialogTitle>
                      </DialogHeader>
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2 justify-start items-center">
                          <CircleUser />
                          <p className="font-semibold">
                            Your order has been shipped
                          </p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Link href={"/addBooks"}>
                    <CirclePlus
                      size={24}
                      className={`cursor-pointer ${pathname === "/"
                        ? "text-zinc-100 hover:text-neutral-300"
                        : "text-black hover:text-neutral-500"
                        }`}
                    />
                  </Link>
                </div>
              )}
            </div>
            {userId && (
              <div className="flex items-center justify-center gap-10">
                <div
                  className={`flex items-center justify-center gap-1 cursor-pointer ${pathname === "/"
                    ? "text-zinc-100 hover:text-neutral-300"
                    : "text-black hover:text-neutral-500"
                    }`}
                >
                  <GiCoffeeBeans size={24} />
                  <p className="text-xl font-semibold">{user.points}</p>
                </div>
                <div className="border rounded-full w-fit h-fit p-0 flex items-center border-gray-100/30 dark:border-gray-700">
                  <UserButton />
                </div>
              </div>
            )}
            {!userId && (
              <div className="flex flex-row gap-2">
                <div className="bg-[#F2E1C1] text-[#3E3E3E] hover:bg-[#E1C99C]/90 text-base text-center font-semibold flex items-center justify-center gap-2 rounded-md px-4 py-1">
                  <SignInButton forceRedirectUrl={pathname} mode="redirect">
                    Login
                  </SignInButton>
                </div>
                <div className="bg-[#6A8D73] text-white hover:bg-[#5C7A65]/90 text-base text-center font-semibold flex items-center justify-center gap-2 rounded-md px-4 py-1">
                  <SignUpButton forceRedirectUrl="/" mode="redirect">
                    Sign up
                  </SignUpButton>

                </div>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
//TODO: Add a search bar here
//TODO: commande UI
//TODO: ptr le filtrage

