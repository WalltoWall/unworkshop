import { defineCliConfig } from "sanity/cli"
import { DATASET, PROJECT_ID } from "./constants"

export default defineCliConfig({
	api: {
		projectId: PROJECT_ID,
		dataset: DATASET,
	},

	reactStrictMode: false,
	autoUpdates: false,
})
