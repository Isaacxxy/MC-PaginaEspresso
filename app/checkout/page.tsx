'use client'
import React, { useEffect, useState } from "react";
import Link from "next/link";
import CheckoutPage from "@/components/CheckoutPage";
import convertToSubcurrency from "@/lib/convertToSubcurrency";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import useUser from '@/context/UserContext';
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from '@/components/ui/scroll-area';
import { useUser as useClerkUser } from '@clerk/nextjs';
import { CardStack } from '@/components/ui/card-stack';
import { ThreeDMarquee } from "@/components/ui/3d-marquee";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { CouponCard } from "@/components/coupon";
import { coupons } from "@/data";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import DragDrop from "../rewards/_components/DragDrop";
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { images } from "@/data"
import { toast } from "@/hooks/use-toast";



if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);


export default function Home() {
  const ClerkUser = useClerkUser();
  console.log("ClerkUser >>", ClerkUser);
  const emailAddress = ClerkUser.user?.emailAddresses[0].emailAddress;
  console.log("emailAddress >>", emailAddress)

  const { user, removeFromWallet } = useUser();
  console.log("user >>", user);

  const bookItems = user.cart.filter(item => item.itemType === 'book');
  const drinkItems = user.cart.filter(item => item.itemType === 'drink');

  const totalBookPrice = bookItems.reduce(
    (sum, item) => sum + (item.book.price * item.quantity), 0
  );

  const totalDrinkPrice = drinkItems.reduce(
    (sum, item) => sum + ((item.drink.sizes[item.size]?.price ?? 0) * item.quantity), 0
  );

  console.log("totalBookPrice >>", totalBookPrice);
  console.log("totalDrinkPrice >>", totalDrinkPrice);
  console.log("bookItems >>", bookItems);
  console.log("drinkItems >>", drinkItems);
  const [amount, setAmount] = useState((totalBookPrice + totalDrinkPrice).toFixed(2));
  const [selectedCouponId, setSelectedCouponId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const calculateTotalWithCoupon = () => {
    const subtotal = parseFloat(amount);
    const selectedCoupon = user.wallet.find(c => c.id === selectedCouponId);

    if (!selectedCoupon) {
      return {
        originalAmount: subtotal,
        discount: 0,
        finalAmount: subtotal,
        coupon: null
      };
    }

    const discount = subtotal * selectedCoupon.discount / 100;
    const finalAmount = subtotal - discount;

    return {
      originalAmount: subtotal,
      discount,
      finalAmount,
      coupon: selectedCoupon
    };
  };

  const { originalAmount, discount, finalAmount, coupon } = calculateTotalWithCoupon();

  const handleApplyCoupon = () => {
    if (!selectedCouponId) return;
    setAmount(finalAmount.toFixed(2));
    setIsDialogOpen(false);

    toast({
      title: "Coupon appliqué!",
      description: `Réduction de ${coupon?.discount}% appliquée`,
    });
  };

  const CARDS = [
    {
      id: 0,
      content: (
        <div className=''>
          <div className="flex justify-between items-center relative z-10">
            <div className="w-12 h-8 bg-gradient-to-r from-yellow-100 to-yellow-50 rounded-md"></div>
            <div className="flex space-x-2">
              <div className="w-8 h-8 bg-white/20 rounded-full"></div>
              <div className="w-8 h-8 bg-white/20 rounded-full"></div>
            </div>
          </div>
          <div className="mt-6 relative z-10">
            <p className="tracking-[0.2em] text-lg font-medium">Connected to iPhone</p>
            <div className="flex items-center gap-2 mt-3">
              <p className="text-sm opacity-90">Apple Pay</p>
              <span className="text-sm opacity-75">•</span>
              <p className="text-sm opacity-90">Connected</p>
            </div>
          </div>
        </div>
      ),
      className: "bg-gradient-to-br from-[#000000] to-[#262626]",
    },
    {
      id: 1,
      content: (
        <div className=''>
          <div className="flex justify-between items-center relative z-10">
            <div className="w-12 h-8 bg-gradient-to-r from-yellow-100 to-yellow-50 rounded-md"></div>
            <div className="flex space-x-2">
              <div className="w-8 h-8 bg-white/20 rounded-full"></div>
              <div className="w-8 h-8 bg-white/20 rounded-full"></div>
            </div>
          </div>
          <div className="mt-6 relative z-10">
            {ClerkUser.isLoaded && (
              <p className="text-lg font-medium">{emailAddress}</p>
            )}
            <div className="flex items-center gap-2 mt-3">
              <p className="text-sm opacity-90">PayPal</p>
              <span className="text-sm opacity-75">•</span>
              <p className="text-sm opacity-90">Connected</p>
            </div>
          </div>
        </div>
      ),
      className: "bg-gradient-to-br from-[#00457C] to-[#0079C1]",
    },
    {
      id: 2,
      content: (
        <div className=''>
          <div className="flex justify-between items-center relative z-10">
            <div className="w-12 h-8 bg-gradient-to-r from-yellow-100 to-yellow-50 rounded-md"></div>
            <div className="flex space-x-2">
              <div className="w-8 h-8 bg-white/20 rounded-full"></div>
              <div className="w-8 h-8 bg-white/20 rounded-full"></div>
            </div>
          </div>
          <div className="mt-6 relative z-10">
            <p className="tracking-[0.2em] text-lg font-medium">**** **** **** 2834</p>
            <div className="flex items-center gap-2 mt-3">
              <p className="text-sm opacity-90">Credit Card</p>
              <span className="text-sm opacity-75">•</span>
              <p className="text-sm opacity-90">Visa</p>
            </div>
          </div>
        </div>
      ),
      className: "bg-gradient-to-br from-[#FF7757] to-[#FF5C38]",
    },
  ];

  return (
    <main className="py-16 px-4 mt-20">
      <div className='max-w-6xl mx-auto'>
        <div className='text-center mb-12'>
          <h1 className="text-4xl font-bold mb-4">Complete Your
            <span className="text-[#FF7757]"> Purchase</span>
          </h1>
          <p className="text-gray-600">Feel free to pay with your credit card, or use your reward points to get an instant reduction on your total.</p>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          <Dialog>
            <DialogTrigger asChild>
              <div className='bg-[#F9FAFB] rounded-[18px] p-4 border border-[#E1E1E1] shadow-[0px_37px_10px_0px_rgba(0,0,0,0.00),_0px_24px_10px_0px_rgba(0,0,0,0.01),_0px_13px_8px_0px_rgba(0,0,0,0.02),_0px_6px_6px_0px_rgba(0,0,0,0.03),_0px_1px_3px_0px_rgba(0,0,0,0.04)] my-5 cursor-pointer'>
                <div className='space-y-4 rounded-xl p-4 border border-[#E1E1E1] bg-white w-full h-[320px] overflow-hidden'>
                  <ThreeDMarquee images={images} className="h-full" />
                </div>
                <h3 className="text-xl font-bold mt-6 mb-2 transform-none" >Brew & Earn</h3>
                <p className="text-gray-500 text-sm leading-relaxed opacity: 1">Explore exclusive coupons and discover exciting rewards tailored just for you</p>
              </div>
            </DialogTrigger>
            <DialogContent className="flex flex-col justify-start items-center gap-4">
              <DialogHeader className="flex flex-col gap-4">
                <DialogTitle className="text-center">Buy Coupons</DialogTitle>
                <DialogDescription className="text-center">
                  the more you <span className="text-[#FF7757]">shop</span>, the more you <span className="text-[#FF7757]">earn!</span>
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {coupons.map((coupon) => (
                  <div className="flex flex-col gap-2 items-center justify-center">
                    <CouponCard coupons={coupon} badge />
                    <p className="text-center text-lg font-medium">{coupon.title}</p>
                  </div>
                ))}
              </div>
              <DialogFooter>
                <Link href={"/rewards"}>
                  <Button>
                    Go to Rewards
                  </Button>
                </Link>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog >
            <DialogTrigger asChild>
              <div className='bg-[#F9FAFB] rounded-[18px] p-4 border border-[#E1E1E1] shadow-[0px_37px_10px_0px_rgba(0,0,0,0.00),_0px_24px_10px_0px_rgba(0,0,0,0.01),_0px_13px_8px_0px_rgba(0,0,0,0.02),_0px_6px_6px_0px_rgba(0,0,0,0.03),_0px_1px_3px_0px_rgba(0,0,0,0.04)] cursor-pointer'>
                <div className='space-y-4 rounded-xl p-4 border border-[#E1E1E1] bg-white h-[320px]'>
                  <div className="mb-8 text-center">
                    {coupon ? (
                      <>
                        <p className="text-gray-500 line-through">${originalAmount.toFixed(2)}</p>
                        <h2 className="text-[32px] font-bold bg-clip-text text-transparent bg-gradient-to-b from-[#333333] via-[#5E5E5E] to-[#000000]">
                          ${finalAmount.toFixed(2)}
                        </h2>
                        <p className="text-green-600 text-sm mb-1">
                          You saved ${discount.toFixed(2)} ({coupon.discount}% off)
                        </p>
                      </>
                    ) : (
                      <>
                        <h2 className="text-[32px] font-bold bg-clip-text text-transparent bg-gradient-to-b from-[#333333] via-[#5E5E5E] to-[#000000]">
                          ${originalAmount.toFixed(2)}
                        </h2>
                        <p className="text-gray-500 text-sm mb-1">Total Due</p>
                      </>
                    )}
                  </div>
                  <CardStack items={CARDS} />
                </div>
                <h3 className="text-xl font-bold mt-6 mb-2">Easy payments</h3>
                <p className="text-gray-500 text-sm leading-relaxed opacity:0">we accept all major credit and debit cards, making your checkout process quick and hassle-free.</p>
              </div>
            </DialogTrigger>
            <DialogContent className="w-[80%] min-h-[40vh] p-10 flex flex-col gap-10">
              <DialogHeader className="flex flex-col gap-4">
                <DialogTitle className="text-center text-xl font-semibold uppercase">Easy payments</DialogTitle>
              </DialogHeader>
              <div className="w-full">
                <Elements
                  stripe={stripePromise}
                  options={{
                    mode: "payment",
                    amount: convertToSubcurrency(parseFloat(amount) === 0 ? parseFloat('20') :
                      (
                        coupon ?
                          parseFloat(finalAmount.toFixed(2))
                          :
                          parseFloat(originalAmount.toFixed(2))
                      )),
                    currency: "usd",
                  }}
                >
                  <CheckoutPage amount={parseFloat(amount) === 0 ? parseFloat('20') : (
                    coupon ?
                      parseFloat(finalAmount.toFixed(2))
                      :
                      parseFloat(originalAmount.toFixed(2))
                  )}
                    appliedCouponId={selectedCouponId} />
                </Elements>
              </div>
            </DialogContent>
          </Dialog>
          <div className='bg-[#F9FAFB] rounded-[18px] p-4 border border-[#E1E1E1] shadow-[0px_37px_10px_0px_rgba(0,0,0,0.00),_0px_24px_10px_0px_rgba(0,0,0,0.01),_0px_13px_8px_0px_rgba(0,0,0,0.02),_0px_6px_6px_0px_rgba(0,0,0,0.03),_0px_1px_3px_0px_rgba(0,0,0,0.04)] my-5'>
            <div className='space-y-4 rounded-xl p-4 border border-[#E1E1E1] bg-white h-[320px] flex flex-col justify-center items-center '>
              <div className="w-full">
                <AnimatedTestimonials testimonials={coupons} />
              </div>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger className="cursor-pointer" asChild>
                <div>
                  <h3 className="text-xl font-bold mt-6 mb-2 transform-none" >Use your wallet</h3>
                  <p className="text-gray-500 text-sm leading-relaxed opacity: 1">Your wallet might hold a surprise. Open it to discover your coupons and rewards, the perfect discount could be waiting to sweeten your purchase!</p>
                </div>
              </DialogTrigger>
              <DialogContent className="w-[50%]">
                <DialogHeader className="flex flex-col gap-4">
                  <DialogTitle className="text-center">Your Wallet</DialogTitle>
                  <DialogDescription className="text-center">
                    Got <span className="text-[#FF7757]">Coupons?</span> Let's <span className="text-[#FF7757]">Use Them!</span>
                  </DialogDescription>
                </DialogHeader>
                <div>
                  <ScrollArea className="min-h-[30vh]">
                    {user.wallet.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500">Your wallet is empty</p>
                      </div>
                    ) : (
                      <RadioGroup
                        value={selectedCouponId || ""}
                        onValueChange={setSelectedCouponId}
                        className="space-y-3"
                      >
                        {user.wallet.map((coupon) => (
                          <div
                            key={coupon.id}
                            className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50"
                          >
                            <RadioGroupItem value={coupon.id} id={coupon.id} />
                            <Label htmlFor={coupon.id} className="flex-1 cursor-pointer">
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="font-medium">{coupon.title}</p>
                                  <p className="text-sm text-gray-500">
                                    {coupon.pointsRequired} points • {coupon.discount}% off
                                  </p>
                                </div>
                                <span className="text-green-600 font-bold">
                                  -${(originalAmount * coupon.discount / 100).toFixed(2)}
                                </span>
                              </div>
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    )}
                  </ScrollArea>
                </div>
                <DialogFooter className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedCouponId(null);
                      setIsDialogOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleApplyCoupon}
                    disabled={!selectedCouponId}
                  >
                    Apply Coupon
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

      </div>
    </main >
  );
}