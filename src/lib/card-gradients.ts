export const cardGradients = {
	orangeToGreen: "bg-linear-to-r from-orange-300 to-emerald-300",
	purpleToOrange: "bg-linear-to-r from-purple-400 to-orange-400",
	tealToGreen: "bg-linear-to-r from-teal-200 to-green-400",
	blueToPurple: "bg-linear-to-r from-sky-300 to-fuchsia-400",
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
		const color = this.sequence[this.idx % this.sequence.length]!
		this.idx++

		return color
	}

	nextClassName() {
		const color = this.next()

		return cardGradients[color]
	}
}
