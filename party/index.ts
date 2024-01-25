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

				// const people = await storage.getItem<Person[]>("people")

				// const yPeople = yDoc.getArray<Person>("people")
				// yPeople.insert(0, people ?? [])

				return yDoc
			},

			callback: {
				async handler(yDoc) {
					// const sanityExercise = {
					// 	_id: "klajdf;lkjadslfj",
					// 	_rev: "ljfl;ajsdflka",
					// 	name: "Us Vs. Them",
					// 	slug: "us-vs-them",
					// 	answers: {
					// 		type: "brainstorm",
					// 		columns: [
					// 			{
					// 				id: "sorting-column",
					// 				cards: [
					// 					{ id: "129309213", response: "My first response" },
					// 					{ id: "1293012313", response: "Hello there" },
					// 				],
					// 			},
					// 			{
					// 				id: "1329012482",
					// 				title: "New Column",
					// 				cards: [
					// 					{ id: "3094809480924", response: "Starbucks sucks" },
					// 					{ id: "021984i9014", response: "I love panda express" },
					// 				],
					// 			},
					// 		],
					// 	},
					// }
					// const yPeople = yDoc.getArray<Person>("people")
					// return await storage.setItem(
					// 	"people",
					// 	yPeople.map((p) => p),
					// )
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
