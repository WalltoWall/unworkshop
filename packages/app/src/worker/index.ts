import { Hono } from "hono"
import { logger } from "hono/logger"
import { partyserverMiddleware } from "hono-party"

const app = new Hono<{ Bindings: Env }>()
app.use(logger())
app.use("*", partyserverMiddleware())

app.get("/api", (c) => c.text("CloudFlare"))

export { Sliders } from "../sliders/party"
export { Brainstorm } from "../brainstorm/party"
export { BrainstormPresenter } from "../brainstorm/presenter/party"

export default app
