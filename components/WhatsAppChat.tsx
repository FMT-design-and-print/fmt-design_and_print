"use client";

import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaWhatsapp } from "react-icons/fa";
import { whatsappNumber } from "@/constants";

interface WhatsAppChatProps {
  phoneNumber?: string;
  defaultMessage?: string;
  teamName?: string;
}

const WhatsAppChat: React.FC<WhatsAppChatProps> = ({
  phoneNumber = whatsappNumber, // Default phone number for FMT Design and Print
  defaultMessage = "Hi! I'd like to inquire about your services 👋",
  teamName = "FMT Design and Print",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Remove any non-numeric characters from the phone number
    const cleanPhoneNumber = phoneNumber.replace(/\D/g, "");
    const encodedMessage = encodeURIComponent(
      defaultMessage + "\n\n" + message
    );
    const whatsappUrl = `https://wa.me/${cleanPhoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[300px] rounded-lg bg-white shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between bg-[#075E54] p-4 rounded-t-lg">
            <div className="text-white">
              <FaWhatsapp className="inline-block mr-2 text-xl" />
              Chat with us on WhatsApp!
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 bg-transparent border-none"
            >
              <IoClose size={24} />
            </button>
          </div>

          {/* Message Box */}
          <div className="p-4 bg-[#DCF8C6] space-y-2">
            <div className="bg-white rounded-lg p-3 inline-block max-w-[90%] shadow-sm">
              <p>{defaultMessage}</p>
              <p className="text-sm text-gray-500 mt-1">{teamName}</p>
            </div>
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="p-4 bg-gray-50 rounded-b-lg">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type message here"
                className="flex-1 px-3 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="submit"
                className="bg-[#25D366] text-white p-2 rounded-full hover:bg-[#1ea952] transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                  />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* WhatsApp Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:bg-[#1ea952] transition-colors"
        >
          <FaWhatsapp size={24} />
        </button>
      )}
    </div>
  );
};

export default WhatsAppChat;
