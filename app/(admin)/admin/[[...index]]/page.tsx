import { Studio } from "./Studio"

export default function StudioPage() {
	return <Studio />
}

export { metadata, viewport } from "next-sanity/studio"

export async function generateStaticParams() {
	return [{ index: [""] }]
}
