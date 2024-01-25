import type * as Party from "partykit/server"
import { onConnect } from "y-partykit"
import * as Y from "yjs"

export default class Server implements Party.Server {
	constructor(readonly room: Party.Room) {}

	onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
		// A websocket just connected!
		console.log(`Connected:
            id: ${conn.id}
            room: ${this.room.id}
            url: ${new URL(ctx.request.url).pathname}
        `)

		return onConnect(conn, this.room, {
			load: async () => {
				// TODO: Load initial data from Sanity, re-hydrate yDoc.

				// const data = this.room.id
				// 	.split("::")
				// 	.reduce((acc, curr, idx, items) => {
				// 		if (idx % 2 === 0) {
				// 			const item = items[idx + 1]
				// 			acc[curr] = item

				// 			if (item === "true") acc[curr] = true
				// 			if (item === "false") acc[curr] = false

				// 			return acc
				// 		}

				// 		return acc
				// 	}, {} as any)

				const yDoc = new Y.Doc()
				const yMap = yDoc.getMap("answers")

				yMap.set("type", "brainstorm")
				const ySteps = yMap.set("steps", new Y.Array())

				const step1 = new Y.Map()
				step1.set("unsorted", new Y.Array())
				step1.set("columns", new Y.Array())

				const step2 = new Y.Map()
				step2.set("unsorted", new Y.Array())
				step2.set("columns", new Y.Array())

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
