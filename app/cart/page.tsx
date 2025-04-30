'use client'

import React from 'react'
import { useUser as useClerkUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button"
import { useUser } from "@/context/UserContext"
import { useToast } from "@/hooks/use-toast"
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, Coffee } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const CartPage = () => {
  const { isSignedIn } = useClerkUser();
  const router = useRouter()
  const { user, removeFromCart, updateCartItem, clearCart } = useUser()
  const { toast } = useToast()

  const bookItems = user.cart.filter(item => item.itemType === 'book')
  const drinkItems = user.cart.filter(item => item.itemType === 'drink')

  const totalBookItems = bookItems.reduce((sum, item) => sum + item.quantity, 0)
  const totalDrinkItems = drinkItems.reduce((sum, item) => sum + item.quantity, 0)
  const totalItems = totalBookItems + totalDrinkItems

  const totalBookPrice = bookItems.reduce(
    (sum, item) => sum + (item.book.price * item.quantity), 0
  )
  const totalDrinkPrice = drinkItems.reduce(
    (sum, item) => sum + ((item.drink.sizes[item.size]?.price ?? 0) * item.quantity), 0
  )
  const totalPrice = totalBookPrice + totalDrinkPrice

  const handleCheckout = (withDrink: boolean) => {
    if (withDrink) {
      router.push('/select-drink')
    } else {
      toast({
        title: "Order confirmed!",
        description: "Your order has been placed successfully.",
      })
      clearCart()
      router.push('/checkout')
    }
  }

  return (
    <div className="container flex flex-col justify-start mx-auto py-8 px-4 mt-20 min-h-[90vh]">
      <div className="flex items-center mb-6">
        <Button onClick={() => { router.push('/library') }} className="mr-4" variant="ghost" size="icon">
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <ShoppingBag size={20} />
          Your Cart ({totalItems})
        </h1>
      </div>

      {user.cart.length === 0 ? (
        <div className="text-center py-12 flex-1 flex flex-col items-center justify-center">
          <p className="text-lg text-gray-500 mb-4">Your cart is empty</p>
          <Button onClick={() => router.push('/library')} variant="default">
            Browse the books
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {bookItems.length > 0 && (
              <div className="space-y-4">
                {bookItems.map((item) => (
                  <div key={item.book.idBook} className="flex gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="relative w-24 h-32 flex-shrink-0">
                      <img
                        src={item.book.imageUrl}
                        alt={item.book.title}
                        className="h-full object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-lg">{item.book.title}</h3>
                      <p className="text-gray-500">{item.book.author}</p>
                      <p className="font-bold text-green-600 mt-2">
                        ${(item.book.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCart(item.book.idBook, 'book')}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </Button>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateCartItem(
                            item.book.idBook,
                            'book',
                            { quantity: Math.max(1, item.quantity - 1) }
                          )}
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={16} />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateCartItem(
                            item.book.idBook,
                            'book',
                            { quantity: item.quantity + 1 }
                          )}
                        >
                          <Plus size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {drinkItems.length > 0 && (
              <div className="space-y-4 mt-8">
                <h2 className="text-xl font-semibold">Drinks</h2>
                {drinkItems.map((item) => (
                  <div key={`${item.drink.id}-${item.size}`} className="flex gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <Image
                        src={item.drink.imageUrl}
                        alt={item.drink.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-lg">{item.drink.name}</h3>
                      <p className="text-gray-500 capitalize">{item.size} size • {item.drink.temperature}</p>
                      <p className="font-bold text-green-600 mt-2">
                        ${((item.drink.sizes[item.size]?.price ?? 0) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCart(item.drink.id.toString(), 'drink', item.size)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </Button>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateCartItem(
                            item.drink.id.toString(),
                            'drink',
                            { quantity: Math.max(1, item.quantity - 1) },
                            item.size
                          )}
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={16} />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateCartItem(
                            item.drink.id.toString(),
                            'drink',
                            { quantity: item.quantity + 1 },
                            item.size
                          )}
                        >
                          <Plus size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>


          <div className="border rounded-lg p-6 h-fit sticky top-20 bg-gray-50">
            <h2 className="text-xl font-bold mb-4">Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal ({totalItems} items)</span>
                <span>${totalBookPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t">
                <span>Total</span>
                <span>${totalBookPrice.toFixed(2)}</span>
              </div>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <div className={`${!isSignedIn ? "cursor-not-allowed" : "cursor-pointer"}`}>
                  <Button
                    className={`w-full mt-6`}
                    size="lg"
                    disabled={!isSignedIn}
                  >
                    Place Order
                  </Button>
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader className='space-y-4'>
                  <DialogTitle className="text-center text-2xl font-bold px-4">
                    Would you like to buy me a coffee☕!
                  </DialogTitle>
                  <DialogDescription className='text-slate-700'>
                    Read while enjoying a delicious coffee and earn bonus points! Each coffee you buy gives you points for discounts on your next book.
                  </DialogDescription>
                </DialogHeader>
                <div className='rounded-lg overflow-hidden'>
                  <img src="/cart.png" alt="Coffee promotion" />
                </div>
                <DialogFooter className=''>
                  <div className='flex flex-col justify-center items-center gap-4 flex-1'>
                    <Button
                      variant={'default'}
                      className='flex-1 w-full bg-[#272927]'
                      onClick={() => handleCheckout(true)}
                    >
                      Add now!
                    </Button>
                    <Button
                      variant={'secondary'}
                      className='w-full'
                      onClick={() => handleCheckout(false)}
                    >
                      Checkout without drink
                    </Button>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>

          </div>
        </div>
      )}
    </div>
  )
}

export default CartPage