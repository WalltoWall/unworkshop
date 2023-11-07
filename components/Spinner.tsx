import { Loader2 } from "lucide-react"
import clsx from "clsx"

export const Spinner = ({
	className,
	...props
}: React.ComponentPropsWithoutRef<"svg">) => {
	return <Loader2 className={clsx(className, "animate-spin")} {...props} />
}
