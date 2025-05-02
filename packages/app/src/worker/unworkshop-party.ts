import { PRESENTER_ID } from "@/constants"
import {
	Server as PartyServer,
	type Connection,
	type ConnectionContext,
} from "partyserver"

export class UnworkshopPartyServer<T> extends PartyServer {
	updatePresenters(message: T) {
		this.updateRoom(PRESENTER_ID, message)
	}

	updateRoom(id: string, message: T) {
		const msg = JSON.stringify(message)

		for (const conn of this.getConnections(id)) {
			conn.send(msg)
		}
	}

	getGroupId(ctx: ConnectionContext) {
		const url = new URL(ctx.request.url)
		const id = url.searchParams.get("id")
		if (!id) {
			throw new Error(
				"Invalid request. All connections must supply an id via query paramaters.",
			)
		}

		return id
	}

	getConnectionTags(_: Connection, ctx: ConnectionContext): string[] {
		return [this.getGroupId(ctx)]
	}
}
