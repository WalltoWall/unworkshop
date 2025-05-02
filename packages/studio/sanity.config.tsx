import { defineConfig } from "sanity"
import { structureTool } from "sanity/structure"
import { visionTool } from "@sanity/vision"
import { media, mediaAssetSource } from "sanity-plugin-media"
import { schema } from "./schema"
import { Logo } from "@unworkshop/app/src/components/Logo"
import { DATASET, PROJECT_ID } from "./constants"
import { simplerColorInput } from "sanity-plugin-simpler-color-input"

export default defineConfig({
	name: "default",
	title: "UnWorkshop",
	subtitle: "Welcome back to the UnWorkshop CMS.",

	projectId: PROJECT_ID,
	dataset: DATASET,

	document: { comments: { enabled: false } },
	announcements: { enabled: false },
	tasks: { enabled: false },

	logo: () => <Logo style={{ width: "2.1875rem" }} />,
	icon: () => <Logo />,

	auth: {
		redirectOnSingle: false,
		loginMethod: "dual",
		mode: "replace",
		providers: [
			{
				name: "google",
				title: "Google",
				url: "https://api.sanity.io/v1/auth/login/google",
			},
			{
				name: "sanity",
				title: "E-mail / password",
				url: "https://api.sanity.io/v1/auth/login/sanity",
			},
		],
	},

	studio: {
		components: {
			logo: () => (
				<div style={{ display: "flex", gap: 8 }}>
					<Logo style={{ width: "2.1875rem" }} />
					<p style={{ fontWeight: 900 }}>UnWorkshop</p>
				</div>
			),
		},
	},

	form: {
		// Remove the media and unsplash plugins for static assets.
		file: {
			assetSources: (assetSources) =>
				assetSources.filter(
					//@ts-expect-error - mismatching asset types
					(assetSource) => ![mediaAssetSource].includes(assetSource),
				),
		},

		// Unsplash and media plugin for images.
		image: {
			assetSources: (assetSources) =>
				assetSources.filter((assetSource) =>
					//@ts-expect-error - mismatching asset types
					[mediaAssetSource].includes(assetSource),
				),
		},
	},

	plugins: [
		simplerColorInput({
			defaultColorFormat: "hex",
			defaultColorList: [
				{ label: "Red", value: "#f87171" },
				{ label: "Orange", value: "#fb923c" },
				{ label: "Amber", value: "#fbbf24" },
				{ label: "Yellow", value: "#facc15" },
				{ label: "Lime", value: "#a3e635" },
				{ label: "Green", value: "#4ade80" },
				{ label: "Emerald", value: "#34d399" },
				{ label: "Teal", value: "#2dd4bf" },
				{ label: "Cyan", value: "#22d3ee" },
				{ label: "Sky", value: "#38bdf8" },
				{ label: "Blue", value: "#60a5fa" },
				{ label: "Indigo", value: "#818cf8" },
				{ label: "Violet", value: "#a78bfa" },
				{ label: "Purple", value: "#c084fc" },
				{ label: "Fuchsia", value: "#e879f9" },
				{ label: "Pink", value: "#f472b6" },
				{ label: "Rose", value: "#fb7185" },
			],
			enableSearch: true,
		}),
		structureTool({
			// Customize the content sidebar.
			structure: (S) => {
				const hideFromNav = ["settings", "media.tag"]

				return S.list()
					.title("Content")
					.items([
						...S.documentTypeListItems().filter(
							(item) => !hideFromNav.includes(String(item.getId())),
						),
					])
			},
		}),
		media(),
		visionTool(),
	],

	schema: { types: schema },
})
