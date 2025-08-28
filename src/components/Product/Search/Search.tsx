"use client";
import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function Search() {
  interface Product {
    id: number;
    name: string;
    price: number;
    discount: number;
    discount_type: string;
    image?: string;
  }
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const name = searchParams.get('name');
  
  const fetchProduct = async () => {
    const baseUrl = process.env.API_ENDPOINT;
    const apiPrefix = process.env.apiPreFix;
    
    try {
      setLoading(true);
      setError(null);
      
      if (!name || name.trim() === '') {
        setProducts([]);
        return;
      }

      const response = await axios.get(
        `${baseUrl}/${apiPrefix}/items/search?name=${encodeURIComponent(name)}`,
        {
          headers: {
            moduleId: 1,
            zoneId: "[1]"
          },
        }
      );
      
      setProducts(response.data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [name]);

  const generateImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) {
      return "https://via.placeholder.com/300x300/6B7280/FFFFFF?text=No+Image";
    }
    
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    const cleanPath = imagePath.replace(/^\/+/, '');
    const productDic = process.env.product_dic;
    return `${productDic}/${cleanPath}`;
  };

  const calculateDiscount = (price: number, discount: number, discountType: string) => {
    if (discountType === "percent") {
      return price - (price * discount) / 100;
    } else if (discountType === "amount") {
      return price - discount;
    }
    return price;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Searching for "{name}"
            </h1>
            <p className="text-gray-600">Please wait while we find your products...</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-5 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={fetchProduct}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {products.length > 0 ? `Search Results for "${name}"` : `No Results for "${name}"`}
          </h1>
          <p className="text-gray-600 text-lg">
            {products.length > 0 
              ? `Found ${products.length} product${products.length !== 1 ? 's' : ''} matching your search`
              : "We couldn't find any products matching your search term. Try different keywords or browse our categories."
            }
          </p>
        </div>

        {products.length === 0 && !loading && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-16 h-16 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Search Tips</h3>
              <ul className="text-left text-gray-600 space-y-2">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Check your spelling
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Use more general terms
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Try different keywords
                </li>
              </ul>
            </div>

            <Link 
              href="/"
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>
        )}

        {/* Products Grid */}
        {products.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => {
              const discountedPrice = calculateDiscount(product.price, product.discount, product.discount_type);
              const hasDiscount = product.discount > 0;
              
              return (
                <div key={product.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition duration-300 group">
                  <Link href={`/products/${product.id}`}>
                    <div className="relative">
                      <img 
                        src={generateImageUrl(product.image)} 
                        alt={product.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
                        onError={(e) => {
                          e.currentTarget.src = "https://via.placeholder.com/300x300/6B7280/FFFFFF?text=No+Image";
                        }}
                      />
                      {hasDiscount && (
                        <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                          {product.discount_type === "percent" 
                            ? `${product.discount}% OFF` 
                            : `$${product.discount} OFF`}
                        </span>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 h-12">
                        {product.name}
                      </h3>                  
                      
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          {hasDiscount ? (
                            <>
                              <span className="text-lg font-bold text-gray-800">
                                {formatCurrency(discountedPrice)}
                              </span>
                              <span className="text-sm text-gray-500 line-through">
                                {formatCurrency(product.price)}
                              </span>
                            </>
                          ) : (
                            <span className="text-lg font-bold text-gray-800">
                              {formatCurrency(product.price)}
                            </span>
                          )}
                        </div>
                      
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}