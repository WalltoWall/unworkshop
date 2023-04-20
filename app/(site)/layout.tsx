import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
	title: "W|W Workshop",
	description: "Lorem ipsum sit dolor",
}

type RootLayoutProps = {
	children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
	return (
		<html lang="en">
			<head>
				<link rel="stylesheet" href="https://use.typekit.net/txr1eez.css" />
			</head>

			<body className="font-sans leading-normal font-normal">
				<main id="main">{children}</main>
			</body>
		</html>
	)
}
