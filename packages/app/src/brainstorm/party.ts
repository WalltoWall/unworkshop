import { match } from "ts-pattern"
import { PRESENTER_ID } from "@/constants"
import { UnworkshopPartyServer } from "@/worker/unworkshop-party"
import type { Connection, ConnectionContext, WSMessage } from "partyserver"
import { BrainstormS } from "./schemas"
import { noop } from "../lib/noop"

export class Brainstorm extends UnworkshopPartyServer<BrainstormS.Message> {
	answers: BrainstormS.AllAnswers = {}

	onConnect(connection: Connection, ctx: ConnectionContext): void {
		const groupId = this.getGroupId(ctx)

		if (groupId === PRESENTER_ID) {
			this.sendMessage({ type: "presenter", answers: this.answers }, connection)
		} else {
			const answer = this.answers[groupId] ?? {}
			this.sendMessage({ type: "init", answer }, connection)
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

				this.updateRoom(id, {
					type: "update",
					answer: this.answers[id],
					msgId: message.msgId,
				})
			})
			.with({ type: "edit" }, (message) => {
				const { id, step, idx, value } = message.payload

				this.answers[id] ??= {}
				this.answers[id][step] ??= []
				this.answers[id][step][idx] = value

				this.updateRoom(id, {
					type: "update",
					answer: this.answers[id],
					msgId: message.msgId,
				})
			})
			.otherwise(noop)

		this.updatePresenters({ type: "presenter", answers: this.answers })
	}
}
