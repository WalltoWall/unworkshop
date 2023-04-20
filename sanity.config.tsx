import { defineConfig } from "sanity"
import { deskTool } from "sanity/desk"
import { visionTool } from "@sanity/vision"
import { media, mediaAssetSource } from "sanity-plugin-media"
import { env } from "@/env"
import { schemaTypes } from "@/sanity/schemas"

export default defineConfig({
	name: "default",
	title: "W|W Workshop",
	basePath: "/admin",

	projectId: env.projectId,
	dataset: env.dataset,

	form: {
		// Only use the media plugin for images.
		file: {
			assetSources: (assetSources) =>
				assetSources.filter((assetSource) => assetSource !== mediaAssetSource),
		},
		image: {
			assetSources: (assetSources) =>
				assetSources.filter((assetSource) => assetSource === mediaAssetSource),
		},
	},

	plugins: [deskTool(), media(), visionTool()],

	schema: { types: schemaTypes },
})
