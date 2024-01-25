import type { Metadata } from "next"
import Local from "next/font/local"
import { cx } from "class-variance-authority"
import { Toaster } from "sonner"
import "./globals.css"

// TODO: why
declare module "valtio" {
	function useSnapshot<T extends object>(p: T): T
}

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
		<html lang="en" className="h-full">
			<head />

			<body
				className={cx(
					"h-full font-normal antialiased leading-copy font-sans",
					FontSans.variable,
					FontHeading.variable,
				)}
			>
				<div vaul-drawer-wrapper="" className="min-h-svh bg-white">
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
