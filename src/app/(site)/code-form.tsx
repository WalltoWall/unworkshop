"use client"

import { ChevronRightIcon } from "lucide-react"
import React from "react"
import { useRouter } from "next/navigation"
import clsx from "clsx"
import {
	OTPInput,
	REGEXP_ONLY_DIGITS_AND_CHARS,
	type SlotProps,
} from "input-otp"
import { toast } from "sonner"
import { z } from "zod"

const Slot = (props: SlotProps) => {
	return (
		<div
			className={clsx(
				"relative flex h-[4.5rem] w-10 items-center justify-center rounded-lg border border-emerald-600",
				props.char &&
					"bg-brand font-heading text-[48px] font-extrabold text-black uppercase",
			)}
		>
			{props.char !== null && <div>{props.char}</div>}
			{props.hasFakeCaret && <FakeCaret />}
		</div>
	)
}

const FakeCaret = () => {
	return (
		<div className="animate-caret-blink pointer-events-none absolute inset-0 flex items-center justify-center">
			<div className="bg-brand h-8 w-px" />
		</div>
	)
}

const FakeDash = () => {
	return (
		<div className="flex w-10 items-center justify-center">
			<div className="h-1 w-3 rounded-full bg-white" />
		</div>
	)
}

const CodeInput = () => {
	const [showSubmit, setShowSubmit] = React.useState(false)

	return (
		<div className="relative">
			<OTPInput
				maxLength={7}
				required
				autoFocus
				name="code"
				spellCheck={false}
				inputMode="text"
				pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
				containerClassName="group flex items-center"
				className="text-16"
				onChange={(value) => setShowSubmit(value.length === 7)}
				render={({ slots }) => (
					<>
						<div className="flex gap-1">
							{slots.slice(0, 3).map((slot, idx) => (
								<Slot key={idx} {...slot} />
							))}
						</div>

						<FakeDash />

						<div className="flex gap-1">
							{slots.slice(3).map((slot, idx) => (
								<Slot key={idx} {...slot} />
							))}
						</div>
					</>
				)}
			/>
			{showSubmit && (
				<button
					className="bg-brand absolute -right-5 -bottom-5 flex h-8 w-8 items-center justify-center rounded-full border-[3px] border-black"
					type="submit"
				>
					<ChevronRightIcon className="size-4 text-black" strokeWidth={3} />
				</button>
			)}
		</div>
	)
}

const CodeSchema = z
	.string()
	.length(7, "Code must be 7 characters in length.")
	.transform((val) => {
		const code = val.toLowerCase()

		return code.slice(0, 3) + "-" + code.slice(3)
	})

export const CodeForm = () => {
	const router = useRouter()

	function action(data: FormData) {
		const res = CodeSchema.safeParse(data.get("code"))
		if (!res.success) {
			toast.error("Invalid code.")
			return
		}

		router.push(`/kickoff/${res.data}`)
	}

	return (
		<form action={action}>
			<CodeInput />
		</form>
	)
}
