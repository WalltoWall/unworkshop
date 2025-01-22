import { createClient } from "next-sanity"

const KICKOFF_ID = ""

const client = createClient({
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
	token: process.env.SANITY_TOKEN,
	apiVersion: "2024-11-21",
	perspective: "published",
	useCdn: false,
})

async function main() {
	const query = '*[_type == "participant" && kickoff._ref == $kickoffId]'
	const params = { kickoffId: KICKOFF_ID }

	await client.delete({ query, params }).then(console.log).catch(console.error)
}

main()
