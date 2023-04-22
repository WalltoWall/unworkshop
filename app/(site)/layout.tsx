import type { Metadata } from "next"
import Local from "next/font/local"
import { cx } from "class-variance-authority"
import "./globals.css"

const TradeGothic = Local({
	src: "../../assets/fonts/trade-gothic-regular.woff2",
	display: "swap",
	variable: "--font-trade-gothic",
	weight: "400",
	style: "normal",
})

const TradeGothicBldCnd = Local({
	src: "../../assets/fonts/trade-gothic-bold-condensed.woff2",
	display: "swap",
	variable: "--font-trade-gothic-bold-condensed",
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
					"font-sans font-normal leading-copy",
					TradeGothic.variable,
					TradeGothicBldCnd.variable,
				)}
			>
				{children}
			</body>
		</html>
	)
}

export const metadata: Metadata = {
	title: "W|W Workshop",
	description: "Lorem ipsum sit dolor",
}

export default RootLayout
