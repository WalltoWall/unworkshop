"use client"

import React from "react"
import { createClient } from "@sanity/client"
import { env } from "@/env"

export const client = createClient({
	projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
	dataset: env.NEXT_PUBLIC_SANITY_DATASET,
	apiVersion: env.NEXT_PUBLIC_SANITY_API_VERSION,
	useCdn: false,
})

export const useCaptainAnswers = (exerciseId: string, group?: string) => {
	const [data, setData] = React.useState<any>(null)

	const query = `*[_type == "participant" && answers[$exerciseId] != null && answers[$exerciseId].meta.role == "captain" && answers[$exerciseId].meta.group == $group][0].answers[$exerciseId].answers`

	React.useEffect(() => {
		let subscription = null as any

		if (group) {
			client.fetch(query, { exerciseId, group }).then((result) => {
				setData(result)
			})

			subscription = client
				.listen(query, { exerciseId, group })
				.subscribe((update) => {
					setData(update.result?.answers?.[exerciseId]?.answers)
				})
		}

		return () => {
			if (subscription) {
				subscription.unsubscribe()
			}
		}
	}, [])

	return data
}
