import type * as Party from "partykit/server"
import { onConnect, unstable_getYDoc, type YPartyKitOptions } from "y-partykit"

const OPTIONS: YPartyKitOptions = {
	persist: { mode: "snapshot" },
	gc: false,
	callback: {
		async handler(_yDoc) {
			// called every few seconds after edits
			// you can use this to write to a database
			// or some external storage
		},

		// control how often handler is called with these options
		debounceWait: 10000, // default: 2000 ms
		debounceMaxWait: 20000, // default: 10000 ms
		timeout: 5000, // default: 5000 ms
	},
}

export default class Server implements Party.Server {
	constructor(public room: Party.Room) {}

	onConnect(conn: Party.Connection) {
		console.info(`Received connection: ${conn.id}`)

		return onConnect(conn, this.room, OPTIONS)
	}

	async getAnswers() {
		const yDoc = await unstable_getYDoc(this.room, OPTIONS)
		const answers = yDoc.getMap("answers")

		return answers
	}

	// For debug, dump the current state of the yDoc
	// When run locally, this can be seen at http://127.0.0.1:1999/party/room
	async onRequest(req: Party.Request): Promise<Response> {
		if (req.method !== "GET" && req.method !== "DELETE") {
			return new Response("Unsupported Method", { status: 404 })
		}

		const answers = await this.getAnswers()

		if (req.method === "DELETE") {
			answers.clear()
		}

		return Response.json(answers.toJSON())
	}
}
