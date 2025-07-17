import { ArrowPathIcon } from "@heroicons/react/24/outline"
import { createFileRoute } from "@tanstack/react-router"
import { z } from "zod"
import { Auth } from "@/auth"
import { text } from "@/styles/text"

export const Route = createFileRoute("/callback")({
	component: RouteComponent,
	validateSearch: z.object({ code: z.string() }),
	beforeLoad: ({ search }) => Auth.handleCallback(search.code),
})

function RouteComponent() {
	return (
		<div className="flex h-svh flex-col items-center justify-center gap-3 bg-background p-6 md:p-10 bg-white">
			<ArrowPathIcon className="animate-spin size-8" />
			<h1 className={text({ style: "heading", size: 24 })}>Logging in...</h1>
		</div>
	)
}
