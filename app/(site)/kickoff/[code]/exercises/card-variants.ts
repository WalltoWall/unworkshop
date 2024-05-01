import brainstormIllustration from "@/assets/images/brainstorm-illustration.jpg"
import formIllustration from "@/assets/images/form-illustration.png"
import slidersIllustration from "@/assets/images/sliders-illustration.jpg"

const VARIANTS = {
	brainstorm: {
		gradientClassName: "from-[#4BEEE1] to-[#E477D1]",
		imageSrc: brainstormIllustration,
		imageClassName:
			"-translate-y-[3%] translate-x-[28%] -rotate-[17deg] mix-blend-multiply h-[128%]",
	},
	sliders: {
		gradientClassName: "from-[#E561D0] to-[#EA892C]",
		imageSrc: slidersIllustration,
		imageClassName:
			"mix-blend-multiply h-[175%] translate-x-[27%] -translate-y-[3%]",
	},
	quadrants: {
		gradientClassName: "from-[#4BEEE1] to-[#90E477]",
		imageSrc: formIllustration,
		imageClassName: "h-[170%] translate-x-[37%] -translate-y-[16%]",
	},
	form: {
		gradientClassName: "from-[#FA927F] to-[#D7F082]",
		imageSrc: formIllustration,
		imageClassName: "h-[170%] translate-x-[37%] -translate-y-[16%]",
	},
}

export type CardVariant = keyof typeof VARIANTS

export class CardVariantSequence {
	idx = 0

	constructor(public sequence: CardVariant[]) {}

	next() {
		const color = this.sequence[this.idx % this.sequence.length]
		this.idx++

		return color
	}

	nextVariant() {
		const color = this.next()

		return VARIANTS[color]
	}
}
