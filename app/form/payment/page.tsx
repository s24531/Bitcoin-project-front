"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useShoppingCart } from "../../../context/ShoppingCartContext"; 
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { saveAs } from 'file-saver';

const BitcoinWallet: React.FC = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>(''); 
  const [address, setAddress] = useState<string>(''); 
  const [amount, setAmount] = useState<number>(0); 
  const [balance, setBalance] = useState<number>(0); 
  const [error, setError] = useState<string | null>(null); 
  const [alert, setAlert] = useState<string>(''); 

  const { totalPrice, cartItems } = useShoppingCart();

  useEffect(() => {
    setAmount(totalPrice);
  }, [totalPrice]);

  useEffect(() => {
    const fetchAddressAndGenerateQr = async () => {
      try {
        const addressResponse = await axios.get('http://localhost:3001/api/generate-address');
        const newAddress = addressResponse.data.address;
        setAddress(newAddress);

        if (newAddress && amount > 0) {
          const qrResponse = await axios.post('http://localhost:3001/api/generate-qr', { address: newAddress, amount });
          setQrCodeUrl(qrResponse.data.qrCodeUrl);

          appendPaymentDetailsToFile(newAddress, amount);
        } else {
          setError('Address or amount is missing.');
        }
      } catch (error: any) {
        setError(error.message);
      }
    };

    if (amount > 0) {
      fetchAddressAndGenerateQr();
    }
  }, [amount]);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await axios.get('http://localhost:3001/check-balance');
        const newBalance = response.data.balance;
        if (newBalance > balance) {
          setAlert('New payment received!');
          setTimeout(() => setAlert(''), 5000);
        }
        setBalance(newBalance);
      } catch (error: any) {
        console.error('Error fetching balance:', error);
      }
    };

    const intervalId = setInterval(fetchBalance, 60000); 
    fetchBalance();

    return () => clearInterval(intervalId);
  }, [balance]);

  const appendPaymentDetailsToFile = (address: string, amount: number) => {
    const formData = localStorage.getItem('formData');
    const cartData = localStorage.getItem('cartItems');
    if (!formData) {
      console.error('Form data is missing.');
      return;
    }

    const parsedFormData = JSON.parse(formData);
    const parsedCartData = cartData ? JSON.parse(cartData) : [];
    const cartItemsText = parsedCartData.map((item: any) => `Produkt ID: ${item.id}, Ilość: ${item.quantity}, Cena: ${item.price} BTC`).join('\n');
    
    const content = `
Dane klienta:
Imię: ${parsedFormData.name}
Nazwisko: ${parsedFormData.surname}
Adres: ${parsedFormData.address}
Miasto: ${parsedFormData.city}
Kod pocztowy: ${parsedFormData.postalCode}
Państwo: ${parsedFormData.country}
Numer telefonu: ${parsedFormData.phoneNumber}
Email: ${parsedFormData.email}

Produkty w koszyku:
${cartItemsText}

Bitcoin Payment Details:
Address: ${address}
Amount: ${amount} BTC
    `;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'form-data.txt');
  };

  return (
    <div className="container mx-auto mt-4">
      <h1 className="text-center text-3xl font-bold mb-4">Bitcoin Payment</h1>
      {alert && (
        <Alert>
          <Terminal className="h-4 w-4" />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>{alert}</AlertDescription>
        </Alert>
      )}
      <div className="p-4 border rounded shadow mb-4">
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
