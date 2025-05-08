import { match } from "ts-pattern"
import { PRESENTER_GROUP_ID } from "@/constants"
import { UnworkshopPartyServer } from "@/worker/unworkshop-party"
import type { Connection, ConnectionContext, WSMessage } from "partyserver"
import { BrainstormS } from "./schemas"
import { noop } from "../lib/noop"
import { nanoid } from "nanoid"
import { DEFAULT_PRESENTER_STATE } from "./constants"

export class Brainstorm extends UnworkshopPartyServer<BrainstormS.Message> {
	state: BrainstormS.PresenterState = DEFAULT_PRESENTER_STATE
	answers: BrainstormS.AllAnswers = {}

	onConnect(conn: Connection, ctx: ConnectionContext): void {
		const group = this.getGroup(ctx)
		const msgId = nanoid(6)

		let data: BrainstormS.Message

		if (group === PRESENTER_GROUP_ID) {
			data = {
				type: "presenter-all",
				answers: this.answers,
				state: this.state,
			}
			this.state.sorters[conn.id] = { name: this.getName(ctx) || conn.id }
		} else {
			data = { type: "update", answer: this.answers[group] ?? {} }
		}

		this.sendMessage({ conn, data, msgId })
	}

	onClose(conn: Connection) {
		delete this.state.sorters[conn.id]

		this.updatePresenters({
			data: { type: "update-presenter-state", state: this.state },
			msgId: nanoid(6),
		})
	}

	onMessage(_: Connection, message: WSMessage): void {
		const msg = this.parseUnworkshopMsg(message, BrainstormS.Message)

		match(msg.data)
			.with({ type: "add" }, (data) => {
				const { id, step } = data.payload

				this.answers[id] ??= {}
				this.answers[id][step] ??= []
				this.answers[id][step].push({ id: nanoid(6), value: "" })

				this.updateGroup({
					group: id,
					msgId: msg.id,
					data: {
						type: "update",
						answer: this.answers[id],
					},
				})
				this.updatePresenters({
					msgId: msg.id,
					data: { type: "update-presenter-answers", answers: this.answers },
				})
			})
			.with({ type: "edit" }, (data) => {
				const { id, step, idx, value } = data.payload

				this.answers[id] ??= {}
				this.answers[id][step] ??= []

				const sticky = this.answers[id][step][idx]
				if (!sticky) return

				this.answers[id][step][idx] = { ...sticky, value }

				this.updateGroup({
					group: id,
					msgId: msg.id,
					data: {
						type: "update",
						answer: this.answers[id],
					},
				})
				this.updatePresenters({
					msgId: msg.id,
					data: { type: "update-presenter-answers", answers: this.answers },
				})
			})
			.with({ type: "delete" }, (data) => {
				const { id, step, idx } = data.payload

				this.answers[id] ??= {}
				this.answers[id][step] ??= []

				this.answers[id][step].splice(idx, 1)

				this.updateGroup({
					group: id,
					msgId: msg.id,
					data: {
						type: "update",
						answer: this.answers[id],
					},
				})
				this.updatePresenters({
					msgId: msg.id,
					data: { type: "update-presenter-answers", answers: this.answers },
				})
			})
			.with({ type: "add-unsorted-column" }, () => {
				this.state.unsortedColumns++

				this.updatePresenters({
					msgId: msg.id,
					data: { type: "update-presenter-state", state: this.state },
				})
			})
			.with({ type: "delete-unsorted-column" }, () => {
				this.state.unsortedColumns--

				this.updatePresenters({
					msgId: msg.id,
					data: { type: "update-presenter-state", state: this.state },
				})
			})
			.otherwise(noop)
	}
}
