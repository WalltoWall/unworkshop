"use client"

import Link from "next/link"
import { Text } from "@/components/Text"

interface BackToRegisterProps {
	code: string
	text: string
}

export const BackToRegister = ({ code, text }: BackToRegisterProps) => {
	const href = `/kickoff/register?code=${code}`

	return (
		<Text
			style="copy"
			size={12}
			className="mt-4 block text-gray-50 underline"
			asChild
		>
			<Link href={href}>{text}</Link>
		</Text>
	)
}
