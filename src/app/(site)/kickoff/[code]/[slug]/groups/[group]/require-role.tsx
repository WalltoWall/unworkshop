"use client"

import { Participant } from "@/participant"

type Props = {
	children: React.ReactNode
	fallback?: React.ReactNode
}

export const RequireRole = ({ children, fallback = null }: Props) => {
	const participant = Participant.useInfoOrThrow()

	return participant.role ? children : fallback
}
