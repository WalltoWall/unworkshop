import type { Connection } from "partyserver"
import { YServer } from "y-partyserver"
import * as Y from "yjs"

export class UnworkshopParty extends YServer<Env> {
	static callbackOptions = {
		debounceWait: 2000,
		debounceMaxWait: 10000,
		timeout: 5000,
	}

	onError(connection: Connection, error: unknown): void | Promise<void> {
		console.error(`Connection: ${connection.id} errored:`, error)
	}

	async onStart() {
		this.ctx.storage.sql.exec(
			"CREATE TABLE IF NOT EXISTS documents (id TEXT PRIMARY KEY, content BLOB)",
		)

		return super.onStart()
	}

	// load a document from a database, or some remote resource
	// and apply it on to the Yjs document instance at `this.document`
	async onLoad() {
		const doc = [
			...this.ctx.storage.sql.exec(
				"SELECT * FROM documents WHERE id = ? LIMIT 1",
				this.name,
			),
		][0]
		if (!doc) return

		const update = new Uint8Array(doc.content as ArrayBuffer)

		Y.applyUpdate(this.document, update)
	}

	// called every few seconds after edits, and when the room empties
	// you can use this to write to a database or some external storage
	async onSave() {
		const update = Y.encodeStateAsUpdate(this.document)

		this.ctx.storage.sql.exec(
			"INSERT OR REPLACE INTO documents (id, content) VALUES (?, ?)",
			this.name,
			update,
		)
	}
}
