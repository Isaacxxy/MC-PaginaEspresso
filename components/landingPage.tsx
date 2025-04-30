"use client";
import React from "react";
import { Playfair_Display } from "next/font/google";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";
import { TbBooks } from "react-icons/tb";
import { IoMdAdd } from "react-icons/io";
import { RiDrinks2Line } from "react-icons/ri";
import { TbProgressCheck } from "react-icons/tb";
import { MultiStepLoader as Loader } from "@/components/ui/multi-step-loader";
import { useState } from "react";
import { IconSquareRoundedX } from "@tabler/icons-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DotBackgroundDemo } from "./ui/dotBackground";

const playfair = Playfair_Display({ subsets: ["latin"] });

const LandingPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  console.log(loading);

  return (
    <div className="flex flex-col items-center justify-center w-full relative ">
      <Loader loadingStates={steps} loading={loading} duration={2000} />
      {loading && (
        <button
          className="fixed z-[1000] top-4 right-4 text-black"
          onClick={() => setLoading(false)}
        >
          <IconSquareRoundedX className="h-10 w-10" />
        </button>
      )}
      <div className={`w-full h-screen bg-fixed ${loading && "z-[550]"}`}>
        <div className="absolute inset-0 h-screen bg-black opacity-[50%]"></div>
        <img
          src="/pic1.jpg"
          alt="Landing Page"
          className="w-full h-full object-cover"
        />
        {!loading && (
          <div
            className={`absolute flex items-center justify-center text-white text-center text-2xl font-bold w-[500px] flex-col gap-4 right-0 top-[10%] translate-y-[-50%] translate-x-[-50%]`}
          >
            <p className={`font-bold ${playfair.className}`}>
              What could be more soothing than savoring a hot cup of coffee
              while diving into the pages of your favorite book?
            </p>
            <div className="flex flex-row gap-4">
              <Button
                onClick={() => router.push("/library")}
                className="bg-[#F2E1C1] text-[#3E3E3E] hover:bg-[#E1C99C]/90 text-base text-center font-semibold flex items-center justify-center gap-2 rounded-md px-4 py-2"
              >
                Treat Yourself
                <ArrowRight className="mt-[3px]" />
              </Button>
              <Button
                onClick={() => setLoading(true)}
                className="bg-[#6A8D73] text-white hover:bg-[#5C7A65]/90 text-base text-center font-semibold flex items-center justify-center gap-2 rounded-md px-4 py-2"
              >
                How it works
                <TbProgressCheck />
              </Button>
            </div>
          </div>
        )}
      </div>
      <div className="w-full">
        <StickyScroll content={content} />
      </div>
      <div className="w-full h-screen bg-fixed flex justify-center items-center relative snap-start snap-normal">
        <div className="absolute inset-0 bg-black opacity-[70%] z-0"></div>
        <img
          src="/pic10.jpg"
          alt="Landing Page"
          className="w-full h-full object-center"
        />
        <div
          className={`absolute z-10 flex items-center justify-center text-white text-center text-2xl flex-col gap-5`}
        >
          <p className={`font-semibold ${playfair.className}`}>
            “Lose yourself in a world of words—explore our collection and start
            your next journey.”
          </p>
          <div className="flex flex-row justify-center items-center gap-4">
            <div
              onClick={() => router.push("/library")}
              className="bg-[#F2E1C1] text-black hover:bg-[#F2E1C1]/70 text-base text-center font-semibold flex flex-row-reverse items-center justify-center gap-2 rounded-md px-4 py-2 cursor-pointer"
            >
              Our Collection
              <TbBooks size={24} />
            </div>
            <div
              onClick={() => router.push("/addBooks")}
              className="bg-[#D4B38A] text-black hover:bg-[#D4B38A]/70 text-base text-center font-semibold flex flex-row-reverse items-center justify-center gap-2 rounded-md px-4 py-2 cursor-pointer"
            >
              New Book
              <IoMdAdd size={24} />
            </div>
          </div>
        </div>
      </div>
      <div className="w-[100%]  h-screen flex justify-center relative">
        <DotBackgroundDemo className="-z-20 absolute h-full bg-white" />
        <div className="w-[50%] h-full flex flex-col items-center justify-start gap-20">
          <p className="w-[100%] font-bold text-xl mb-4 md:mb-0 md:text-7xl mt-16 md:leading-[78px] text-center text-zinc-900">
            Frequently asked questions
          </p>
          <div className="w-full">
            <Accordion type="multiple" className="w-full text-lg">
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  What is the purpose of this website?
                </AccordionTrigger>
                <AccordionContent>
                  The purpose of Book Coffee is to create a unique shopping
                  experience that combines the love of books with the enjoyment
                  of coffee. Our platform allows users to purchase books and, if
                  they choose, add a coffee to their order.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>
                  How do I find the best products?
                </AccordionTrigger>
                <AccordionContent>
                  Finding the best products can be a challenge, but we are here
                  to help. We have a team of experts who carefully curate our
                  products to ensure that they are of the highest quality and
                  meet our high standards. We also have a detailed product
                  description, customer reviews, and product ratings to help you
                  make an informed decision. If you still have any questions,
                  feel free to contact us and we will be happy to help you.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>How can I track my order?</AccordionTrigger>
                <AccordionContent>
                  Once your order has shipped, you will receive an email with
                  tracking information. You can use this information to track
                  your order and see when it will arrive. If you have any
                  questions or concerns about your order, please don't hesitate
                  to contact us.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
      <div className="w-full h-screen bg-fixed flex justify-center items-center relative">
        <div className="absolute inset-0 bg-black opacity-[70%] z-0"></div>
        <img
          src="/pic6.jpg"
          alt="Landing Page"
          className="w-full h-full object-cover"
        />
        <div
          className={`absolute z-10 flex items-center justify-center text-white text-center w-[40%] text-2xl flex-col gap-5`}
        >
          <p className={`font-semibold ${playfair.className}`}>
            Refresh your mind with every sip! Explore our selection of
            handcrafted coffees, teas, and refreshing beverages—perfect for
            pairing with your next great read.
          </p>
          <div
            onClick={() => router.push("/Library")}
            className="bg-[#6A8D73] text-white hover:bg-[#6A8D73]/70 text-base text-center font-semibold flex flex-row-reverse items-center justify-center gap-2 rounded-md px-4 py-2 cursor-pointer"
          >
            Check our Menu
            <RiDrinks2Line size={18} />
          </div>
        </div>
      </div>
    </div>
  );
};
const content = [
  {
    title: "A Shared Literary Experience",
    description:
      "Experience the joy of reading together! Gather with friends, sip on your favorite drink, and dive into captivating stories while sharing thoughts and discoveries.",
    content: (
      <div className="flex h-full w-full items-center justify-center text-white">
        <Image
          src="/pic7.jpg"
          width={800}
          height={500}
          className="h-full w-full object-cover"
          alt="linear board demo"
        />
      </div>
    ),
  },
  {
    title: "A Special Treat Awaits!",
    description:
      "Buy a book and unlock a special drink offer, letting you enjoy every page in a warm and cozy atmosphere.",
    content: (
      <div className="flex h-full w-full items-center justify-center text-white">
        <Image
          src="/pic3.jpg"
          width={800}
          height={500}
          className="h-full w-full object-cover"
          alt="linear board demo"
        />
      </div>
    ),
  },
  {
    title: "Read, Sip, Reward Yourself!",
    description:
      "Buy a book, add a coffee, and earn points! The more you savor, the more you save—redeem your points for exclusive discounts on your next reads.",
    content: (
      <div className="flex h-full w-full items-center justify-center text-white">
        <Image
          src="/pic5.jpg"
          width={800}
          height={500}
          className="h-full w-full object-cover"
          alt="linear board demo"
        />
      </div>
    ),
  },
];

const steps = [
  {
    text: "📚 Browse and select a book from our collection.",
  },
  {
    text: "➕ Add a coffee to your order to earn reward points.",
  },
  {
    text: "💳 Complete your purchase securely online.",
  },
  {
    text: "🎯 Earn points for every coffee purchased.",
  },
  {
    text: "🎟️ Redeem your points for discount coupons on future books.",
  },
  {
    text: "📖 Enjoy your book with a perfect cup of coffee!",
  },
];

export default LandingPage;
