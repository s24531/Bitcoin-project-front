// Importowanie niezbędnych zależności
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useShoppingCart } from "../../../context/ShoppingCartContext"; 
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

// Komponent BitcoinWallet do obsługi płatności Bitcoin
const BitcoinWallet: React.FC = () => {
  // Stan komponentu
  const [qrCodeUrl, setQrCodeUrl] = useState<string>(''); // URL wygenerowanego kodu QR
  const [address, setAddress] = useState<string>(''); // Adres portfela Bitcoin
  const [amount, setAmount] = useState<number>(0); // Kwota do zapłaty
  const [balance, setBalance] = useState<number>(0); // Saldo portfela
  const [error, setError] = useState<string | null>(null); // Błąd (jeśli wystąpi)
  const [alert, setAlert] = useState<string>(''); // Alert (np. o nowej płatności)

  // Użycie kontekstu koszyka zakupowego do pobrania całkowitej kwoty
  const { totalPrice } = useShoppingCart();

  // Aktualizacja kwoty do zapłaty przy zmianie wartości w koszyku
  useEffect(() => {
    setAmount(totalPrice);
  }, [totalPrice]);

  // Generowanie adresu i kodu QR dla płatności
  useEffect(() => {
    const fetchAddressAndGenerateQr = async () => {
      try {
        // Pobieranie adresu portfela
        const addressResponse = await axios.get('http://localhost:3001/api/generate-address');
        const newAddress = addressResponse.data.address;
        setAddress(newAddress);

        // Generowanie kodu QR jeśli adres i kwota są poprawne
        if (newAddress && amount > 0) {
          const qrResponse = await axios.post('http://localhost:3001/api/generate-qr', { address: newAddress, amount });
          setQrCodeUrl(qrResponse.data.qrCodeUrl);
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

  // Sprawdzanie salda portfela
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await axios.get('http://localhost:3001/check-balance');
        const newBalance = response.data.balance;
        if (newBalance > balance) {
          setAlert('New payment received!');
          setTimeout(() => setAlert(''), 5000); // Ukrywanie alertu po 5 sekundach
        }
        setBalance(newBalance);
      } catch (error: any) {
        console.error('Error fetching balance:', error);
      }
    };

    const intervalId = setInterval(fetchBalance, 60000); // Sprawdzanie salda co minutę
    fetchBalance();

    return () => clearInterval(intervalId);
  }, [balance]);

  // Renderowanie komponentu
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

// Eksportowanie komponentu
export default BitcoinWallet;