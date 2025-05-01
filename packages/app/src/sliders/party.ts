import { Server, type Connection, type WSMessage } from "partyserver"
import { SlidersS } from "./schemas"
import { match } from "ts-pattern"
import { PRESENTER_ID } from "@/constants"

export class Sliders extends Server {
	answers: SlidersS.AllAnswers = {}

	sendLatestStateToPresenter() {
		const presenterE: SlidersS.PresenterEvent = {
			type: "update",
			answers: this.answers,
		}

		const conn = this.getConnection(PRESENTER_ID)
		conn?.send(JSON.stringify(presenterE))
	}

	onConnect(connection: Connection): void | Promise<void> {
		if (connection.id === PRESENTER_ID) {
			this.sendLatestStateToPresenter()
		} else {
			const answer = this.answers[connection.id] ?? {}
			const e: SlidersS.Event = { type: "init", answer }

			connection.send(JSON.stringify(e))
		}
	}

	onMessage(connection: Connection, message: WSMessage): void | Promise<void> {
		const data = JSON.parse(message.toString())
		const msg = SlidersS.Message.parse(data)

		match(msg)
			.with({ type: "change" }, (msg) => {
				const { id, prompt, type, value } = msg.payload

				this.answers[id] ??= {}
				this.answers[id][prompt] ??= { today: 1 }
				this.answers[id][prompt][type] = value

				const e: SlidersS.Event = { type: "update", answer: this.answers[id] }

				connection.send(JSON.stringify(e))
			})
			.exhaustive()

		this.sendLatestStateToPresenter()
	}
}
