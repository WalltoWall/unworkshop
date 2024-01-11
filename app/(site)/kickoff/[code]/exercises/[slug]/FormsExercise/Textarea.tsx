import clsx from "clsx"

export const textareaStyles =
	"min-h-32 w-full rounded-lg border border-gray-90 px-4 py-2.5 text-14 leading-copyMega"

export const Textarea = ({
	className,
	...props
}: React.ComponentPropsWithoutRef<"textarea">) => {
	return (
		<textarea
			className={clsx(className, textareaStyles, "resize-y")}
			{...props}
		/>
	)
}
