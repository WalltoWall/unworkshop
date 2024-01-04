"use client"

import Image from "next/image"
import { cx } from "class-variance-authority"
import { Text } from "@/components/Text"
import captainIllustration from "@/assets/images/captain-illustration.jpg"
import contibutorIllustration from "@/assets/images/contributor-illustration.jpg"

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

export const GroupRoleSelector = () => {
	const handleRoleSelect = (role: string) => {
		console.log(role)
	}

	return (
		<div className="my-4 grid gap-4">
			<RoleCard type="contributor" onRoleSelect={handleRoleSelect} />
			<RoleCard type="captain" onRoleSelect={handleRoleSelect} />
		</div>
	)
}

interface RoleCardProps {
	type: "contributor" | "captain"
	onRoleSelect: (role: string) => void
}

const RoleCard = ({ type, onRoleSelect }: RoleCardProps) => {
	const variant = variants[type as keyof typeof variants]

	return (
		<button
			type="button"
			className={cx(
				"relative flex aspect-[308/200] flex-col overflow-hidden rounded-lg p-3 text-left",
				variant.className,
			)}
			onClick={() => onRoleSelect(type)}
		>
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
		</button>
	)
}
