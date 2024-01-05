import type { FieldProps, FormFieldAnswer } from "./types"

const NarrowListField = () => {
	return <div></div>
}

type Props = FieldProps<{
	source: FormFieldAnswer
}>

export const NarrowField = ({ source, field }: Props) => {
	const { min = 1, max = Infinity } = field

	console.log(source)

	return <></>
}
