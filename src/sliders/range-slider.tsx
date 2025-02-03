import React from "react"
import type { PortableTextProps } from "next-sanity"
import { cx } from "class-variance-authority"
import { toast } from "sonner"
import { PortableText } from "@/components/portable-text"
import styles from "./range-slider.module.css"

const RangeInput = ({
	className,
	onChange,
	onClick,
	...props
}: React.ComponentProps<"input">) => {
	const wrappedOnClick: React.MouseEventHandler<HTMLInputElement> = (e) => {
		onClick?.(e)

		if (props.readOnly) {
			toast.warning("Only the captain can make changes.")
		}
	}

	const wrappedOnChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
		if (props.readOnly) return

		onChange?.(e)
	}

	return (
		<div
			className={cx("relative h-3 rounded-[10px] bg-neutral-300", className)}
		>
			<div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between px-1">
				<div className="size-1.5 rounded-full bg-neutral-500" />
				<div className="size-1.5 rounded-full bg-neutral-500" />
				<div className="size-1.5 rounded-full bg-neutral-500" />
				<div className="size-1.5 rounded-full bg-neutral-500" />
				<div className="size-1.5 rounded-full bg-neutral-500" />
				<div className="size-1.5 rounded-full bg-neutral-500" />
			</div>

			<input
				type="range"
				min={1}
				max={6}
				className={cx(
					styles.input,
					"absolute inset-0 h-full w-full appearance-none transition [&::-webkit-slider-thumb]:shadow-md",
				)}
				onChange={wrappedOnChange}
				onClick={wrappedOnClick}
				{...props}
			/>
		</div>
	)
}

type Props = {
	left: string
	right: string
	readOnly?: boolean
	className?: string
	prompt: PortableTextProps["value"]
	value?: number
	name: string
	onChange?: React.ChangeEventHandler<HTMLInputElement>
}

export const RangeSlider = (props: Props) => {
	return (
		<div className={cx("rounded-lg bg-neutral-100 p-4", props.className)}>
			<PortableText value={props.prompt} />
			<RangeInput
				className="mt-8"
				value={props.value}
				onChange={props.onChange}
				name={props.name}
				readOnly={props.readOnly}
			/>

			<div className="mt-3 flex justify-between text-neutral-600">
				<p>{props.left}</p>
				<p>{props.right}</p>
			</div>
		</div>
	)
}
