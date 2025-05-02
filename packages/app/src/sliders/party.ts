import {
	Server,
	type Connection,
	type ConnectionContext,
	type WSMessage,
} from "partyserver"
import { SlidersS } from "./schemas"
import { match } from "ts-pattern"
import { PRESENTER_ID } from "@/constants"

export class Sliders extends Server {
	answers: SlidersS.AllAnswers = {}

	updatePresenters() {
		const presenterE: SlidersS.PresenterEvent = {
			type: "update",
			answers: this.answers,
		}
		const msg = JSON.stringify(presenterE)

		for (const conn of this.getConnections(PRESENTER_ID)) {
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

	getConnectionTags(_connection: Connection, ctx: ConnectionContext): string[] {
		return [this.getGroupId(ctx)]
	}

	onConnect(connection: Connection, ctx: ConnectionContext): void {
		const groupId = this.getGroupId(ctx)

		if (groupId === PRESENTER_ID) {
			const presenterE: SlidersS.PresenterEvent = {
				type: "update",
				answers: this.answers,
			}
			const msg = JSON.stringify(presenterE)

			connection.send(msg)
		} else {
			const answer = this.answers[groupId] ?? {}
			const e: SlidersS.Event = { type: "init", answer }
			const msg = JSON.stringify(e)

			connection.send(msg)
		}
	}

	onMessage(_: Connection, message: WSMessage): void | Promise<void> {
		const data = JSON.parse(message.toString())
		const msg = SlidersS.Message.parse(data)

		match(msg)
			.with({ type: "change" }, (message) => {
				const { id, prompt, type, value } = message.payload

				this.answers[id] ??= {}
				this.answers[id][prompt] ??= { today: 1 }
				this.answers[id][prompt][type] = value

				const e: SlidersS.Event = { type: "update", answer: this.answers[id] }
				const msg = JSON.stringify(e)

				for (const conn of this.getConnections(id)) {
					conn.send(msg)
				}
			})
			.exhaustive()

		this.updatePresenters()
	}
}
