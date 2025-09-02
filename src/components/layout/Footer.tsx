"use client";
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-lg font-semibold">Modern Home 168</p>
            <p className="text-sm text-gray-400">©2025 All rights reserved</p>
          </div>
          <div className="flex space-x-6">
            <a 
              href="/privacy" 
              className="text-gray-300 hover:text-white transition-colors duration-300"
            >
              Privacy Policy
            </a>
            <a 
              href="/terms" 
              className="text-gray-300 hover:text-white transition-colors duration-300"
            >
              Terms of Service
            </a>
            <a 
              href="/contact" 
              className="text-gray-300 hover:text-white transition-colors duration-300"
            >
              Contact Us
            </a>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-gray-300 hover:text-white transition-colors duration-300"
              >
              <img className="w-5" src="/social/telegram.png" alt="No+Telegram" />
              </a>
              <a 
                href="#" 
                className="text-gray-300 hover:text-white transition-colors duration-300"
              >
                <img className="w-5" src="/social/facebook.png" alt="No+Facebook" />
              </a>
              <a 
                href="#" 
                className="text-gray-300 hover:text-white transition-colors duration-300"
              >
               <img className="w-5" src="/social/chat.png" alt="NO+Messager" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}