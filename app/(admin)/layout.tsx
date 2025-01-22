import "./globals.css"

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<html lang="en">
			<head />
			<body>{children}</body>
		</html>
	)
}

export const dynamic = "force-static"

export default AdminLayout

