import React from "react"
import Image from "next/image"
import { cx } from "class-variance-authority"
import { Text } from "@/components/Text"
import captainIllustration from "@/assets/images/captain-illustration.jpg"
import contibutorIllustration from "@/assets/images/contributor-illustration.jpg"
import type { Role } from "./GroupForm"

const variants = {
	contributor: {
		name: "Contributor",
		instructions: "I'll answer with my group.",
		instructionsClassName: "text-gray-75",
		className: "bg-black text-white",
		imageSrc: contibutorIllustration,
	},
	captain: {
		name: "Captain",
		instructions: "I'll answer for my group.",
		instructionsClassName: "text-gray-50",
		className: "bg-white border border-gray-90",
		imageSrc: captainIllustration,
	},
}

interface GroupRoleSelectorProps {
	onGroupChange: (role: Role) => void
}

export const GroupRoleSelector = ({
	onGroupChange,
}: GroupRoleSelectorProps) => {
	return (
		<div className="my-4">
			<Text size={16} className="mb-7">
				What's your role?
			</Text>

			<fieldset className="grid gap-4">
				<RoleCard type="contributor" setRole={onGroupChange} />
				<RoleCard type="captain" setRole={onGroupChange} />
			</fieldset>
		</div>
	)
}

interface RoleCardProps {
	type: Role
	setRole: (role: Role) => void
}

const RoleCard = ({ type, setRole }: RoleCardProps) => {
	const variant = variants[type as keyof typeof variants]

	return (
		<label
			className={cx(
				"relative flex aspect-[308/200] cursor-pointer flex-col overflow-hidden rounded-lg p-3 text-left focus-within:opacity-75 hover:opacity-75",
				variant.className,
			)}
		>
			<input
				type="radio"
				name="role"
				value={type}
				className="absolute -left-[9999px] h-[1px] w-[1px]"
				onClick={() => setRole(type)}
			/>

			<Image
				src={variant.imageSrc}
				alt=""
				placeholder="blur"
				className="absolute right-0 top-0"
			/>

			<Text
				asChild
				size={32}
				className="relative mt-auto uppercase font-heading"
			>
				<h3>{variant.name}</h3>
			</Text>

			<Text
				size={16}
				className={cx("relative mt-3", variant.instructionsClassName)}
			>
				{variant.instructions}
			</Text>
		</label>
	)
}
