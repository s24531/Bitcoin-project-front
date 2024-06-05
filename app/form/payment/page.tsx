"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useShoppingCart } from "../../../context/ShoppingCartContext"; // Assuming you have a ShoppingCartContext

const BitcoinWallet: React.FC = () => {
  const [address, setAddress] = useState<string>('');
  const [balance, setBalance] = useState<number | null>(null);
  const [privateKey, setPrivateKey] = useState<string>('');
  const [recipientAddress, setRecipientAddress] = useState<string>('');

  // Get the total price from the shopping cart context
  const { totalPrice } = useShoppingCart();

  // Set the initial amount to the total price
  const [amount, setAmount] = useState<number>(totalPrice);
  const [txid, setTxid] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // When the total price changes, update the amount
  useEffect(() => {
    setAmount(totalPrice);
  }, [totalPrice]);

  const checkBalance = async () => {
    console.log(address);
    try {
        const response = await axios.post('/get-balance', { address });
        setBalance(response.data.balance);
        setError(null);
    } catch (err: any) {
        setError(err.message);
    }
  };

  const sendPayment = async () => {
    try {
      const response = await axios.post('/send-payment', {
        fromAddress: address,
        privateKey,
        toAddress: recipientAddress,
        amount
      });
      setTxid(response.data.txid);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="container mx-auto mt-4">
      <h1 className="text-center text-3xl font-bold mb-4">Bitcoin Wallet</h1>
      <div className="p-2 border rounded shadow mb-4">
        <h2 className="text-xl font-semibold mb-2">Check Balance</h2>
        <input
          className="border rounded p-2 w-full mb-2"
          type="text"
          placeholder="Bitcoin Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <button className="bg-blue-500 text-white rounded p-2 w-full" onClick={checkBalance}>Check Balance</button>
        {balance !== null && <p className="mt-2">Balance: {balance} BTC</p>}
      </div>
      <div className="p-2 border rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Send Payment</h2>
        <input
          className="border rounded p-2 w-full mb-2"
          type="text"
          placeholder="Private Key"
          value={privateKey}
          onChange={(e) => setPrivateKey(e.target.value)}
        />
        <input
          className="border rounded p-2 w-full mb-2"
          type="text"
          placeholder="Recipient Address"
          value={recipientAddress}
          onChange={(e) => setRecipientAddress(e.target.value)}
        />
        <input
          className="border rounded p-2 w-full mb-2"
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(parseFloat(parseFloat(e.target.value).toFixed(5)))}
          disabled
        />
        <button className="bg-blue-500 text-white rounded p-2 w-full" onClick={sendPayment}>Send</button>
        {txid && <p className="mt-2">Transaction ID: {txid}</p>}
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default BitcoinWallet;