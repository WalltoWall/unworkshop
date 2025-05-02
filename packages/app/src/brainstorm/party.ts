import { BrainstormS } from "./schemas"
import { match } from "ts-pattern"
import { PRESENTER_ID } from "@/constants"
import { UnworkshopPartyServer } from "@/worker/unworkshop-party"
import type { Connection, ConnectionContext, WSMessage } from "partyserver"

export class Brainstorm extends UnworkshopPartyServer<BrainstormS.Message> {
	answers: BrainstormS.AllAnswers = {}

	onConnect(connection: Connection, ctx: ConnectionContext): void {
		const groupId = this.getGroupId(ctx)

		if (groupId === PRESENTER_ID) {
			const presenterE: BrainstormS.Message = {
				type: "presenter",
				answers: this.answers,
			}
			const msg = JSON.stringify(presenterE)

			connection.send(msg)
		} else {
			const answer = this.answers[groupId] ?? {}
			const e: BrainstormS.Message = { type: "answer", answer }
			const msg = JSON.stringify(e)

			connection.send(msg)
		}
	}

	onMessage(_: Connection, message: WSMessage): void {
		const data = JSON.parse(message.toString())
		const msg = BrainstormS.Message.parse(data)

		match(msg)
			.with({ type: "submission" }, (message) => {
				const { id, value, step } = message.payload

				this.answers[id] ??= {}
				this.answers[id][step] ??= []
				this.answers[id][step].push(value)

				this.updateRoom(id, { type: "answer", answer: this.answers[id] })
			})
			.otherwise(() => {})

		this.updatePresenters({ type: "presenter", answers: this.answers })
	}
}
