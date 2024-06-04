"use client"
import { usePathname } from "next/navigation";
import { useShoppingCart } from "../context/ShoppingCartContext";
import { ShoppingCart } from "./ShoppingCart";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import Link from "next/link";


export function Navibar() {
  const { cartQuantity } = useShoppingCart();
  const pathname = usePathname();

  return (
    <NavigationMenu className="shadow-md p-3 min-w-full">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink className="shop-title text-2xl font-bold">
              Sklep z samolotami
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          {cartQuantity === 0 ? (
            <div style={{ marginLeft: "78vw" }}>
              <ShoppingCart />
            </div>
          ) :
            <div style={{ marginLeft: "78vw" }}>
              <ShoppingCart />
              <div className="w-6 h-6 bg-red-600 rounded-full text-center text-white float-right">
                {cartQuantity}
              </div>
            </div>
          }
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
