import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	reactStrictMode: false,
	logging: { fetches: { fullUrl: true } },
	serverExternalPackages: ["yjs"],
	typescript: { ignoreBuildErrors: true },
	eslint: { ignoreDuringBuilds: true },
	images: {
		formats: ["image/webp"],
		remotePatterns: [{ hostname: "cdn.sanity.io" }],
	},
}

export default nextConfig
