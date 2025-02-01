"use client"

import { Button } from "@/components/Button"
import { DarkLayout } from "@/components/dark-layout"
import { Text } from "@/components/Text"

const Error = (props: { error: Error; reset: () => void }) => {
	return (
		<DarkLayout>
			<div className="my-auto space-y-4 px-7 pb-20">
				<Text style="heading" size={40}>
					Oops! Something went wrong
				</Text>

				<Button color="gray" outline size="sm" onClick={() => props.reset()}>
					Go back
				</Button>
			</div>
		</DarkLayout>
	)
}

export default Error
