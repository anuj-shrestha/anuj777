/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  // If deploying to anuj-shrestha.github.io/anuj777, uncomment:
  // basePath: "/anuj777",
};

export default nextConfig;
