import type { StaticImageData } from "next/image"
import brainstormIllustration from "@/assets/images/brainstorm-illustration.jpg"
import formIllustration from "@/assets/images/form-illustration.png"
import seesawIllustration from "@/assets/images/seesaw-illustration.png"
import slidersIllustration from "@/assets/images/sliders-illustration.jpg"
import targetAudienceA from "@/assets/images/target-audience-a-illustration.png"
import targetAudienceB from "@/assets/images/target-audience-b-illustration.png"
import usVsThem from "@/assets/images/us-vs-them-illustration.png"

// type CardIllustrationData = {
// 	src: StaticImageData
// 	className: string
// }

const illustrations = {
	brainstorm: {
		imageSrc: brainstormIllustration,
		imageClassName:
			"-translate-y-[3%] translate-x-[28%] -rotate-[17deg] mix-blend-multiply h-[128%]",
	},
	sliders: {
		imageSrc: slidersIllustration,
		imageClassName:
			"mix-blend-multiply h-[175%] translate-x-[27%] -translate-y-[3%]",
	},
	quadrants: {
		imageSrc: formIllustration,
		imageClassName: "h-[170%] translate-x-[37%] -translate-y-[16%]",
	},
	form: {
		imageSrc: formIllustration,
		imageClassName: "h-[170%] translate-x-[37%] -translate-y-[16%]",
	},
}

export type CardIllustration = keyof typeof illustrations
export type CardIllustrationData = (typeof illustrations)[CardIllustration]

export class CardIllustrationSequence {
	idx = 0

	constructor(public sequence: CardIllustration[]) {}

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
