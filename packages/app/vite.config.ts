import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import tsconfigPaths from "vite-tsconfig-paths"
import { cloudflare } from "@cloudflare/vite-plugin"
import tailwindcss from "@tailwindcss/vite"
import { TanStackRouterVite as tanStackRouter } from "@tanstack/router-plugin/vite"

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		tsconfigPaths(),
		tailwindcss(),
		react(),
		tanStackRouter({ autoCodeSplitting: true, target: "react" }),
		cloudflare(),
	],
})
