import path from "node:path"
import url from "node:url"
import { FlatCompat } from "@eslint/eslintrc"

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const compat = new FlatCompat({
	baseDirectory: __dirname,
})

const eslintConfig = [
	...compat.extends("next/core-web-vitals", "next/typescript"),
]

export default eslintConfig
