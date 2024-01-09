import type { Metadata } from "next"
import Local from "next/font/local"
import { cx } from "class-variance-authority"
import { Toaster } from "sonner"
import "./globals.css"

const FontSans = Local({
	src: "../../assets/fonts/regular.woff2",
	display: "swap",
	variable: "--sans",
	weight: "400",
	style: "normal",
})

const FontHeading = Local({
	src: "../../assets/fonts/compressed.woff2",
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
				{children}

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
