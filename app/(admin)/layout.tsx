import type { Metadata } from "next"
import "./globals.css"

export const dynamic = "force-static"

/**
 * Temporary workaround for setting metadata for the Studio. Implemented
 * necessary data according to the following source code:
 *
 * https://github.com/sanity-io/next-sanity/blob/main/src/studio/head/NextStudioHead.tsx
 *
 * @todo Remove this workaround when the issue is fixed
 * @see https://github.com/sanity-io/next-sanity/issues/333
 */
export const metadata: Metadata = {
	title: "Admin | Workshop",
	viewport: "width=device-width,initial-scale=1,viewport-fit=cover",
	robots: "noindex",
}

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	)
}

export default AdminLayout
