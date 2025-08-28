"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Star, Shield, Truck, ArrowLeft, ShoppingCart, Play, Share } from "lucide-react";

export default function ProductDetail() {
  interface ChoiceOption {
    name: string;
    title: string;
    options: string[];
  }

  interface ImageObject {
    img: string;
    color: string;
    storage: string;
  }

  interface Detail {
    id: number;
    name: string;
    description: string;
    price: string;
    sku: string;
    discount: string;
    image: string;
    discount_type: string;
    video_url: string;
    images: ImageObject[];
    images_full_url: string[];
    choice_options: ChoiceOption[];
  }

  const [details, setDetailProduct] = useState<Detail | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [filteredImages, setFilteredImages] = useState<ImageObject[]>([]);
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);
  const { slug } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const fetchDetailProduct = async () => {
    const baseUrl = process.env.API_ENDPOINT;
    const apiPrefix = process.env.apiPreFix;
    try {
      const response = await axios.get(`${baseUrl}/${apiPrefix}/items/details/${slug}`, {
        headers: {
          moduleId: 1,
          zoneId: "[1]",
        }
      });
      setDetailProduct(response.data);
      
      // Initialize selected options from URL parameters or defaults
      const initialOptions: Record<string, string> = {};
      if (response.data.choice_options) {
        response.data.choice_options.forEach((option: ChoiceOption) => {
          if (option.options.length > 0) {
            // Get value from URL or use first option as default
            const urlValue = searchParams.get(option.name);
            initialOptions[option.name] = urlValue && option.options.includes(urlValue) 
              ? urlValue 
              : option.options[0];
          }
        });
      }
      setSelectedOptions(initialOptions);

      // Initialize filtered images
      if (response.data.images) {
        setFilteredImages(response.data.images);
      }
    } catch (error) {
      console.log("Error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetailProduct();
  }, []);

  // Update URL when options change
  useEffect(() => {
    if (Object.keys(selectedOptions).length > 0) {
      const params = new URLSearchParams();
      Object.entries(selectedOptions).forEach(([key, value]) => {
        params.set(key, value);
      });
      
      // Update URL without page reload
      router.replace(`?${params.toString()}`, { scroll: false });
    }
  }, [selectedOptions, router]);

  // Filter images based on selected options
  useEffect(() => {
    if (details?.images && details.choice_options) {
      let filtered = [...details.images];
      
      // Filter by color if a color option is selected
      const colorOption = details.choice_options.find(option => 
        option.title.toLowerCase().includes('color')
      );
      
      if (colorOption && selectedOptions[colorOption.name]) {
        const selectedColor = selectedOptions[colorOption.name];
        filtered = filtered.filter(img => img.color === selectedColor);
      }
      
      setFilteredImages(filtered);
      setSelectedImage(0); // Reset to first image when options change
    }
  }, [selectedOptions, details]);

  
  // Function to extract YouTube ID from URL
  const extractYoutubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  // Handle option selection
  const handleOptionSelect = (optionName: string, value: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionName]: value
    }));
  };

  // Handle share button click - copy URL to clipboard
  const handleShareClick = () => {
    const params = new URLSearchParams();
    Object.entries(selectedOptions).forEach(([key, value]) => {
      params.set(key, value);
    });
    
    const currentUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    
    navigator.clipboard.writeText(currentUrl)
      .then(() => {
        setShowCopiedMessage(true);
        setTimeout(() => setShowCopiedMessage(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy URL: ', err);
      });
  };

  // Handle Messenger button click - redirect to specific Messenger profile
  const handleMessengerClick = () => {
    // Replace with your actual Messenger profile ID
    const messengerProfileId = process.env.messageProfileId;
    
    // Create the message with product details
    const message = `I'm interested in this product: ${details?.name || "Product"}%0A%0A` +
    `Description: ${details?.description || "No description available"}%0A` +
    `Original Price: $${details?.price || "N/A"}%0A` +
    (details?.discount ? 
      (details.discount_type === 'percent' ? 
        `Discount: ${details.discount}% off%0A` + 
        `Discounted Price: $${(parseFloat(details.price) * (1 - parseFloat(details.discount) / 100)).toFixed(2)}%0A` 
        : 
        `Discount: $${details.discount} off%0A` + 
        `Discounted Price: $${(parseFloat(details.price) - parseFloat(details.discount)).toFixed(2)}%0A`
      ) 
      : ''
    ) +
    `SKU: ${details?.sku || "N/A"}%0A%0A` +
    `Product URL: ${window.location.href}`;
    
    // Open the specific Messenger profile with the pre-filled message
    window.open(`https://www.messenger.com/t/${messengerProfileId}?text=${message}`, '_blank');
  };

  // Get all gallery images including video thumbnail and product images
  const youtubeId = details?.video_url ? extractYoutubeId(details.video_url) : null;
  
  const galleryImages = [];
  if (youtubeId) {
    galleryImages.push("youtube_thumbnail");
  }
  
  // Add all product images from the filtered images array
  if (filteredImages && Array.isArray(filteredImages)) {
    filteredImages.forEach((imgObj: ImageObject) => {
      // Construct the full image URL based on your application's structure
      const baseUrl = process.env.product_dic || "https://example.com/uploads";
      galleryImages.push(`${baseUrl}/${imgObj.img}`);
    });
  }

  // If you also want to use images_full_url as a fallback
  if (galleryImages.length === 0 && details?.images_full_url && Array.isArray(details.images_full_url)) {
    details.images_full_url.forEach(img => {
      galleryImages.push(img);
    });
  }

  const discountedPrice = details?.discount && details?.discount_type
  ? details.discount_type === 'percent'
    ? (parseFloat(details.price) * (1 - parseFloat(details.discount) / 100)).toFixed(2)
    : (parseFloat(details.price) - parseFloat(details.discount)).toFixed(2)
  : details?.price;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <div className="flex items-center">
                <Link href="/" className="text-sm font-medium text-gray-500 hover:text-gray-700">
                  Home
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <Link href="#" className="text-sm font-medium text-gray-500 hover:text-gray-700">
                  Products
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-sm font-medium text-gray-900 truncate">
                  {details?.name}
                </span>
              </div>
            </li>
          </ol>
        </nav>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
                {selectedImage === 0 && youtubeId ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeId}?autoplay=0&mute=0&controls=1&rel=0&modestbranding=1`}
                    className="w-full h-full absolute top-0 left-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Product video"
                  />
                ) : (
                  <img
                    src={galleryImages[selectedImage] === "youtube_thumbnail" 
                      ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg` 
                      : galleryImages[selectedImage]}
                    alt={details?.name || "Product image"}
                    className="w-full h-full object-cover"
                  />
                )}
                
                {/* Share Button */}
                <button 
                  className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md flex items-center gap-1 hover:bg-gray-100 transition-colors"
                  onClick={handleShareClick}
                >
                  <Share className="h-4 w-4 text-gray-600" />
                </button>
                
                {/* Copied Message */}
                {showCopiedMessage && (
                  <div className="absolute top-16 right-4 bg-green-500 text-white px-3 py-1 rounded-md text-sm shadow-lg">
                    Link copied to clipboard!
                  </div>
                )}
             
              </div>
              
              <div className="grid grid-cols-4 gap-2">
                {galleryImages.map((img, index) => (
                  <div 
                    key={index} 
                    className={`h-24 cursor-pointer rounded-md overflow-hidden ${selectedImage === index ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    {img === "youtube_thumbnail" && youtubeId ? (
                      <div className="relative w-full h-full">
                        <img
                          src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`}
                          alt="YouTube thumbnail"
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                          <Play className="h-8 w-8 text-white" />
                        </div>
                      </div>
                    ) : (
                      <img
                        src={img}
                        alt={`Thumbnail ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <p className="text-3xl font-bold text-gray-900">${discountedPrice}</p>
                {details?.discount && (
  <p className="text-xl text-gray-500 line-through">${details.price}</p>
)}
{details?.discount && (
  <span className="bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded">
    {details.discount_type === 'percent' 
      ? `Save ${details.discount}%` 
      : `Save $${details.discount}`
    }
  </span>
)}
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-900">Description</h3>
                <p className="mt-2 text-gray-600">{details?.description}</p>
              </div>

              {/* Choice options */}
              {details?.choice_options && details.choice_options.length > 0 && (
                <div className="space-y-4">
                  {details.choice_options.map((option, index) => (
                    <div key={index}>
                      <h3 className="text-sm font-medium text-gray-900">{option.title}</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {option.options.map((value, optIndex) => (
                          <button
                            key={optIndex}
                            className={`px-3 py-1 text-sm rounded-md border ${
                              selectedOptions[option.name] === value
                                ? 'bg-blue-100 text-blue-800 border-blue-500'
                                : 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200'
                            }`}
                            onClick={() => handleOptionSelect(option.name, value)}
                          >
                            {value}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-sm font-medium text-gray-900">Features</h3>
                <ul className="mt-2 space-y-2">
                  <li className="flex items-center">
                    <Shield className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-gray-600">1-year warranty</span>
                  </li>
                  <li className="flex items-center">
                    <Truck className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-gray-600">Free shipping</span>
                  </li>
                </ul>
              </div>

              <div className="flex items-center space-x-4">
                <button className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md font-medium hover:bg-blue-700 flex items-center justify-center">
                  Telegram
                </button>
                <button 
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md font-medium hover:bg-blue-700 flex items-center justify-center"
                  onClick={handleMessengerClick}
                >
                  Messenger
                </button>
              </div>

              <div className="text-sm text-gray-500">
                <p>SKU: {details?.sku}</p>
                <p className="mt-1">In stock - Ready to ship</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Product Details</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Specifications</h3>
              <dl className="mt-2 divide-y divide-gray-200">
                <div className="py-2 flex justify-between">
                  <dt className="text-sm text-gray-600">Material</dt>
                  <dd className="text-sm text-gray-900">Premium quality</dd>
                </div>
                <div className="py-2 flex justify-between">
                  <dt className="text-sm text-gray-600">Dimensions</dt>
                  <dd className="text-sm text-gray-900">10 x 5 x 2 inches</dd>
                </div>
                <div className="py-2 flex justify-between">
                  <dt className="text-sm text-gray-600">Weight</dt>
                  <dd className="text-sm text-gray-900">1.5 lbs</dd>
                </div>
              </dl>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900">Shipping & Returns</h3>
              <p className="mt-2 text-sm text-gray-600">
                Free standard shipping within the continental US. 30-day money-back guarantee. 
                Return within 30 days of receipt for a full refund.
              </p>
            </div>
          </div>
        </div>
        <div  className="justify-center">
          <img src="/detail-product.png" alt="" />
          <img src="/detail-product.png" alt="" />
          <img src="/detail-product.png" alt="" />
          <img src="/detail-product.png" alt="" />
        </div>
      </div>
    </div>
  );
}