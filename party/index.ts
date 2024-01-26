import type * as Party from "partykit/server"
import { proxy } from "valtio"
import { bind } from "valtio-yjs"
import { onConnect } from "y-partykit"
import * as Y from "yjs"
import type { ST } from "@/sanity/config"
import { sanity } from "@/sanity/sanity-client"
import { type BrainstormExercise } from "@/app/(site)/kickoff/[code]/exercises/[slug]/_BrainstormExercise/types"
import { ANSWERS_KEY } from "@/constants"

export default class Server implements Party.Server {
	constructor(readonly room: Party.Room) {}

	get exerciseId() {
		const [, exerciseId] = this.room.id.split("::")

		return exerciseId
	}

	onConnect(conn: Party.Connection, _ctx: Party.ConnectionContext) {
		return onConnect(conn, this.room, {
			load: async () => {
				const yDoc = new Y.Doc()

				const doc = await sanity.fetch<ST["exercise"] | null>(
					'*[_type == "exercise" && _id == $id][0]',
					{ id: this.exerciseId },
				)
				if (!doc) return yDoc

				const yMap = yDoc.getMap(ANSWERS_KEY)

				switch (doc?.type) {
					case "brainstorm": {
						const exercise = doc as BrainstormExercise
						const initialState = exercise.answers ?? {
							steps: [{ participants: {}, groups: {} }],
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

					console.log("Saving exercise: " + exerciseId)

					await sanity
						.patch(exerciseId)
						.set({ answers })
						.commit()
						.catch((err) =>
							console.error(`Saving document ${exerciseId} failed: `, err),
						)
				},

				// only save after every 2 seconds (default)
				debounceWait: 2000,

				// if updates keep coming, save at least once every 10 seconds (default)
				debounceMaxWait: 10000,
			},
		})
	}
}

Server satisfies Party.Worker
