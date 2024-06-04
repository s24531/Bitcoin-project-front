"use client"
import "../../globals.css";
import "../../animation.css"
import React, { useEffect } from 'react';
import { useShoppingCart } from '@/context/ShoppingCartContext';

const ThankYouPage = () => {
  const { clearCart } = useShoppingCart(); 

  useEffect(() => {
    clearCart();
  }, []);

  return (
    <div className="text-4xl font-bold" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      Dziękujemy za zakup!
    </div>
  );
};

export default ThankYouPage;