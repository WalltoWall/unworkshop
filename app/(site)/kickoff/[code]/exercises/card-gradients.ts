export const cardGradients = {
	orangeToGreen: "from-[#4BEEE1] to-[#E477D1]",
	purpleToOrange: "from-[#E561D0] to-[#EA892C]",
	tealToGreen: "from-[#4BEEE1] to-[#90E477]",
	blueToPurple: "from-[#FA927F] to-[#D7F082]",
}

export type CardGradient = keyof typeof cardGradients
export type CardGradientData = (typeof cardGradients)[CardGradient]

export class CardGradientSequence {
	idx = 0

	constructor(
		public sequence: CardGradient[] = Object.keys(
			cardGradients,
		) as CardGradient[],
	) {}

	next() {
		const color = this.sequence[this.idx % this.sequence.length]
		this.idx++

		return color
	}

	nextClassName() {
		const color = this.next()

		return cardGradients[color]
	}
}
