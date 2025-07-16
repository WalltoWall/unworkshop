import { Hono } from "hono"
import { logger } from "hono/logger"
import { partyserverMiddleware } from "hono-party"

const app = new Hono<{ Bindings: Env }>()

app
	.use(logger())
	.use("*", partyserverMiddleware())
	.get("/api", (c) => c.text("CloudFlare"))

export { UnworkshopParty } from "./unworkshop-party"

export default app
