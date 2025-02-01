import { Text } from "@/components/Text"
import { CardGradientSequence } from "./exercises/card-gradients"
import { CardIllustrationSequence } from "./exercises/card-illustrations"

type Params = { code: string }
type Props = { params: Promise<Params> }

export default async function KickoffPage(props: Props) {
	const params = await props.params

	const gradientSequence = new CardGradientSequence()
	const illustrationSequence = new CardIllustrationSequence()

	return (
		<div>
			<Text style="heading" size={40}>
				Exercises
			</Text>

			<ul className="mt-6 grid gap-4"></ul>
		</div>
	)
}

export const metadata = { title: "Exercises" }
