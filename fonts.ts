import { fromFile } from "@capsizecss/unpack"

async function main() {
	console.log({
		sans: await fromFile("./assets/fonts/trade-gothic-regular.woff2"),
		heading: await fromFile("./assets/fonts/trade-gothic-bold-condensed.woff2"),
	})
}

main()
