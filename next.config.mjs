/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['res.cloudinary.com'],  // อนุญาตให้ใช้ Cloudinary
  },
};

export default nextConfig;
