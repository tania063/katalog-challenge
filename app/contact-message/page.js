// app/contact-messages/page.js

"use client";

import { useEffect, useState } from "react";

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetch("/api/comments")
      .then((res) => res.json())
      .then((data) => setMessages(data));
  }, []);

  return (
    <div className="min-h-screen py-20 px-8 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
      <h1 className="text-3xl font-bold mb-8 text-center">Pesan Masuk</h1>

      {messages.length === 0 ? (
        <p className="text-center">Belum ada pesan.</p>
      ) : (
        <ul className="space-y-4 max-w-3xl mx-auto">
          {messages.map((msg) => (
            <li
              key={msg.id}
              className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-md"
            >
              <p className="font-semibold">{msg.name}</p>
              <p className="text-sm text-gray-500">{new Date(msg.createdAt).toLocaleString()}</p>
              <p className="mt-2">{msg.message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
