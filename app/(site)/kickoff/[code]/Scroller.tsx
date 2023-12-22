"use client"

import { useFormStatus } from "react-dom"
import { Button } from "@/components/Button"
import { Spinner } from "@/components/Spinner"
import { Text } from "@/components/Text"

const slides = [
	<>
		Before we begin...
		<br /> A couple of ground rules
	</>,
	"1. Participate",
	"2. Be Honest",
	"3. Be Thoughtful",
	"4. Be Creative",
	<>
		5. Stay Muted
		<br /> When not speaking
	</>,
]

export const Scroller = () => {
	const form = useFormStatus()

	return (
		<>
			<div className="grid grow snap-y snap-mandatory auto-rows-[100%] overflow-auto overscroll-contain scrollbar-hide">
				{slides.map((slide, idx) => (
					<div key={idx} className="flex snap-start flex-col justify-center">
						<Text style="heading" size={24}>
							{slide}
						</Text>
					</div>
				))}

				<div className="flex snap-start flex-col justify-center">
					<Button
						color="black"
						size="base"
						className="mx-auto"
						icon={form.pending && <Spinner className="w-[1.125rem]" />}
						disabled={form.pending}
					>
						<span>I Agree</span>
					</Button>
				</div>
			</div>

			<div className="pointer-events-none absolute inset-x-0 top-10 h-10 bg-gradient-to-b from-white to-white/0" />
			<div className="pointer-events-none absolute inset-x-0 bottom-10 h-10 bg-gradient-to-t from-white to-white/0" />

			<Text
				style="copy"
				size={12}
				className="absolute bottom-0 left-1/2 -translate-x-1/2 text-gray-50"
			>
				Scroll to continue
			</Text>
		</>
	)
}
