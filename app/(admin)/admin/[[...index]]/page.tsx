import { Studio } from "./Studio"

export default function AdminPage() {
	return <Studio />
}

export async function generateStaticParams() {
	return [{ index: [""] }]
}

export const dynamic = "force-static"
export { metadata, viewport } from "next-sanity/studio"
