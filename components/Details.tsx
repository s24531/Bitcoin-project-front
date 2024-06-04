"use client"
import { useShoppingCart } from "@/context/ShoppingCartContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Button } from "@/components/ui/button"
import { useState } from "react";

type DetailsProps = {
  id: number;
  name: string;
  image: string;
  detailed_description: string;
  price: number;
  stock: number;
}

export function Details({ id, name, image, detailed_description, price, stock }: DetailsProps) {

  const { getItemQuantity, increaseCartQuantity, decreaseCartQuantity, removeFromCart } = useShoppingCart();
  const quantity = getItemQuantity(id);
  const [selectedOption, setSelectedOption] = useState('');

  let deliveryCost = 0;
  if (selectedOption === 'pack') {
    deliveryCost = 12;
  } else if (selectedOption === 'courier') {
    deliveryCost = 15;
  }

  return (
    <Card style={{ maxWidth: "60vw" }} className=" max-h-full overflow-auto">
      <CardHeader>
        <div className="flex">
          <div>
            <CardTitle className="text-2xl">{name}</CardTitle>
            <CardDescription className="text-base">{detailed_description}</CardDescription>
          </div>
          <img className="max-h-52 w-auto" src={image} alt={name} style={{ marginLeft: 'auto' }} />
        </div>
      </CardHeader>
      <CardContent>
        <div>Na stanie: {stock}szt</div>
        <div>Cena: {price}BTC</div>
      </CardContent>
      <CardFooter>
        {quantity === 0 ? (
          <Button onClick={() => increaseCartQuantity(id, price)} className=" inline-block bg-blue-600 text-white px-4 py-2 rounded">
            Dodaj do koszyka
          </Button>
        ) :
          <div className="flex items-center flex-col justify-center" style={{ gap: "1rem" }}>
            <div className="flex items-center justify-center" style={{ gap: "1rem" }}>
              <Button onClick={() => decreaseCartQuantity(id)}>-</Button>
              <div>
                <span className="text-lg font-bold">{quantity}</span> w koszyku
              </div>
              <Button onClick={() => increaseCartQuantity(id, price)}>+</Button>
            </div>
            <Button onClick={() => removeFromCart(id)} className="bg-red-500 px-4 py-2 text-white rounded">Usuń z koszyka</Button>
          </div>
        }
      </CardFooter>
    </Card>
  )
}