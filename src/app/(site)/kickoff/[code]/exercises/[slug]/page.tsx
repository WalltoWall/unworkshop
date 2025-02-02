type Params = { code: string; slug: string }
type Props = { params: Promise<Params> }

export default async function ExercisePage(props: Props) {
	const params = await props.params

	return <div>Page</div>
}
