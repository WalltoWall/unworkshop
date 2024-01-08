import "./globals.css"

export const dynamic = "force-static"

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	)
}

export default AdminLayout