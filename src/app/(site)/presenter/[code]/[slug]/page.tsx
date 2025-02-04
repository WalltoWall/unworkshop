type Params = Promise<{ code: string; slug: string }>
type Props = { params: Params }

const PresenterExercisePage = async (props: Props) => {
	const params = await props.params

	return <div>Nothing</div>
}

export default PresenterExercisePage
