import type { Connection } from "partyserver"
import { YServer } from "y-partyserver"
import * as Y from "yjs"

const TWO_SECONDS = 2000
const TEN_SECONDS = 10000
const FIVE_SECONDS = 5000

export class UnworkshopParty extends YServer<Env> {
	static callbackOptions = {
		debounceWait: TWO_SECONDS,
		debounceMaxWait: TEN_SECONDS,
		timeout: FIVE_SECONDS,
	}

	onError(connection: Connection, error: unknown) {
		if (error instanceof Error) {
			if (error.message === "Network connection lost.") return

			return console.error(
				`Unknown error from ${connection.id}:`,
				error.message,
			)
		}

		console.error(`Unknown error from ${connection.id}:`, error)
	}

	async onStart() {
		this.ctx.storage.sql.exec(
			"CREATE TABLE IF NOT EXISTS documents (id TEXT PRIMARY KEY, content BLOB)",
		)

		return super.onStart()
	}

	// Load a document from storage. Apply the update to the `yjs` document at
	// `this.document`.
	async onLoad() {
		const rows = this.ctx.storage.sql.exec(
			"SELECT * FROM documents WHERE id = ? LIMIT 1",
			this.name,
		)
		const doc = rows.next().value
		if (!doc) return

		const update = new Uint8Array(doc.content as ArrayBuffer)

		Y.applyUpdate(this.document, update)
	}

	// Called every few seconds during edits, and when the room empties.
	// Write to a database or some external storage to persist data.
	async onSave() {
		const update = Y.encodeStateAsUpdate(this.document)

		this.ctx.storage.sql.exec(
			"INSERT OR REPLACE INTO documents (id, content) VALUES (?, ?)",
			this.name,
			update,
		)
	}
}
