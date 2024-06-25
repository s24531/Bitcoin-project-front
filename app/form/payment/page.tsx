"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useShoppingCart } from "../../../context/ShoppingCartContext"; 
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

const BitcoinWallet: React.FC = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>(''); 
  const [address, setAddress] = useState<string>(''); 
  const [amount, setAmount] = useState<number>(0); 
  const [balance, setBalance] = useState<number>(0); 
  const [error, setError] = useState<string | null>(null); 
  const [alert, setAlert] = useState<string>(''); 

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
    if (!address) return;
    sendPaymentDetailsToBackend(address, amount, 'No payment received from this address');

    const fetchBalance = async () => {
      if (!address) return; 
    
      try {
        const response = await axios.post('http://localhost:3001/api/check-payment', { address, amount });
        let status = response.data.message;
        console.log('Payment status:', status);
        if (status === 'Payment received' || status === 'The amount is less than the required')
          {
            await axios.put('http://localhost:3001/api/edit-details', { address, status });
          }
      } catch (error: any) {
        console.error('Error fetching balance:', error.message);
      }
    };

    const intervalId = setInterval(fetchBalance, 60000); 
    fetchBalance();

    return () => clearInterval(intervalId);
  }, [balance, address, amount]);


  const sendPaymentDetailsToBackend = async (address: string, amount: number, paymentStatus: string) => {
    const formData = localStorage.getItem('formData');
    const cartData = localStorage.getItem('cartItems');
    if (!formData || !cartData) {
      console.error('Form data or cart items are missing.');
      return;
    }

    const parsedFormData = JSON.parse(formData);
    const parsedCartData = JSON.parse(cartData);

    try {
      await axios.post('http://localhost:3001/api/submit-payment-details', {
        customer: parsedFormData,
        cartItems: parsedCartData,
        payment: {
          address,
          amount,
          status: paymentStatus,
        },
      });
      console.log('Payment details sent to backend successfully.');
    } catch (error: any) {
      console.error('Error sending payment details to backend:', error.message);
    }
  };

  const appendPaymentDetailsToFile = (address: string, amount: number) => {
    const formData = localStorage.getItem('formData');
    const cartData = localStorage.getItem('cartItems');
    if (!formData) {
      console.error('Form data is missing.');
      return;
    }
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
          <div>Loading QR code...</div>
        )}
        <div className="mt-2 text-center">Amount: {amount.toFixed(5)} BTC</div>
        <div className="mt-2 text-center">Address: {address}</div>
      </div>
      {error && <div className="text-red-500 mt-2 text-center">{error}</div>}
    </div>
  );
};

export default BitcoinWallet;
