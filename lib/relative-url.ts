export class RelativeURL extends URL {
	static #URI = "https://www.example.com"

	constructor(url: string) {
		super(url, RelativeURL.#URI)
	}

	host = ""
	hostname = ""
	protocol = ""
	href = super.href.replace(RelativeURL.#URI, "")
	origin = super.href.replace(RelativeURL.#URI, "")

	toString(): string {
		return super.toString().replace(RelativeURL.#URI, "")
	}
}
