"use client"

import { Arrow } from "@/components/icons/Arrow"
import { Text } from "@/components/Text"
import type { ST } from "@/sanity/config"

interface GroupSelectorProps {
	groups: ST["exercise"]["groups"]
}

export const GroupSelector = ({ groups }: GroupSelectorProps) => {
	const handleGroupSelect = (name: string) => {
		console.log(name)
	}

	return (
		<div className="my-4">
			<Text size={16} className="mb-7">
				Select your group
			</Text>

			<div className="grid gap-4">
				{groups?.map((group) => (
					<button
						type="button"
						key={group._key}
						className="relative rounded-lg bg-gray-90 py-5 pl-3 pr-11 text-left uppercase transition-colors text-24 font-heading capsize hover:bg-black hover:text-white focus:bg-black focus:text-white"
						onClick={() => handleGroupSelect(group.name)}
					>
						{group.name}

						<Arrow className="absolute right-3 top-1/2 w-5 -translate-y-1/2" />
					</button>
				))}
			</div>
		</div>
	)
}
