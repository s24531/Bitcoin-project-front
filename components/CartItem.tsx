"use client"
import { useShoppingCart } from "../context/ShoppingCartContext";
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Stack } from "react-bootstrap";

type CartItemProps = {
    id: number
    quantity: number
}

type ToolsProps = {
    id: number;
    name: string;
    image: string;
    price: number;
}

export function CartItem({ id, quantity }: CartItemProps) {
    const { removeFromCart, increaseCartQuantity, decreaseCartQuantity } = useShoppingCart();
    const [itemData, setItemData] = useState<ToolsProps | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch(`http://localhost:3001/api/planes/${id}`)
            .then(response => response.json())
            .then(data => {
                setItemData(data);
                setIsLoading(false);
            });
    }, [id]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <Stack direction="horizontal" gap={4} className="flex items-center">
            <img src={itemData?.image} className="w-2/12 h-auto" style={{ objectFit: "cover" }}></img>
            <div className="me-auto text-black flex items-center">
                <div className="flex items-center">
                    <div>
                        <div>
                            {itemData?.name} {quantity > 0 && (
                                <div>
                                    <Button className="text-xs px-2 py-1 mr-1" onClick={() => decreaseCartQuantity(id)}>-</Button>
                                    <span>{quantity}</span>
                                    <Button className="text-xs px-2 py-1 ml-1" onClick={() => increaseCartQuantity(id, itemData?.price ?? 0)}>+</Button>
                                </div>
                            )}
                        </div>
                        <div className="text-gray-500 text-xs">{itemData?.price} BTC</div>
                    </div>
                </div>
                <Button className="ml-2 hover:bg-zinc-300 border-solid border-2 border-red-500 bg-transparent text-red-500" onClick={() => removeFromCart(id)}>&times;</Button>
            </div>
        </Stack>
    )
}
