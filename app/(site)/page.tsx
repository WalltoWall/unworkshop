import type { Viewport } from "next"
import { DarkLayout } from "@/components/DarkLayout"
import { Text } from "@/components/Text"
import { UnworkshopTitle } from "@/components/UnworkshopTitle"
import { CodeForm } from "./CodeForm"

const Home = () => {
	return (
		<DarkLayout>
			<div className="mx-auto">
				<UnworkshopTitle className="w-[15.625rem]" />
			</div>

			<div className="space-y-4 px-4 pb-10 pt-8 text-center">
				<Text style="heading" size={24}>
					Enter your group code
				</Text>

				<CodeForm />
			</div>
		</DarkLayout>
	)
}

export const viewport: Viewport = {
	colorScheme: "dark",
	themeColor: "#000",
}

export default Home
