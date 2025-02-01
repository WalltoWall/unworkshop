import type { StaticImageData } from "next/image"
import brainstormIllustration from "@/assets/images/brainstorm-illustration.jpg"
import formIllustration from "@/assets/images/form-illustration.png"
import seesawIllustration from "@/assets/images/seesaw-illustration.png"
import slidersIllustration from "@/assets/images/sliders-illustration.jpg"
import targetAudienceA from "@/assets/images/target-audience-a-illustration.png"
import targetAudienceB from "@/assets/images/target-audience-b-illlustration.png"
import usVsThem from "@/assets/images/us-vs-them-illustration.png"
import type { Exercise } from "@/sanity/types.gen"

export type CardIllustrationData = {
	src: StaticImageData
	className: string
}
export type CardIllustration = NonNullable<Exercise["illustration"]>

export const illustrations: Record<CardIllustration, CardIllustrationData> = {
	speechBubbles: {
		src: brainstormIllustration,
		className:
			"-translate-y-[3%] translate-x-[28%] -rotate-[17deg] mix-blend-multiply h-[128%]",
	},
	rollingBoards: {
		src: slidersIllustration,
		className:
			"mix-blend-multiply h-[175%] translate-x-[27%] -translate-y-[3%]",
	},
	clocksAndHands: {
		src: formIllustration,
		className: "h-[170%] translate-x-[37%] -translate-y-[16%]",
	},
	seeSaw: {
		src: seesawIllustration,
		className: "h-[125%] translate-x-[20%] translate-y-[5%]",
	},
	usVsThem: {
		src: usVsThem,
		className: "h-[120%] translate-x-[29%]",
	},
	targetAudienceA: {
		src: targetAudienceA,
		className: "h-[120%] translate-x-[30%]",
	},
	targetAudienceB: {
		src: targetAudienceB,
		className: "h-[120%] translate-x-[30%]",
	},
}

export class CardIllustrationSequence {
	idx = 0

	constructor(
		public sequence: CardIllustration[] = Object.keys(
			illustrations,
		) as CardIllustration[],
	) {}

	next() {
		const color = this.sequence[this.idx % this.sequence.length]
		this.idx++

		return color
	}

	nextVariant() {
		const color = this.next()

		return illustrations[color]
	}
}
