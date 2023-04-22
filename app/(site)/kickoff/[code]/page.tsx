import type { Metadata } from "next"

type Props = {
	params: { code: string }
	searchParams: { [key: string]: string | string[] | undefined }
}

const KickoffPage = (props: Props) => {
	return <div>Kickoff</div>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
	return {
		title: `${props.params.code} - W|W Workshop`,
	}
}

export default KickoffPage
