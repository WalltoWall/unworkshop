import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	reactStrictMode: false,
	logging: { fetches: { fullUrl: true } },
	serverExternalPackages: ["yjs"],
	images: {
		formats: ["image/webp"],
		remotePatterns: [{ hostname: "cdn.sanity.io" }],
	},
}

export default nextConfig
