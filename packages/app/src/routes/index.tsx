import { CodeForm } from "@/app/(site)/code-form"
import { DarkLayout } from "@/components/dark-layout"
import { UnworkshopTitle } from "@/components/unworkshop-title"
import { text } from "@/styles/text"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
	component: Index,
	head: () => ({
		meta: [
			{ name: "description", content: "Look in. Stand out." },
			{ title: "UnWorkshop" },
		],
	}),
})

function Index() {
	return (
		<DarkLayout>
			<UnworkshopTitle className="mx-auto w-[15.625rem]" />

			<div className="space-y-4 px-4 pt-8 pb-10 text-center">
				<h1
					className={text({ style: "heading", size: 24, class: "text-center" })}
				>
					Enter your group code
				</h1>

				<CodeForm type="kickoff" />
			</div>
		</DarkLayout>
	)
}
