import { cloudflare } from "@cloudflare/vite-plugin"
import tailwindcss from "@tailwindcss/vite"
import { tanstackRouter } from "@tanstack/router-plugin/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		tsconfigPaths(),
		tailwindcss(),
		tanstackRouter({
			autoCodeSplitting: false,
			target: "react",
			generatedRouteTree: "./src/route-tree.gen.ts",
			quoteStyle: "double",
			semicolons: false,
		}),
		react(),
		cloudflare(),
	],
})
