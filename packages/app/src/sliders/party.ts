import type { Connection, ConnectionContext, WSMessage } from "partyserver"
import { SlidersS } from "./schemas"
import { match } from "ts-pattern"
import { PRESENTER_GROUP_ID } from "@/constants"
import { UnworkshopPartyServer } from "@/worker/unworkshop-party"
import { nanoid } from "nanoid"
import { noop } from "@/lib/noop"
import { DEFAULT_ANSWER } from "./constants"

export class Sliders extends UnworkshopPartyServer<SlidersS.Message> {
	answers: SlidersS.AllAnswers = {}

	onConnect(connection: Connection, ctx: ConnectionContext): void {
		const group = this.getGroup(ctx)
		const msgId = nanoid(6)

		let data: SlidersS.Message

		if (group === PRESENTER_GROUP_ID) {
			data = { type: "presenter", answers: this.answers }
		} else {
			data = { type: "update", answer: this.answers[group] ?? {} }
		}

		this.sendMessage({ conn: connection, data, msgId })
	}

	onMessage(_: Connection, message: WSMessage): void {
		const msg = this.parseUnworkshopMsg(message, SlidersS.Message)

		match(msg.data)
			.with({ type: "change" }, (data) => {
				const { id, prompt, type, value } = data.payload

				this.answers[id] ??= {}
				this.answers[id][prompt] ??= DEFAULT_ANSWER
				this.answers[id][prompt][type] = value

				this.updateGroup({
					group: id,
					msgId: msg.id,
					data: { type: "update", answer: this.answers[id] },
				})
			})
			.otherwise(noop)

		this.updatePresenters({
			msgId: msg.id,
			data: { type: "presenter", answers: this.answers },
		})
	}
}
