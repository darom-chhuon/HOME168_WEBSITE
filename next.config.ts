import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  /* config options here http://127.0.0.1:3000/ */
  env:{
    API_ENDPOINT : process.env.API_ENDPOINT,
    apiPreFix    : process.env.API_PREFIX,
    storeId      : process.env.STORE_ID,
    product_dic  : process.env.PRODUCT_DIC,
    store_dic  : process.env.STORE_DIC,
    facebookId  : process.env.FACEBOOK_PIXEL_ID,
    category_dic : process.env.CATEGORY_ID,
    messageProfileId: process.env.messageProfileId,
  },
  server: {
    host: 'http://127.0.0.1:3000', // Listen on all network interfaces
  },
};

export default nextConfig;
