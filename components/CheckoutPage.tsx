"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import convertToSubcurrency from "@/lib/convertToSubcurrency";
import { useUser } from "@/context/UserContext";

const CheckoutPage = ({ amount, appliedCouponId }: { amount: number, appliedCouponId?: string | null }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, removeFromWallet, addPoints, calculateTotalDrinkPoints } = useUser();
  const router = useRouter();

  useEffect(() => {
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: convertToSubcurrency(amount) }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [amount]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      return;
    }

    const { error: submitError } = await elements.submit();
    const hasDrink = user.cart.some(item => item.itemType === "drink");

    if (submitError) {
      setErrorMessage(submitError.message);
      setLoading(false);
      return;
    }

    hasDrink && addPoints(calculateTotalDrinkPoints(user.cart));
    console.log("calculateTotalDrinkPoints >>", calculateTotalDrinkPoints(user.cart))
    console.log("Points after payement >>", user.points);
    setLoading(false);
    router.push(`/payment-success?amount=${amount}`);
    appliedCouponId &&
      removeFromWallet(appliedCouponId);

  };

  if (!clientSecret || !stripe || !elements) {
    return (
      <div className="flex items-center justify-center">
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-md h-full w-full flex  flex-col justify-center items-center gap-5">
      {clientSecret && <PaymentElement className="w-full h-full" />}

      {errorMessage && <div>{errorMessage}</div>}

      <button
        disabled={!stripe || loading}
        className="text-white w-fit mx-auto p-5 bg-black mt-2 rounded-md font-bold disabled:opacity-50 disabled:animate-pulse"
      >
        {!loading ? `Pay here` : "Processing..."}
      </button>
    </form>
  );
};

export default CheckoutPage;