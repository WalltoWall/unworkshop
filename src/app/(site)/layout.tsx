import "./globals.css"
import type { Metadata } from "next"
import Local from "next/font/local"
import { NuqsAdapter } from "nuqs/adapters/next/app"
import { cx } from "class-variance-authority"
import { env } from "@/env"
import { Toaster } from "./toaster"

const FontSans = Local({
	src: "../../assets/fonts/regular.woff2",
	display: "swap",
	variable: "--sans",
	weight: "400",
	fallback: ["system-ui"],
	style: "normal",
})

const FontHeading = Local({
	src: "../../assets/fonts/compressed.woff2",
	display: "swap",
	variable: "--heading",
	weight: "800",
	fallback: ["system-ui"],
	style: "normal",
})

const FontSerif = Local({
	src: "../../assets/fonts/serif.woff2",
	display: "swap",
	variable: "--serif",
	fallback: ["serif"],
	style: "normal",
})

type RootLayoutProps = {
	children: React.ReactNode
}

const RootLayout = ({ children }: RootLayoutProps) => {
	return (
		<html lang="en">
			<head />

			<body
				className={cx(
					"antialiased",
					FontSans.variable,
					FontHeading.variable,
					FontSerif.variable,
				)}
			>
				<NuqsAdapter>
					{children}
					<Toaster />
				</NuqsAdapter>
			</body>
		</html>
	)
}

export const metadata: Metadata = {
	metadataBase: new URL(env.NEXT_PUBLIC_ROOT_URL),
	title: {
		template: "%s | UnWorkshop",
		default: "UnWorkshop",
	},
	description: "Look in. Stand out.",
}

export default RootLayout
