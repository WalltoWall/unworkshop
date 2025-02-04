import { $ } from "bun"
import { Resource } from "sst"

async function runSanityTypegen() {
	console.info("Running Sanity Typegen...")

	$.cwd(__dirname)
	$.env({
		NEXT_PUBLIC_SANITY_PROJECT_ID: Resource.SanityProjectId.value,
		NEXT_PUBLIC_SANITY_DATASET: Resource.SanityDataset.value,
	})

	await $`bunx sanity schema extract --enforce-required-fields --workspace default`
	await $`bunx sanity typegen generate`

	console.info("Finished Sanity Typegen.")
}

runSanityTypegen()
