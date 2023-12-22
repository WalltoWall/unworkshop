"use client"

import { useState } from "react"
import Link from "next/link"
import { Hamburger } from "@/components/icons/Hamburger"
import { Logo } from "@/components/Logo"
import { Text } from "@/components/Text"

interface PresenterHeaderProp {
	heading?: string
}

export const PresenterHeader = ({ heading }: PresenterHeaderProp) => {
	const [isOpen, setIsOpen] = useState(false)

	return (
		<header className="flex h-[5.5rem] items-center bg-black px-8 py-[1.125rem]">
			<Link href="/presenter">
				<Logo className="h-[3.25rem] w-[3.25rem] text-white" />
			</Link>

			{heading && (
				<Text
					size={48}
					className="ml-10 font-bold uppercase text-white font-heading"
				>
					{heading}
				</Text>
			)}

			<Hamburger open={isOpen} setOpen={setIsOpen} />
		</header>
	)
}
