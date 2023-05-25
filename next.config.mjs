/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		formats: ["image/avif", "image/webp"],
		remotePatterns: [
			{
				hostname: "cdn.sanity.io",
			},
		],
	},
	experimental: {
		serverActions: true,
	},
}

export default nextConfig
