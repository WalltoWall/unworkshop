import { router } from "@/router"
import { createClient } from "@openauthjs/openauth/client"
import { redirect } from "@tanstack/react-router"
import { decodeJwt } from "jose"
import { z } from "zod"

const ACCESS_TOKEN_KEY = "unworkshop-atoken"
const REFRESH_TOKEN_KEY = "unworkshop-rtoken"
const CHALLENGE_KEY = "unworkshop-challenge"
const REDIRECT_TO_KEY = "unworkshop-redirect-to"

const REDIRECT_URI = `${location.origin}/callback`

const UserInfo = z.object({
	email: z.email(),
	id: z.string(),
	picture: z.url(),
	name: z.string(),
})

const client = createClient({
	clientID: "unworkshop",
	issuer: "https://openauth.walltowall.co",
})

export function isLoggedIn(): boolean {
	const aToken = localStorage.getItem(ACCESS_TOKEN_KEY)
	const rToken = localStorage.getItem(REFRESH_TOKEN_KEY)

	return Boolean(aToken && rToken)
}

export async function login(redirectTo: string) {
	const result = await client.authorize(REDIRECT_URI, "code", {
		pkce: true,
		provider: "google",
	})

	localStorage.setItem(CHALLENGE_KEY, JSON.stringify(result.challenge))
	localStorage.setItem(REDIRECT_TO_KEY, redirectTo)

	location.replace(result.url)
}

export async function handleCallback(code: string) {
	const storedChallenge = localStorage.getItem(CHALLENGE_KEY)
	if (!storedChallenge) throw new Error("Invalid request.")

	const challenge = JSON.parse(storedChallenge)
	const exchanged = await client.exchange(
		code,
		REDIRECT_URI,
		challenge.verifier,
	)
	if (exchanged.err) throw new Error("Failed to exchange.")

	localStorage.setItem(ACCESS_TOKEN_KEY, exchanged.tokens.access)
	localStorage.setItem(REFRESH_TOKEN_KEY, exchanged.tokens.refresh)

	const redirectTo = localStorage.getItem(REDIRECT_TO_KEY)
	if (!redirectTo) throw redirect({ to: "/" })

	throw redirect({ to: redirectTo })
}

export function logout() {
	localStorage.removeItem(ACCESS_TOKEN_KEY)
	localStorage.removeItem(REFRESH_TOKEN_KEY)

	router.navigate({ to: "/presenter" })
}

export async function getToken() {
	const access = localStorage.getItem(ACCESS_TOKEN_KEY)
	const refresh = localStorage.getItem(REFRESH_TOKEN_KEY)
	if (!access || !refresh) throw new Error("Unauthorized.")

	const next = await client.refresh(refresh, { access })
	if (next.err) {
		throw redirect({ to: "/presenter" })
	}

	if (next.tokens) {
		localStorage.setItem(ACCESS_TOKEN_KEY, next.tokens.access)
		localStorage.setItem(REFRESH_TOKEN_KEY, next.tokens.refresh)

		return next.tokens.access
	}

	return access
}

export function getUserInfo() {
	const access = localStorage.getItem(ACCESS_TOKEN_KEY)
	if (!access) throw new Error("Unauthorized.")

	return UserInfo.parse(decodeJwt(access).properties)
}
