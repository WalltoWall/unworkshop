import { Text } from "@/components/Text"

type Props = {
	params: { code: string; slug: string }
}

const ExercisePage = (props: Props) => {
	return (
		<div>
			<Text style="heading" size={40} asChild>
				Exercise
			</Text>
		</div>
	)
}

export default ExercisePage
