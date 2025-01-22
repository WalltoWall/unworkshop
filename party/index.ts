import { createClient } from "@sanity/client"
import syncedStore from "@syncedstore/core"
import type * as Party from "partykit/server"
import * as R from "remeda"
import { onConnect } from "y-partykit"
import * as Y from "yjs"
import { INITIAL_BRAINSTORM_ANSWERS } from "@/app/(site)/kickoff/[code]/exercises/[slug]/_BrainstormExercise/constants"
import type { BrainstormExercise } from "@/app/(site)/kickoff/[code]/exercises/[slug]/_BrainstormExercise/types"
import { INITIAL_QUADRANTS_ANSWERS } from "@/app/(site)/kickoff/[code]/exercises/[slug]/_QuadrantsExercise/contants"
import type { QuadrantsExercise } from "@/app/(site)/kickoff/[code]/exercises/[slug]/_QuadrantsExercise/types"
import { INITIAL_SLIDERS_ANSWERS } from "@/app/(site)/kickoff/[code]/exercises/[slug]/_SlidersExercise/constants"
import type { SlidersExercise } from "@/app/(site)/kickoff/[code]/exercises/[slug]/_SlidersExercise/types"
import type { FormExercise } from "@/app/(site)/kickoff/[code]/exercises/[slug]/FormsExercise/types"
import { INITIAL_FORM_ANSWERS } from "@/app/(site)/presenter/[code]/[slug]/_FormExercise/constants"

const sanity = createClient({
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "development",
	apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2023-02-10",
	token: process.env.SANITY_TOKEN,
	perspective: "published",
	useCdn: false,
})

type Result =
	| BrainstormExercise
	| FormExercise
	| QuadrantsExercise
	| SlidersExercise
	| null

async function getExercise(id: string) {
	const query = '*[_type == "exercise" && _id == $id][0]'
	const params = { id }

	return await sanity.fetch<Result>(query, params)
}

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

				const doc = await getExercise(exerciseId)
				if (!doc) {
					console.info("No exercise found for id: " + exerciseId)

					return yDoc
				}

				switch (doc.type) {
					case "brainstorm": {
						const exercise = doc as BrainstormExercise
						if (!exercise.answers) return yDoc

						const store = syncedStore(INITIAL_BRAINSTORM_ANSWERS, yDoc)

						if (exercise.answers.groups) {
							R.forEachObj(exercise.answers.groups, (g, gId) => {
								store.groups[gId] = g
							})
						}

						if (exercise.answers.steps) {
							exercise.answers.steps.forEach((s) => store.steps.push(s))
						}

						return yDoc
					}

					case "sliders": {
						const exercise = doc as SlidersExercise
						if (!exercise.answers) return yDoc

						const store = syncedStore(INITIAL_SLIDERS_ANSWERS, yDoc)
						R.forEachObj(exercise.answers.groups, (g, gId) => {
							store.groups[gId] = g
						})
						R.forEachObj(exercise.answers.participants, (p, pId) => {
							store.participants[pId] = p
						})

						return yDoc
					}

					case "quadrants": {
						const exercise = doc as QuadrantsExercise
						if (!exercise.answers) return yDoc

						const store = syncedStore(INITIAL_QUADRANTS_ANSWERS, yDoc)
						if (exercise.answers.groups) {
							R.forEachObj(exercise.answers.groups, (g, gId) => {
								store.groups[gId] = g
							})
						}
						if (exercise.answers.participants) {
							R.forEachObj(exercise.answers.participants, (p, pId) => {
								store.participants[pId] = p
							})
						}

						return yDoc
					}

					case "form": {
						const exercise = doc as FormExercise
						if (!exercise.answers) return yDoc

						const store = syncedStore(INITIAL_FORM_ANSWERS, yDoc)

						if (exercise.answers.groups) {
							R.forEachObj(exercise.answers.groups, (g, gId) => {
								store.groups[gId] = g
							})
						}
						if (exercise.answers.participants) {
							R.forEachObj(exercise.answers.participants, (p, pId) => {
								store.participants[pId] = p
							})
						}

						return yDoc
					}

					default:
						return yDoc
				}

				console.info("Loaded exercise answers for id: " + exerciseId)
			},

			callback: {
				handler: async (yDoc) => {
					const exerciseId = this.exerciseId

					const doc = await getExercise(exerciseId)
					let answers: any = {}

					switch (doc?.type) {
						case "form": {
							const a: Partial<FormExercise["answers"]> = {}
							a.participants = yDoc.get("participants", Y.Map).toJSON()
							a.groups = yDoc.get("groups", Y.Map).toJSON()

							answers = a

							break
						}
						case "sliders": {
							const a: Partial<SlidersExercise["answers"]> = {}
							a.participants = yDoc.get("participants", Y.Map).toJSON()
							a.groups = yDoc.get("groups", Y.Map).toJSON()

							answers = a

							break
						}
						case "quadrants": {
							const a: Partial<QuadrantsExercise["answers"]> = {}
							a.participants = yDoc.get("participants", Y.Map).toJSON()
							a.groups = yDoc.get("groups", Y.Map).toJSON()

							answers = a

							break
						}
						case "brainstorm": {
							const a: Partial<BrainstormExercise["answers"]> = {}
							a.steps = yDoc.get("steps", Y.Array).toJSON()
							a.groups = yDoc.get("groups", Y.Map).toJSON()

							answers = a

							break
						}
					}

					await sanity
						.patch(exerciseId)
						.set({ answers })
						.commit()
						.catch(() => null)
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
