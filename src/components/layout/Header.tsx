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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
    <div className="w-full">
      <header className="bg-blue-500 text-white p-2 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Top section with logo and mobile menu */}
        <div className="w-full flex items-center justify-between md:w-auto">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <img width={45} src={getLogoUrl(storeProfile?.logo)} alt="No Image" className="w-10 h-10 md:w-12 md:h-12" />
              <span className="font-bold text-sm md:text-base ml-2">{storeProfile?.name}</span>
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 rounded-md hover:bg-blue-600 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        
        {/* Search Bar Section - visible on all screens but layout changes */}
        <form onSubmit={handleSearch} className="w-full md:max-w-lg order-3 md:order-2 mt-3 md:mt-0">
          <div className="flex items-center bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
            <input
              type="text"
              placeholder="ស្វែងរក..."
              value={searchQuery}
              onChange={handleInputChange}
              className="w-full py-2 px-4 md:py-3 md:px-5 text-gray-800 focus:outline-none text-sm md:text-base"
              disabled={isSearching}
            />
            <button 
              type="submit"
              disabled={isSearching || !searchQuery.trim()}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 md:py-3 md:px-6 flex items-center space-x-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base whitespace-nowrap"
            >
              <span>{isSearching ? "..." : "Search"}</span>
            </button>
          </div>
        </form>

        {/* Right Section (Khmer Text and Contact) - hidden on mobile when menu is closed */}
        <div className={`${isMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4 order-2 md:order-3 w-full md:w-auto text-right md:text-left py-2 md:py-0`}>
          <span className="text-sm w-full md:w-auto">
            ទំនាក់ទំនងផ្នែកលក់
          </span>
          <span className="text-sm w-full md:w-auto">
            Call: {storeProfile?.phone}
          </span>     
        </div>
      </header>

      <Categories />
    </div>
  );
}