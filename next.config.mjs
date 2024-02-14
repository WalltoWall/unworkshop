/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	logging: { fetches: { fullUrl: true } },
	typescript: { ignoreBuildErrors: true },
	eslint: { ignoreDuringBuilds: true },
	images: {
		formats: ["image/webp"],
		remotePatterns: [{ hostname: "cdn.sanity.io" }],
	},
}

export default nextConfig
