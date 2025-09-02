'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import ReactPixel from 'react-facebook-pixel';

const PixelTracker = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Initialize Pixel
    const pixelId = "1286414552944002";
    if (pixelId) {
      ReactPixel.init(pixelId, {}, { autoConfig: true, debug: true }); // debug: true for console logs
      ReactPixel.pageView(); // Track initial page view
    } else {
      console.error('Facebook Pixel ID is not defined');
    }

    // Track page views on route changes
    const handleRouteChange = () => {
      ReactPixel.pageView();
    };
    handleRouteChange();
  }, [pathname, searchParams]);

  return null;
};

export default PixelTracker;