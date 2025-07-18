import { createFileRoute } from "@tanstack/react-router"
import { CodeForm } from "@/components/code-form"
import { DarkLayout } from "@/components/dark-layout"
import { UnworkshopTitle } from "@/components/unworkshop-title"
import { text } from "@/styles/text"

export const Route = createFileRoute("/_authenticated/presenter")({
	component: RouteComponent,
	head: () => ({
		meta: [
			{ name: "color-scheme", content: "dark" },
			{ name: "theme-color", content: "#000" },
		],
	}),
})

// TODO: Making this just a list of all of the kickoffs.
function RouteComponent() {
	return (
		<DarkLayout>
			<UnworkshopTitle className="mx-auto w-[15.625rem]" />

			<div className="space-y-4 px-4 pt-8 pb-10 text-center">
				<h1
					className={text({ style: "heading", size: 24, class: "text-center" })}
				>
					Presenter
				</h1>

				<CodeForm type="presenter" />
			</div>
		</DarkLayout>
	)
}
