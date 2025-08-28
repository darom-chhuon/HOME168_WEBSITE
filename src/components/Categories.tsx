"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Menu } from "lucide-react";

interface Category {
  id: number;
  name: string;
  childes: Category[];
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const fetchCategory = async () => {
    const baseUrl = process.env.API_ENDPOINT;
    const apiPrefix = process.env.apiPreFix;
    const storeId = process.env.storeId;
    try {
      const response = await axios.get(`${baseUrl}/${apiPrefix}/categories?store_id=${storeId}`);
      console.log("Response", response.data);
      setCategories(response.data);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);
  return (
    <div className="bg-gray-100 border-b shadow-sm">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile menu button */}
        <div className="flex items-center justify-between py-4 lg:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-gray-700 hover:text-sky-600"
            aria-label="Toggle menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Desktop menu */}
        <div className="hidden lg:flex items-center space-x-8 py-4 text-gray-700 font-medium">
          {categories.map((category) => (
            <div key={category.id} className="relative group">
              <button className="hover:text-sky-600 flex items-center gap-1">
                <Link href={`/collections/${category.id}`}>{category.name}</Link>
                {category.childes?.length > 0 && <span>▾</span>}
              </button>
              {category.childes?.length > 0 && (
                <div className="absolute left-0 top-full mt-2 w-56 bg-white border rounded-lg shadow-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 z-50">
                  <ul className="py-2">
                    {category.childes.map((child) => (
                      <li
                        key={child.id}
                        className="px-4 py-2 hover:bg-sky-50 hover:text-sky-600 cursor-pointer"
                      >
                        <Link href={`/collections/${child.id}`}>{child.name}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden pb-4">
            {categories.map((category) => (
              <div key={category.id} className="py-2">
                <Link
                  href={`/collections/${category.id}`}
                  className="block text-gray-700 hover:text-sky-600 font-medium py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {category.name}
                </Link>
                {category.childes?.length > 0 && (
                  <ul className="pl-4 mt-2 space-y-2">
                    {category.childes.map((child) => (
                      <li key={child.id}>
                        <Link
                          href={`/collections/${child.id}`}
                          className="block text-gray-600 hover:text-sky-600 py-1"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {child.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </nav>
    </div>
  );
}