import { Hono } from "hono"
import { logger } from "hono/logger"
import { partyserverMiddleware } from "hono-party"
export { Sliders } from "../sliders/party"

const app = new Hono<{ Bindings: Env }>()
app.use(logger())
app.use("*", partyserverMiddleware())

app.get("/api", (c) => c.text("CloudFlare"))

export default app
