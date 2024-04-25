import React from "react"
import clsx from "clsx"
import { AddCardButton } from "./AddCardButton"
import { Card } from "./Card"
import type { BrainstormCard, Color } from "./types"
import type { BrainstormActions } from "./use-multiplayer-brainstorm"

const colors: Record<Color, string> = {
	green: clsx("bg-green-78 placeholder:text-[color:#2b9a66]"),
	red: clsx("bg-pink-80 placeholder:text-[color:#e54666]"),
	yellow: clsx("bg-yellow-77 placeholder:text-[color:#9e6c00]"),
}

type Props = {
	cards: Array<BrainstormCard>
	color?: Color
	actions: BrainstormActions
	participantOrGroupId: string
	readOnly?: boolean
}

export const CardScroller = ({
	cards,
	color = "green",
	actions,
	participantOrGroupId,
	readOnly = false,
}: Props) => {
	return (
		<div
			className={clsx(
				"mb-auto mt-4 grid min-h-0 flex-[1_1_0] grid-cols-2 content-start gap-2.5 overflow-y-auto py-4 scrollbar-hide scroll-shadow scroll-shadow-4 sm:auto-rows-[10.25rem] sm:grid-cols-2",
			)}
		>
			<AddCardButton
				actions={actions}
				participantOrGroupId={participantOrGroupId}
				readOnly={readOnly}
			/>

			{cards.map((card) => (
				<Card
					key={card.id}
					card={card}
					colorClassNames={colors[color]}
					actions={actions}
					readOnly={readOnly}
				/>
			))}
		</div>
	)
}
