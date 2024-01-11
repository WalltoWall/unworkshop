import type { Metadata } from "next"
import Local from "next/font/local"
import { cx } from "class-variance-authority"
import { Toaster } from "sonner"
import "./globals.css"
import Multiplayer from "@/components/Multiplayer"

const FontSans = Local({
	src: "../../assets/fonts/regular.woff2",
	display: "swap",
	variable: "--sans",
	weight: "400",
	style: "normal",
})

const FontHeading = Local({
	src: "../../assets/fonts/condensed.woff2",
	display: "swap",
	variable: "--heading",
	weight: "700",
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
					"font-normal antialiased leading-copy font-sans",
					FontSans.variable,
					FontHeading.variable,
				)}
			>
				<Multiplayer />

				<div vaul-drawer-wrapper="" className="min-h-[100vh] bg-white">
					{children}
				</div>

				<Toaster />
			</body>
		</html>
	)
}

export const metadata: Metadata = {
	title: "W|W Workshop",
	description: "Lorem ipsum sit dolor",
}

export default RootLayout
