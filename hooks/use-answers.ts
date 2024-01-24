import React from "react"
import { createClient } from "@sanity/client"
import type { ST } from "@/sanity/config"
import { env } from "@/env"
import type { GroupAnswer, IndividualAnswer } from "@/types"

const client = createClient({
	projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
	dataset: env.NEXT_PUBLIC_SANITY_DATASET,
	apiVersion: env.NEXT_PUBLIC_SANITY_API_VERSION,
	useCdn: false,
})

type ExerciseParticipant = ST["participant"] & {
	answers?: {
		[exerciseId: string]: {
			meta: IndividualAnswer | GroupAnswer
			steps?: any
			answers?: any
		}
	}
}

type Key = "steps" | "answers"

const typeVariants = {
	form: {
		defaultValue: [],
		key: "steps" as Key,
	},
	brainstorm: {
		defaultValue: [],
		key: "answers" as Key,
	},
	sliders: {
		defaultValue: {},
		key: "answers" as Key,
	},
	quadrants: {
		defaultValue: {},
		key: "answers" as Key,
	},
}

export function useAnswers(
	participant: ExerciseParticipant,
	exerciseId: string,
	type: "form" | "brainstorm" | "sliders" | "quadrants",
) {
	const variant = typeVariants[type]

	const [data, setData] = React.useState<any>(variant.defaultValue)

	const answers = participant.answers?.[exerciseId]
	const meta = answers?.meta

	React.useEffect(() => {
		if (!meta?.role || meta?.role === "captain") {
			setData(answers?.[variant.key])
		}
	}, [answers])

	React.useEffect(() => {
		let subscription = null as any

		if (meta?.type === "group" && meta?.role !== "captain") {
			const query = `*[_type == "participant" && answers[$exerciseId] != null && answers[$exerciseId].meta.role == "captain" && answers[$exerciseId].meta.group == $group][0].answers[$exerciseId][$key]`

			client
				.fetch(query, { exerciseId, group: meta.group, key: variant.key })
				.then((result) => {
					setData(result ?? variant.defaultValue)
				})

			subscription = client
				.listen(query, { exerciseId, group: meta.group, key: variant.key })
				.subscribe((update) => {
					setData(update.result?.answers?.[exerciseId]?.[variant.key])
				})
		}

		return () => {
			if (subscription) {
				subscription.unsubscribe()
			}
		}
	}, [])

	return { answers: data, meta }
}
