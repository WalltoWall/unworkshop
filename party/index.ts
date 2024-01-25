import type * as Party from "partykit/server"
import { onConnect } from "y-partykit"
import * as Y from "yjs"

export default class Server implements Party.Server {
	constructor(readonly room: Party.Room) {}

	onConnect(conn: Party.Connection, _ctx: Party.ConnectionContext) {
		return onConnect(conn, this.room, {
			load: async () => {
				// TODO: 1. Get exercise ID from room.
				// 2. Load exercise document from Sanity.
				// 3. Based on exercise document, determine how to "hydrate the
				// Y.Doc" based on the type of answer

				const yDoc = new Y.Doc()
				const yMap = yDoc.getMap("answers")

				yMap.set("type", "brainstorm")
				const ySteps = yMap.set("steps", new Y.Array())

				const step1 = new Y.Map()
				step1.set("participants", new Y.Map())
				step1.set("groups", new Y.Map())

				const step2 = new Y.Map()
				step2.set("participants", new Y.Map())
				step2.set("groups", new Y.Map())

				ySteps.push([step1, step2])

				return yDoc
			},

			callback: {
				async handler(yDoc) {
					// TODO: Persist data into Sanity
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
