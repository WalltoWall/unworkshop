import type { FieldProps, FormAnswer, FormStep } from "./types"

const NarrowListField = () => {
	return <div></div>
}

type Props = FieldProps<{
	sourceAnswer: FormAnswer
	sourceStep: FormStep
	min?: number
	max?: number
}>

export const NarrowField = ({
	sourceAnswer,
	sourceStep,
	min = 1,
	max = Infinity,
}: Props) => {
	console.log(sourceAnswer)

	return <></>
}
