import type { Viewport } from "next"
import { DarkLayout } from "@/components/dark-layout"
import { UnworkshopTitle } from "@/components/UnworkshopTitle"
import { text } from "@/styles/text"
import { CodeForm } from "./CodeForm"

export default function Home() {
	return (
		<DarkLayout>
			<UnworkshopTitle className="mx-auto w-[15.625rem]" />

			<div className="space-y-4 px-4 pt-8 pb-10 text-center">
				<h1
					className={text({ style: "heading", size: 24, class: "text-center" })}
				>
					Enter your group code
				</h1>

				<CodeForm />
			</div>
		</DarkLayout>
	)
}

export const viewport: Viewport = {
	colorScheme: "dark",
	themeColor: "#000",
}
