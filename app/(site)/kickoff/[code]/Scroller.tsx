"use client"

import { Text } from "@/components/Text"

export const Scroller = () => {
	return (
		<div className="flex grow flex-col justify-center py-10 text-center">
			<Text style="heading" size={24} className="my-auto">
				Before we begin...
				<br /> A couple of ground rules
			</Text>

			<Text style="copy" size={12} className="mt-auto text-gray-50">
				Scroll to continue
			</Text>
		</div>
	)
}
