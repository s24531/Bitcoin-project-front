"use client"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { usePathname } from "next/navigation";
import { ShoppingCart as Cart } from 'lucide-react';
import { CartItem } from "./CartItem";
import { useShoppingCart } from "../context/ShoppingCartContext";
import { Stack } from "react-bootstrap";
import Link from "next/link";
import { useState } from "react";


export function ShoppingCart() {

  const { cartQuantity, cartItems, totalPrice } = useShoppingCart();
  const [selectedOption, setSelectedOption] = useState('');
  let deliveryCost = 0;
  if (selectedOption === 'pack') {
    deliveryCost = 12;
  } else if (selectedOption === 'courier') {
    deliveryCost = 15;
  }
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger>
        <Cart className="h-8 w-auto" />
      </SheetTrigger>
      <SheetContent style={{ display: 'flex', flexDirection: 'column' }}>
        <SheetHeader>
          <SheetTitle>Koszyk</SheetTitle>
          <SheetDescription>
            <Stack>
              {cartItems.map((item) => (
                <CartItem key={item.id} {...item} />
              ))}
            </Stack>
          </SheetDescription>
        </SheetHeader>
        <div style={{ marginTop: 'auto' }}>
          <div className="ms-auto text-sm text-gray-500">
            {
              totalPrice !== 0 &&
              `Razem: ${totalPrice.toFixed(2)} BTC`
            }
          </div>
          
          <div className="ms-auto text-base text-black font-bold">
            {!selectedOption || cartQuantity === 0 ? (
              null
            ) :
              `Razem ${totalPrice !== 0 && (totalPrice + deliveryCost).toFixed(2)} BTC`
            }
          </div>
          <div className="ms-auto text-base text-white">
            {pathname === "/form" || cartQuantity === 0 ? (
              null
            ) :
              <Link href={`/form`} className="mt-2 inline-block bg-blue-600 text-white px-4 py-2 rounded">
                Formularz dostawy
              </Link>
            }
          </div>
        </div>
      </SheetContent>
    </Sheet>

  )
}