import { cookies } from "next/headers"
import { redirect } from "next/navigation"

type KickoffLayoutProps = {
	params: { code: string }
	children: React.ReactNode
}

const KickoffLayout = ({ children, params }: KickoffLayoutProps) => {
	const cookiesStore = cookies()
	const user = cookiesStore.get("wworkshop-user")?.value
	if (!user) {
		const urlParams = new URLSearchParams(params)
		redirect("/kickoff/register?" + urlParams.toString())
	}

	return <div className="dynamic-screen bg-white text-black">{children}</div>
}

export default KickoffLayout
