'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
      const storedProducts = JSON.parse(localStorage.getItem('products')) || [];
      setCart(storedCart);
      setProducts(storedProducts);
    }
  }, []);

  const updateQuantity = (id, quantity) => {
    const stock = products.find(p => p.id === id)?.stock || 1;
    const newQty = Math.max(1, Math.min(quantity, stock));
    const updatedCart = cart.map(item =>
      item.id === id ? { ...item, quantity: newQty } : item
    );
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeItem = (id) => {
    const updated = cart.filter(item => item.id !== id);
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-center items-center">
        <h2 className="text-xl mb-4">Keranjang kosong.</h2>
        <Link href="/" className="text-blue-400 underline">Kembali ke katalog</Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-900 text-white p-10">
      <h1 className="text-3xl font-bold mb-6">Keranjang Belanja</h1>
      <div className="grid gap-6">
        {cart.map(item => {
          const stock = products.find(p => p.id === item.id)?.stock || 1;
          return (
            <div key={item.id} className="bg-gray-800 p-4 rounded-lg shadow-md">
              <div className="flex items-center gap-4">
                <img src={item.image} alt={item.title} className="w-20 h-20 object-contain" />
                <div className="flex-1">
                  <h2 className="text-lg font-semibold">{item.title}</h2>
                  <p className="text-sm text-gray-400">${item.price} x {item.quantity} = <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span></p>
                  <div className="flex gap-2 mt-2 items-center">
                    <label htmlFor={`qty-${item.id}`}>Qty:</label>
                    <input
                      id={`qty-${item.id}`}
                      type="number"
                      min="1"
                      max={stock}
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                      className="w-16 px-2 py-1 bg-gray-700 text-white rounded"
                    />
                    <span className="text-sm text-gray-400">/ {stock}</span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="ml-auto bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <Link href="/" className="inline-block mt-8 text-blue-400 underline">
        Tambah item lain
      </Link>
    </main>
  );
}
