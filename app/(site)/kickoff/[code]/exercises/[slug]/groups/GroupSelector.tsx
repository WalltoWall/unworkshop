import type { Dispatch } from "react"
import { Arrow } from "@/components/icons/Arrow"
import { Text } from "@/components/Text"
import type { ST } from "@/sanity/config"

interface GroupSelectorProps {
	groups: ST["exercise"]["groups"]
	setGroup: Dispatch<string>
}

export const GroupSelector = ({ groups, setGroup }: GroupSelectorProps) => {
	return (
		<div className="my-4">
			<Text size={16} className="mb-7">
				Select your group
			</Text>

			<fieldset className="grid gap-4">
				{groups?.map((group) => (
					<label
						key={group._key}
						className="relative cursor-pointer rounded-lg bg-gray-90 py-5 pl-3 pr-11 text-left uppercase transition-colors text-24 font-heading capsize focus-within:bg-black focus-within:text-white hover:bg-black hover:text-white focus:bg-black focus:text-white"
					>
						<input
							name="group"
							type="radio"
							value={group.slug.current}
							onChange={() => setGroup(group.slug.current)}
							className="absolute -left-[9999px] h-[1px] w-[1px]"
						/>
						{group.name}
						<Arrow className="absolute right-3 top-1/2 w-5 -translate-y-1/2" />
					</label>
				))}
			</fieldset>
		</div>
	)
}
