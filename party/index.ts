import { createClient } from "@sanity/client"
import type * as Party from "partykit/server"
import { proxy } from "valtio"
import { bind } from "valtio-yjs"
import { onConnect } from "y-partykit"
import * as Y from "yjs"
import type * as ST from "@/sanity/types.gen"
import { INITIAL_ANSWERS } from "@/app/(site)/kickoff/[code]/exercises/[slug]/_BrainstormExercise/constants"
import type { BrainstormExercise } from "@/app/(site)/kickoff/[code]/exercises/[slug]/_BrainstormExercise/types"
import { INITIAL_QUADRANTS_ANSWERS } from "@/app/(site)/kickoff/[code]/exercises/[slug]/_QuadrantsExercise/contants"
import type { QuadrantsExercise } from "@/app/(site)/kickoff/[code]/exercises/[slug]/_QuadrantsExercise/types"
import { INITIAL_SLIDERS_ANSWERS } from "@/app/(site)/kickoff/[code]/exercises/[slug]/_SlidersExercise/constants"
import type { SlidersExercise } from "@/app/(site)/kickoff/[code]/exercises/[slug]/_SlidersExercise/types"
import type { FormExercise } from "@/app/(site)/kickoff/[code]/exercises/[slug]/FormsExercise/types"
import { INITIAL_FORM_ANSWERS } from "@/app/(site)/presenter/[code]/[slug]/_FormExercise/constants"
import { ANSWERS_KEY } from "@/constants"

const sanity = createClient({
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "development",
	apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2023-02-10",
	token: process.env.SANITY_TOKEN,
	perspective: "published",
	useCdn: false,
})

export default class Server implements Party.Server {
	constructor(readonly room: Party.Room) {}

	get exerciseId() {
		const [, exerciseId] = this.room.id.split("::")

		return exerciseId
	}

	onConnect(conn: Party.Connection, _ctx: Party.ConnectionContext) {
		return onConnect(conn, this.room, {
			persist: false,
			load: async () => {
				const yDoc = new Y.Doc()
				const exerciseId = this.exerciseId

				console.info("Loading exercise answers for id: " + exerciseId)

				const doc = await sanity.fetch<ST.Exercise | null>(
					'*[_type == "exercise" && _id == $id][0]',
					{ id: exerciseId },
				)
				if (!doc) {
					console.info("No exercise found for id: " + exerciseId)

					return yDoc
				}

				const yMap = yDoc.getMap(ANSWERS_KEY)

				switch (doc?.type) {
					case "brainstorm": {
						console.info("Found brainstorm exercise.")

						const exercise = doc as BrainstormExercise

						let initialState: BrainstormExercise["answers"]
						if (!exercise.answers) {
							console.info("No existing answers found. Creating initial data.")

							initialState = INITIAL_ANSWERS
						} else {
							console.info("Existing answers found. Persisting data.")

							initialState = exercise.answers
						}

						const state = proxy(initialState)
						bind(state, yMap)

						return yDoc
					}

					case "sliders": {
						console.info("Found sliders exercise.")

						const exercise = doc as SlidersExercise

						let initialState: SlidersExercise["answers"]

						if (!exercise.answers) {
							console.info(
								"No existing answers found. Creating initial sliders data.",
							)

							initialState = INITIAL_SLIDERS_ANSWERS
						} else {
							console.info("Found existing sliders answers. Persisting data.")

							initialState = exercise.answers
						}

						const state = proxy(initialState)
						bind(state, yMap)

						return yDoc
					}

					case "quadrants": {
						console.info("Found quadrants exercise.")

						const exercise = doc as QuadrantsExercise

						let initialState: QuadrantsExercise["answers"]

						if (!exercise.answers) {
							console.info(
								"No existing answers found. Creating initial quadrants data.",
							)

							initialState = INITIAL_QUADRANTS_ANSWERS
						} else {
							console.info("Found existing quadrants answers. Persisting data.")

							initialState = exercise.answers
						}

						const state = proxy(initialState)
						bind(state, yMap)

						return yDoc
					}

					case "form": {
						console.info("Found form exercise.")

						const exercise = doc as FormExercise

						let initialState: FormExercise["answers"]
						if (!exercise.answers) {
							console.info("No existing answers found. Creating initial data.")

							initialState = INITIAL_FORM_ANSWERS
						} else {
							console.info("Existing answers found. Persisting data.")

							initialState = exercise.answers
						}

						const state = proxy(initialState)
						bind(state, yMap)

						return yDoc
					}

					default:
						return yDoc
				}
			},

			callback: {
				handler: async (yDoc) => {
					const yMap = yDoc.getMap(ANSWERS_KEY)
					const exerciseId = this.exerciseId

					const answers = yMap.toJSON()

					console.info("Saving exercise...")

					await sanity
						.patch(exerciseId)
						.set({ answers })
						.commit()
						.catch((err) =>
							console.error(`Saving document ${exerciseId} failed: `, err),
						)

					console.info("Saved exercise: " + exerciseId)
				},

				// only save after every 5 seconds (default)
				debounceWait: 5000,

				// if updates keep coming, save at least once every 10 seconds (default)
				debounceMaxWait: 10000,
			},
		})
	}
}

Server satisfies Party.Worker
