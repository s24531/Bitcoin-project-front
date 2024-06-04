"use client"
import Link from "next/link";
import { Button } from "@/components/ui/button"
import { useShoppingCart } from "../context/ShoppingCartContext";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  


type ToolsProps = {
    id: number;
    name: string;
    image: string;
    description: string;
    price: number;
    stock: number;
}

export function Tool ({ id, name, image, description, price, stock }: ToolsProps) {
    const { getItemQuantity, increaseCartQuantity, decreaseCartQuantity, removeFromCart } = useShoppingCart();
    const quantity = getItemQuantity(id);
    return (
        <div key={id} className="border p-4 rounded relative group">
        <div className="flex flex-col">
            <div style={{ minHeight: '20vh' }} className="d-flex justify-content-center align-items-center">
                <img className="tool-image" src={image} alt={name} />
            </div>
            <div className="flex flex-col align-start">
                <h2 className="font-bold mb-2">{name}</h2>
                <p>Opis: {description}</p>
                <p>Ilość na stanie: {stock}</p>
                <p>Cena: {price} BTC</p>
            </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            
        <Link href={`/product/${id}`} className="m-2 inline-block bg-blue-600 text-white px-4 py-2 rounded">
            Szczegóły
        </Link> 
            {quantity === 0 ? (
                <Button onClick={() => increaseCartQuantity(id, price)} className="m-2 inline-block bg-blue-600 text-white px-4 py-2 rounded">
                Dodaj do koszyka
                </Button>
            ) : 
            <div className="flex items-center flex-col justify-center" style={{ gap: "1rem"}}>
                <div className="flex items-center justify-center" style={{ gap: "1rem"}}> 
                    <Button onClick={() => decreaseCartQuantity(id)}>-</Button>
                    <div>
                        <span className="text-lg font-bold">{quantity}</span> w koszyku
                    </div>
                    <Button onClick={() => increaseCartQuantity(id, price)}>+</Button>
                </div>
                <Button onClick={() => removeFromCart(id)} className="bg-red-500 px-4 py-2 text-white rounded">Usuń z koszyka</Button>
            </div>
            }
        </div>
    </div>
    )
}