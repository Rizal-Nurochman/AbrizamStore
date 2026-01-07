"use client";

import { useState, useRef, useEffect, FormEvent, useMemo } from "react";
import { useChatbot } from "@/hooks/useChatbot";

const MAX_MESSAGE_LENGTH = 500;

// Simple markdown to HTML converter
function formatMessage(text: string): string {
  return text
    // Bold: **text** or __text__
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.+?)__/g, '<strong>$1</strong>')
    // Italic: *text* or _text_
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/_([^_]+)_/g, '<em>$1</em>')
    // Bullet points: * item or - item at start of line
    .replace(/^[\*\-]\s+(.+)$/gm, '• $1')
    // Numbered lists: 1. item
    .replace(/^(\d+)\.\s+(.+)$/gm, '$1. $2')
    // Line breaks
    .replace(/\n/g, '<br/>');
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const { messages, isLoading, sendMessage, clearMessages } = useChatbot();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading && inputValue.length <= MAX_MESSAGE_LENGTH) {
      sendMessage(inputValue);
      setInputValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_MESSAGE_LENGTH) {
      setInputValue(value);
    }
  };

  const isOverLimit = inputValue.length > MAX_MESSAGE_LENGTH;
  const isNearLimit = inputValue.length > MAX_MESSAGE_LENGTH * 0.8;

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center group"
        aria-label={isOpen ? "Tutup chat" : "Buka chat"}
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}

        {/* Pulse animation when closed */}
        {!isOpen && (
          <span className="absolute w-full h-full rounded-full bg-violet-600 animate-ping opacity-30" />
        )}
      </button>

      {/* Chat Window */}
      <div
        className={`
          fixed z-40 transition-all duration-300 ease-out
          ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}
          
          /* Mobile: Full screen */
          bottom-0 right-0 left-0 top-0
          lg:bottom-24 lg:right-6 lg:left-auto lg:top-auto
          lg:w-96 lg:h-[32rem] lg:rounded-2xl
          
          bg-white/95 backdrop-blur-xl shadow-2xl
          lg:border lg:border-gray-200/50
          
          flex flex-col overflow-hidden
        `}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-semibold">DODOLAN AI</h3>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={clearMessages}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              title="Hapus percakapan"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center p-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-violet-100 to-indigo-100 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Halo! Saya Dodolan AI</h4>
              <p className="text-gray-500 text-sm mb-4">
                Saya siap membantu menganalisis data bisnis kamu dan memberikan insight untuk pengembangan usaha kamu.
              </p>
              <div className="space-y-2 w-full max-w-xs">
                {[
                  "Bagaimana performa penjualan bulan ini?",
                  "Produk mana yang paling laku?",
                  "Gimana kondisi stok saya?",
                ].map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(suggestion)}
                    className="w-full text-left p-3 text-sm bg-gray-50 hover:bg-violet-50 text-gray-700 hover:text-violet-700 rounded-xl transition-colors border border-gray-100 hover:border-violet-200"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>

            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`
                  max-w-[85%] p-3 rounded-2xl
                  ${message.role === "user"
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-br-sm"
                    : "bg-gray-100 text-gray-800 rounded-bl-sm"
                  }
                `}
              >
                {message.role === "user" ? (
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                ) : (
                  <div
                    className="text-sm prose prose-sm max-w-none prose-strong:font-semibold"
                    dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                  />
                )}
                <p className={`text-xs mt-1 ${message.role === "user" ? "text-white/60" : "text-gray-400"}`}>
                  {message.timestamp.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 p-3 rounded-2xl rounded-bl-sm">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-100 bg-white">
          <div className="flex gap-2 items-end">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Tanyakan tentang bisnis Anda..."
                rows={1}
                maxLength={MAX_MESSAGE_LENGTH}
                className={`w-full resize-none rounded-xl border p-3 pr-16 text-sm focus:outline-none focus:ring-2 focus:border-transparent max-h-32 ${isOverLimit
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-200 focus:ring-violet-500"
                  }`}
                disabled={isLoading}
              />
              {/* Character counter */}
              <span
                className={`absolute bottom-3 right-3 text-xs ${isOverLimit ? "text-red-500" : isNearLimit ? "text-amber-500" : "text-gray-400"
                  }`}
              >
                {inputValue.length}/{MAX_MESSAGE_LENGTH}
              </span>
            </div>
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading || isOverLimit}
              className="p-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          {/* Disclaimer */}
          <p className="text-xs text-gray-400 text-center mt-2">
            Data bisnis Anda diproses oleh AI untuk memberikan analisis. Dodolan AI dapat membuat kesalahan, jadi periksa kembali responsnya.
          </p>
        </form>
      </div>
    </>
  );
}
