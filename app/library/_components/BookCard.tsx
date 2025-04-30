"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";
import { ShoppingBag, X } from "lucide-react";
import { motion } from "framer-motion";
import { Book as BookType } from "@/types/type";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Rating from "@mui/material/Rating";
import { useRouter } from "next/navigation";

interface BookCardProps {
  book: BookType;
}

const BookCard = ({ book }: BookCardProps) => {
  const { toast } = useToast();
  const { user, addToCart } = useUser();
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationType, setAnimationType] = useState<"add" | "exists">("add");
  const router = useRouter();

  const cartItem = user.cart.find(
    (item) => item.itemType === "book" && item.book.idBook === book.idBook
  );
  const quantityInCart = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    setIsAnimating(true);
    const isAlreadyInCart = quantityInCart > 0;

    if (isAlreadyInCart) {
      setAnimationType("exists");
      toast({
        variant: "destructive",
        title: "Already in cart",
        description: "This book is already added.",
      });
    } else {
      setAnimationType("add");
      addToCart(book);
    }
  };

  return (
    <Card className="w-full shadow-lg rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 my-8 relative">
      <CardHeader
        className="flex justify-center items-center select-none p-4 cursor-pointer"
        onClick={() => router.push(`/library/${book.idBook}`)}
      >
        <img
          src={book.imageUrl}
          alt={`${book.title} cover`}
          className="rounded-lg object-center w-auto h-[300px]"
        />
      </CardHeader>

      <CardContent
        className="flex justify-between items-start gap-10 text-start select-none p-4"
        onClick={() => router.push(`/library/${book.idBook}`)}
      >
        <div className="cursor-pointer">
          <h1 className="font-bold line-clamp-1">{book.title}</h1>
          <p className="text-sm text-gray-500 line-clamp-1">{book.author}</p>
        </div>
        <div className="mt-2 flex justify-start">
          <Rating
            name="half-rating-read"
            defaultValue={book.rating}
            precision={0.5}
            readOnly
            size="small"
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between gap-10 items-center p-4 select-none">
        <span className="font-bold text-green-600">${book.price}</span>
        <motion.div
          whileTap={{ scale: 0.95 }}
          onAnimationComplete={() => setIsAnimating(false)}
        >
          <Button
            variant={quantityInCart > 0 ? "secondary" : "default"}
            onClick={handleAddToCart}
            className="flex gap-1 items-center relative text-xs w-fit p-2 h-fit"
          >
            <ShoppingBag size={16} />
            {quantityInCart > 0 ? (
              <span className="ml-2">{quantityInCart} in the cart</span>
            ) : (
              <span className="ml-2">Add to Cart</span>
            )}
            {isAnimating && (
              <motion.span
                key={animationType}
                initial={{ scale: 0, rotate: -45 }}
                animate={{
                  scale: [1, 1.2, 1],
                  rotate:
                    animationType === "add" ? [0, 10, -10, 0] : [0, -5, 5, 0],
                  opacity: [1, 0.8, 0],
                }}
                transition={{ duration: 0.7 }}
                className={`absolute -top-2 -right-2 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ${animationType === "add" ? "bg-green-500" : "bg-yellow-500"
                  }`}
              >
                {animationType === "add" ? "+1" : <X size={12} />}
              </motion.span>
            )}
          </Button>
        </motion.div>
      </CardFooter>
    </Card>
  );
};

export default BookCard;
