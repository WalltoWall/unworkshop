import { PRESENTER_ID } from "@/constants"
import {
	Server as PartyServer,
	type Connection,
	type ConnectionContext,
} from "partyserver"

type UnworkshopMsg<T> = { data: T; id: string }

export class UnworkshopPartyServer<T> extends PartyServer {
	sendMessage(message: T, conn: Connection) {
		conn.send(JSON.stringify(message))
	}

	unwrapUnworkshopMessage(message: UnworkshopMsg<T>): T {
		return message.data
	}

	updatePresenters(message: T) {
		this.updateRoom(PRESENTER_ID, message)
	}

	updateRoom(id: string, message: T) {
		for (const conn of this.getConnections(id)) {
			this.sendMessage(message, conn)
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
