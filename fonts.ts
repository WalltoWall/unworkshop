import { fromFile } from "@capsizecss/unpack"

console.log({
	regular: await fromFile("./assets/fonts/regular.woff2"),
	condensed: await fromFile("./assets/fonts/condensed.woff2"),
	compressed: await fromFile("./assets/fonts/compressed.woff2"),

	oldHeading: await fromFile(
		"./assets/fonts/trade-gothic-bold-condensed.woff2",
	),
})
