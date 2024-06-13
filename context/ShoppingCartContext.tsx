"use client"
import React, { ReactNode, createContext, useContext, useReducer, useEffect } from "react";

type ShoppingCartProviderProps = {
    children: ReactNode;
}

type CartItem = {
    id: number;
    quantity: number;
    price: number;
}

type Action =
  | { type: 'increase'; id: number; price: number }
  | { type: 'decrease'; id: number }
  | { type: 'remove'; id: number }
  | { type: 'clear'; id?: never };

type ShoppingCartContext = {
    getItemQuantity: (id: number) => number
    increaseCartQuantity: (id: number, price: number) => void
    decreaseCartQuantity: (id: number) => void
    removeFromCart: (id: number) => void
    clearCart: () => void
    cartQuantity: number
    cartItems: CartItem[]
    totalPrice: number
}

const ShoppingCartContext = createContext({} as ShoppingCartContext);

function cartReducer(state: CartItem[], action: Action): CartItem[] {
    switch (action.type) {
        case 'increase':
            return state.find(item => item.id === action.id)
                ? state.map(item => item.id === action.id ? { ...item, quantity: item.quantity + 1 } : item)
                : [...state, { id: action.id, quantity: 1, price: action.price! }];
        case 'decrease':
            return state.find(item => item.id === action.id && item.quantity > 1)
                ? state.map(item => item.id === action.id ? { ...item, quantity: item.quantity - 1 } : item)
                : state.filter(item => item.id !== action.id);
        case 'remove':
            return state.filter(item => item.id !== action.id);
        case 'clear':
            return []
        default:
            return state;
    }
}

export function ShoppingCartProvider({ children }: ShoppingCartProviderProps) {
    const [cartItems, dispatch] = useReducer(cartReducer, [], () => {
        if (typeof window !== 'undefined') {
            const localData = localStorage.getItem('cartItems');
            return localData ? JSON.parse(localData) : [];
        }
        return [];
    });

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const getItemQuantity = (id: number) => {
        return cartItems.find(item => item.id === id)?.quantity || 0;
    }

    const increaseCartQuantity = (id: number, price: number) => {
        dispatch({ type: 'increase', id, price });
    }

    const decreaseCartQuantity = (id: number) => {
        dispatch({ type: 'decrease', id });
    }

    const removeFromCart = (id: number) => {
        dispatch({ type: 'remove', id });
    }

    const clearCart = () => {
        dispatch({ type: 'clear' });
    };
    
    const cartQuantity = cartItems.reduce((quantity, item) => item.quantity + quantity, 0);
    const totalPrice = cartItems.reduce((total, cartItem) => total + cartItem.price * cartItem.quantity, 0);

    return (
        <ShoppingCartContext.Provider value={{ getItemQuantity, increaseCartQuantity, decreaseCartQuantity, removeFromCart, cartQuantity, cartItems, totalPrice, clearCart }}>
            {children}
        </ShoppingCartContext.Provider>
    );
}

export const useShoppingCart = () => {
    return useContext(ShoppingCartContext);
}
