import { Loader2Icon } from "lucide-react"

export const Loader = () => (
	<div className="h-full flex flex-col items-center justify-center gap-2">
		<Loader2Icon className="size-8 animate-spin text-black" />
	</div>
)
