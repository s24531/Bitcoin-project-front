"use client"
import { useEffect, useState } from "react";
import { Tool } from "../components/Tool";
import '../app/animation.css'
import '../app/globals.css'
import { Input } from "@/components/ui/input"

export default function Home() {

  type ToolsProps = {
    id: number;
    name: string;
    image: string;
    description: string;
    price: number;
    stock: number;
  }

  useEffect(() => {
    const fetchPlanesData = async () => {
      const response = await fetch('http://localhost:3001/api/planes');
      const data = await response.json();
      setProducts(data);
    };
    fetchPlanesData();
  }, []);

  const [toolsData, setProducts] = useState<ToolsProps[]>([]);

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);

  return (
    <div className="bg-white text-black">
      <main className="flex items-start p-24">
        <div>
          Filtruj po cenie:
          <Input className="min-w-28 max-w-28" min={0} type="number" placeholder="Min" value={minPrice} onChange={e => setMinPrice(Number(e.target.value))} />
          <Input className="minJe-w-28 max-w-28" min={0} type="number" placeholder="Max" value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))} />
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <h1 className="text-2xl font-bold mb-8">Witaj w naszym sklepie!</h1>
          </div>
          <div className="grid grid-cols-5 gap-4">
            {toolsData
              .filter(product => (minPrice === 0 || product.price >= minPrice) && (maxPrice === 0 || product.price <= maxPrice))
              .map((product: ToolsProps) => (
                <div key={product.id}>
                  <Tool {...product} />
                </div>
              ))}
          </div>
        </div>
      </main>
    </div>
  )
}