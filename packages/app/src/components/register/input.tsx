import { ArrowRightCircleIcon } from "@heroicons/react/20/solid"
import { cx } from "class-variance-authority"

export const RegisterInput = (props: { className?: string }) => {
	return (
		<div
			className={cx(
				props.className,
				"relative flex w-full items-center rounded-md bg-black/10 outline-offset-2 focus-within:outline-2",
			)}
		>
			<input
				type="text"
				placeholder="Add your first & last name here"
				className="h-12 w-full bg-transparent px-3 leading-none outline-none placeholder:text-black/60"
				name="name"
				autoCorrect="off"
				autoComplete="off"
				autoCapitalize="off"
				spellCheck={false}
				required
			/>

			<button className="hover:text-green-40 shrink-0 px-3 py-1 transition">
				<span className="sr-only">Confirm registration</span>
				<ArrowRightCircleIcon className="size-5" />
			</button>
		</div>
	)
}
