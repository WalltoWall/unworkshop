import { fromFile } from "@capsizecss/unpack"

console.info({
	regular: await fromFile("./assets/fonts/regular.woff2"),
	compressed: await fromFile("./assets/fonts/compressed.woff2"),
	serif: await fromFile("./assets/fonts/serif.woff2"),
})
