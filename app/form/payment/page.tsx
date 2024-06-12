"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useShoppingCart } from "../../../context/ShoppingCartContext"; 

const BitcoinWallet: React.FC = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [amount, setAmount] = useState<number>(0); // Inicjalna kwota do zapłaty
  const [error, setError] = useState<string | null>(null);

  const { totalPrice } = useShoppingCart();

  useEffect(() => {
    setAmount(totalPrice);
  }, [totalPrice]);

  useEffect(() => {
    const fetchAddressAndGenerateQr = async () => {
      try {
        const addressResponse = await axios.get('http://localhost:3001/api/generate-address');
        const newAddress = addressResponse.data.address;
        setAddress(newAddress);

        const qrResponse = await axios.post('http://localhost:3001/api/generate-qr', { address: newAddress, amount });
        setQrCodeUrl(qrResponse.data.qrCodeUrl);
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchAddressAndGenerateQr();
  }, [amount]);

  return (
    <div className="container mx-auto mt-4">
      <h1 className="text-center text-3xl font-bold mb-4">Bitcoin Payment</h1>
      <div className="p-2 border rounded shadow mb-4">
        <h2 className="text-xl font-semibold mb-2">Scan the QR code to make a payment:</h2>
        {qrCodeUrl ? (
          <img src={qrCodeUrl} alt="QR Code for Bitcoin Payment" className="mx-auto" />
        ) : (
          <p>Loading QR code...</p>
        )}
        <p className="mt-2 text-center">Amount: {amount} BTC</p>
        <p className="mt-2 text-center">Address: {address}</p>
      </div>
      {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
    </div>
  );
};

export default BitcoinWallet;
