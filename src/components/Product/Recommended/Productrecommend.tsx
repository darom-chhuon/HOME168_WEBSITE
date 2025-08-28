"use client";
import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
export default function Productrecommend() {
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

  const fetchProduct = async () => {
    const baseUrl = "http://127.0.0.1:8000" || process.env.API_ENDPOINT;
    const apiPrefix = process.env.apiPreFix;
    try {
      setLoading(true);
      const response = await axios.get(
        `${baseUrl}/${apiPrefix}/items/recommended`,
        {
          headers: {
            moduleId: 1,
            zoneId: "[1]"
          },
        }
      );
      setProducts(response.data.items);
      console.log("Responding", response.data.items);
    } catch (error) {
      console.log("error", error);
      setError("Failed to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  // Generate proper image URL for local product images
  const generateImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) {
      // Return a placeholder if no image path is provided
      return "https://via.placeholder.com/300x300/6B7280/FFFFFF?text=No+Image";
    }
    
    // Check if the path is already a full URL
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // Remove any leading slashes or unwanted characters
    const cleanPath = imagePath.replace(/^\/+/, '');
    const productDic = process.env.product_dic;
    // Construct the full URL for local product images
    return `${productDic}/${cleanPath}`;
  };

  // Calculate discounted price
  const calculateDiscount = (price: number, discount: number, discountType: string) => {
    if (discountType === "percent") {
      return price - (price * discount) / 100;
    } else if (discountType === "amount") {
      return price - discount;
    }
    return price;
  };

  // Format currency
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
          <h1 className="text-3xl font-bold text-center mb-12 text-gray-800">ទិញភ្លាមបានភ្លាម</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={fetchProduct}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
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
        <h1 className="text-3xl font-bold text-center mb-12 text-gray-800">ម៉ូតដែលភ្ញៀវភាគច្រើនពេញចិត្ត</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => {
            const discountedPrice = calculateDiscount(product.price, product.discount, product.discount_type);
            const hasDiscount = product.discount > 0;
            
            return (
       
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
              <Link href={`/products/${product.id}`}>
              <div className="relative">
                  <img 
                    src={generateImageUrl(product.image)} 
                    alt={product.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      // Fallback to placeholder if image fails to load
                      e.currentTarget.src = "https://via.placeholder.com/300x300/6B7280/FFFFFF?text=No+Image";
                    }}
                  />
                  {hasDiscount && (
                    <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                      {product.discount_type === "percent" 
                        ? `${product.discount}% OFF` 
                        : `$${product.discount} OFF`}
                    </span>
                  )}
                  {/* <button className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button> */}
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">{product.name}</h3>                  
                  <div className="flex items-center justify-between">
                    <div>
                      {hasDiscount ? (
                        <div className="flex items-center">
                          <span className="text-lg font-bold text-gray-800">{formatCurrency(discountedPrice)}</span>
                          <span className="text-sm text-gray-500 line-through ml-2">{formatCurrency(product.price)}</span>
                        </div>
                      ) : (
                        <span className="text-lg font-bold text-gray-800">{formatCurrency(product.price)}</span>
                      )}
                    </div>
                    
                   
                  </div>
                </div>
              </Link>
              </div>
      
            );
          })}
        </div>
      </div>
      
      <style jsx global>{`
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}