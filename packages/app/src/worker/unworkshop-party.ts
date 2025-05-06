import { PRESENTER_GROUP_ID } from "@/constants"
import {
	Server as PartyServer,
	type Connection,
	type ConnectionContext,
	type WSMessage,
} from "partyserver"
import { z } from "zod"

type UnworkshopMsg<T> = { data: T; id: string }

export class UnworkshopPartyServer<T> extends PartyServer {
	schema: z.ZodObject<{ data: z.ZodType<T>; id: z.ZodString }> | null = null

	sendMessage(args: { msgId: string; data: T; conn: Connection }) {
		const msg: UnworkshopMsg<T> = { data: args.data, id: args.msgId }

		args.conn.send(JSON.stringify(msg))
	}

	parseUnworkshopMsg(
		message: WSMessage,
		schema: z.ZodType<T>,
	): UnworkshopMsg<T> {
		this.schema ??= z.object({ data: schema, id: z.string() })
		const raw = JSON.parse(message.toString())

		return this.schema.parse(raw)
	}

	updatePresenters(args: { msgId: string; data: T }) {
		this.updateGroup({
			group: PRESENTER_GROUP_ID,
			data: args.data,
			msgId: args.msgId,
		})
	}

	updateGroup(args: { group: string; msgId: string; data: T }) {
		for (const conn of this.getConnections(args.group)) {
			this.sendMessage({ msgId: args.msgId, data: args.data, conn })
		}
	}

	getGroup(ctx: ConnectionContext) {
		const url = new URL(ctx.request.url)
		const group = url.searchParams.get("group")
		if (!group) {
			throw new Error(
				"Invalid request. All connections must supply `group` via query paramaters.",
			)
		}

		return group
	}

	getConnectionTags(_: Connection, ctx: ConnectionContext): string[] {
		return [this.getGroup(ctx)]
	}
}
