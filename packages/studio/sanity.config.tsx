import { defineConfig } from "sanity"
import { structureTool } from "sanity/structure"
import { visionTool } from "@sanity/vision"
import { media, mediaAssetSource } from "sanity-plugin-media"
import { schemaTypes } from "./schemaTypes"
import { Logo } from "@unworkshop/app/src/components/Logo"

export default defineConfig({
	name: "default",
	title: "UnWorkshop",
	subtitle: "Welcome back to the UnWorkshop CMS.",

	projectId: "dvfxggqr",
	dataset: "development",

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

	schema: { types: schemaTypes },
})
