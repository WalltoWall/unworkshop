import { useParams } from "next/navigation"

type GroupParams = {
	code: string
	slug: string
	groupSlug: string
}

export const useGroupParams = () => useParams<GroupParams>()
