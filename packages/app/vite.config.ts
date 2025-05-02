import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tsconfigPaths from "vite-tsconfig-paths"
import { cloudflare } from "@cloudflare/vite-plugin"
import tailwindcss from "@tailwindcss/vite"
import { TanStackRouterVite as tanStackRouter } from "@tanstack/router-plugin/vite"

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		tsconfigPaths(),
		tailwindcss(),
		tanStackRouter({ autoCodeSplitting: false, target: "react" }),
		react({
			babel: {
				plugins: [["babel-plugin-react-compiler"]],
			},
		}),
		cloudflare(),
	],
})
