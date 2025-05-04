// components/Chatbot.js
"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const Chatbot = () => {
  const [showChat, setShowChat] = useState(false);
  const [userMessage, setUserMessage] = useState("");
  const [messages, setMessages] = useState([
    { text: "Halo! Ada yang bisa Tania bantu? 😊", sender: "bot" },
  ]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const messageBoxRef = useRef(null);

  // Auto-scroll to the bottom of the chat when new messages are added
  useEffect(() => {
    if (messageBoxRef.current) {
      messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus the input field when chat is opened
  useEffect(() => {
    if (showChat && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 300);
    }
  }, [showChat]);

  const handleSendMessage = async () => {
    if (userMessage.trim() === "") return;

    const userText = userMessage;
    setMessages((prev) => [...prev, { text: userText, sender: "user" }]);
    setUserMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Check if the API returns a reply
      setMessages((prev) => [
        ...prev,
        { text: data.reply || "Maaf, saya tidak mengerti pertanyaan itu.", sender: "bot" },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        { text: "Ups! Gagal menjawab, coba lagi yaa~", sender: "bot" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setUserMessage(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Tombol Chatbot */}
      {!showChat && (
        <button
          onClick={() => setShowChat(true)}
          className="fixed bottom-20 right-6 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-xl z-50"
          aria-label="Open chat"
        >
          🤖
        </button>
      )}

      {/* Box Chatbot */}
      {showChat && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-28 right-6 w-80 bg-white p-4 rounded-xl shadow-2xl border border-gray-300 z-50"
        >
          <div className="flex justify-between items-center mb-3 border-b pb-2">
            <h2 className="font-bold text-indigo-700 text-lg">Tanya aku 🤖</h2>
            <button
              onClick={() => setShowChat(false)}
              className="text-gray-500 hover:text-red-500 text-lg"
              aria-label="Close chat"
            >
              ✖
            </button>
          </div>

          <div
            ref={messageBoxRef}
            className="chat-box h-60 overflow-y-auto mb-4 p-2 bg-gray-50 rounded-lg"
          >
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex mb-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`p-3 rounded-xl text-sm max-w-xs shadow-sm ${
                    msg.sender === "user"
                      ? "bg-indigo-600 text-white font-medium"
                      : "bg-white border border-gray-200 text-gray-800"
                  }`}
                  style={{ wordBreak: "break-word" }}
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}

            {loading && (
              <div className="flex items-center space-x-1 text-sm text-indigo-500 p-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                <span className="ml-2 font-medium">Mengetik...</span>
              </div>
            )}
          </div>

          <div className="flex items-center bg-gray-100 rounded-full p-1 shadow-inner">
            <input
              ref={inputRef}
              type="text"
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-full text-gray-800 text-base font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500"
              placeholder="Tulis pertanyaan..."
              value={userMessage}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              aria-label="Chat input"
            />
            <button
              onClick={handleSendMessage}
              disabled={userMessage.trim() === ""}
              className="ml-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white p-2 rounded-full"
              aria-label="Send message"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default Chatbot;
