"use client";
import React from "react";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Categories from "../Categories";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
  interface storeDetail {
    id: number;
    name: string;
    logo: string;
    phone: number;
  }

  const [storeProfile, setStoreProfile] = useState<storeDetail | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  const fetchStoreProfile = async () => {
    const baseUrl = process.env.API_ENDPOINT;
    const apiPreFix = process.env.apiPreFix;
    const storeId = process.env.storeId;
    
    try {
      const response = await axios.get(`${baseUrl}/${apiPreFix}/stores/details/${storeId}`, {
        headers: {
          zoneId: '[1]',
        }
      });
      console.log("storeDetails", response.data);
      setStoreProfile(response.data);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    fetchStoreProfile();
  }, []);

  // Handle search submission
  const handleSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      // Redirect to search results page with query as parameter
      router.push(`/search?name=${encodeURIComponent(searchQuery.trim())}`);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery, router]);

  // Handle real-time search (optional - if you want instant results)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Function to construct the full image URL
  const getLogoUrl = (logoPath: string | undefined) => {
    if (!logoPath) return "/logo.png";
    if (logoPath.startsWith('http')) {
      return logoPath;
    }
    return `${process.env.store_dic}/${logoPath}`;
  };

  return (
    <div>
      <header className="bg-blue-500 text-white p-2 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <img width={45} src={getLogoUrl(storeProfile?.logo)} alt="No Image" />
             <span className="font-bold">{storeProfile?.name}</span>
          </Link>
        </div>
        
        {/* Search Bar Section */}
        <form onSubmit={handleSearch} className="relative w-full max-w-lg mx-auto">
          <div className="flex items-center bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
            <input
              type="text"
              placeholder="ស្វែងរក..."
              value={searchQuery}
              onChange={handleInputChange}
              className="w-full py-3 px-5 text-gray-800 focus:outline-none"
              disabled={isSearching}
            />
            <button 
              type="submit"
              disabled={isSearching || !searchQuery.trim()}
              className="bg-gray-300 from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3 px-6 flex items-center space-x-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{isSearching ? "Searching..." : "Search"}</span>
            </button>
          </div>
        </form>

        {/* Right Section (Khmer Text and Contact) */}
        <div className="flex items-center space-x-4">
          <span className="text-sm">
            ទំនាក់ទំនងផ្នែកលក់
          </span>
          <span className="text-sm">
          Call: {storeProfile?.phone}</span>     
        </div>
      </header>

      <Categories />
    </div>
  );
}