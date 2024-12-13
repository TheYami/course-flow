/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com'],  // อนุญาตให้ใช้ Cloudinary
  },
};

export default nextConfig;
