'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function CheckoutPage() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.quantity * item.price, 0).toFixed(2);
  };

  const handleCheckout = () => {
    alert('Terima kasih! Pesanan Anda sedang diproses.');
    localStorage.removeItem('cart');
    setCart([]);
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white p-10">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {cart.length === 0 ? (
        <div>
          <p className="text-gray-400 mb-4">Keranjang belanja Anda kosong.</p>
          <Link href="/" className="text-blue-400 underline">Kembali ke katalog</Link>
        </div>
      ) : (
        <div className="bg-gray-800 p-6 rounded-xl shadow-xl space-y-4">
          {cart.map(item => (
            <div key={item.id} className="flex justify-between items-center border-b border-gray-600 pb-3">
              <div>
                <h2 className="font-semibold">{item.title}</h2>
                <p className="text-sm text-gray-400">x{item.quantity}</p>
              </div>
              <p className="text-lg font-bold">${(item.quantity * item.price).toFixed(2)}</p>
            </div>
          ))}

          <div className="mt-4 text-right">
            <p className="text-lg">Total Item: <span className="font-bold">{getTotalItems()}</span></p>
            <p className="text-xl mt-2">Total Harga: <span className="font-bold text-green-400">${getTotalPrice()}</span></p>
            <button
              onClick={handleCheckout}
              className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold"
            >
              Proses Checkout
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
