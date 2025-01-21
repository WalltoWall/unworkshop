import { $ } from "zx"

const exec = $({ cwd: __dirname, quiet: true })

async function runSanityTypegen() {
	console.info("Running Sanity Typegen...")

	await exec`npx sanity schema extract --enforce-required-fields --workspace default`
	await exec`npx sanity typegen generate`

	console.info("Finished Sanity Typegen.")
}

runSanityTypegen()
