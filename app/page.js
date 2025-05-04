'use client';

import { useEffect, useState } from 'react';
import { FaCartPlus, FaShoppingCart, FaDollarSign } from 'react-icons/fa';
import Link from 'next/link';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Tambahkan kuota dummy untuk setiap produk
          const productsWithQuota = data.map(p => ({
            ...p,
            quota: Math.floor(Math.random() * 6), // 0 - 5 stok acak
          }));
          setProducts(productsWithQuota);
        }
      });

    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  const addToCart = (product) => {
    const updatedCart = [...cart, { ...product, quantity: 1 }];
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter(item => item.id !== productId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const isInCart = (id) => {
    return cart.some(item => item.id === id);
  };

  const getCartCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <main className="min-h-screen bg-gradient-to-r from-gray-800 via-gray-900 to-black p-10 text-white">
      {/* Cart Icon */}
      <div className="fixed top-4 right-4 flex gap-3">
        <Link href="/cart">
          <div className="relative cursor-pointer hover:scale-105 transition">
            <FaShoppingCart className="text-3xl" />
            <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full text-xs px-2">
              {getCartCount()}
            </span>
          </div>
        </Link>
        <Link href="/checkout">
          <div className="bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700 text-sm font-semibold shadow-md">
            Checkout
          </div>
        </Link>
      </div>

      <h1 className="text-4xl font-extrabold text-center mb-12">Produk Eksklusif</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
        {products.map((product) => {
          const inCart = isInCart(product.id);
          return (
            <div
              key={product.id}
              className="bg-gray-800 rounded-3xl shadow-xl p-6 transition transform hover:scale-105 hover:shadow-2xl border border-gray-700 flex flex-col justify-between"
            >
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-48 object-contain rounded-md"
              />
              <h2 className="text-xl font-semibold mt-4 line-clamp-2">{product.title}</h2>
              <p className="text-sm text-gray-400 mt-2 line-clamp-3">{product.description}</p>
              <div className="flex items-center mt-4 text-lg font-bold">
                <FaDollarSign className="mr-1 text-yellow-400" />
                {product.price}
              </div>
              <p className="text-sm mt-1 text-gray-300">Stok tersedia: {product.quota}</p>
              <button
                className={`mt-4 px-4 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2
                  ${product.quota === 0
                    ? 'bg-gray-600 cursor-not-allowed'
                    : inCart
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-blue-600 hover:bg-blue-700'}
                `}
                disabled={product.quota === 0}
                onClick={() => {
                  inCart ? removeFromCart(product.id) : addToCart(product);
                }}
              >
                {inCart ? (
                  <>
                    <FaCartPlus /> Remove from Cart
                  </>
                ) : (
                  <>
                    <FaCartPlus /> Add to Cart
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </main>
  );
}
