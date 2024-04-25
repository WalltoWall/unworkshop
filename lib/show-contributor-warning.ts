import { toast } from "sonner"

export function showContributorWarning() {
	toast.warning("Contributors can't edit directly.", {
		description: "Your team captain can edit responses.",
		className: "items-start",
	})
}
