import { CogIcon } from "lucide-react"
import { defineConfig, type InferSchemaValues } from "@sanity-typed/types"
import { visionTool } from "@sanity/vision"
import { media, mediaAssetSource } from "sanity-plugin-media"
import { deskTool } from "sanity/desk"
import { Logo } from "@/components/Logo"
import { schemaTypes } from "@/sanity/schemas"
import { env } from "@/env"

const config = defineConfig({
	name: "default",
	title: "W|W Workshop",
	subtitle: "Welcome back to the ShopShop CMS.",
	basePath: "/admin",

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

	projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
	dataset: env.NEXT_PUBLIC_SANITY_DATASET,

	studio: {
		components: {
			logo: () => (
				<div style={{ display: "flex", gap: 8 }}>
					<Logo style={{ width: "2.1875rem" }} />
					<p style={{ fontWeight: 900 }}>ShopShop</p>
				</div>
			),
		},
	},

	form: {
		// Remove the media and unsplash plugins for static assets.
		file: {
			assetSources: (assetSources) =>
				assetSources.filter(
					(assetSource) => ![mediaAssetSource].includes(assetSource),
				),
		},

		// Unsplash and media plugin for images.
		image: {
			assetSources: (assetSources) =>
				assetSources.filter((assetSource) =>
					[mediaAssetSource].includes(assetSource),
				),
		},
	},

	document: {
		// Enables the "Open Preview" in the options context menu for a
		// document. This isn't really a preview, but moreso a "quick-link" to
		// the page.
		// productionUrl: async (_prev, context) => {
		// 	const slug = slugResolver(
		// 		(context.document as PreviewableDocument)?.slug?.current,
		// 	)
		// 	const url = new URL(slug, env.NEXT_PUBLIC_ROOT_URL)
		// 	return url.toString()
		// },
	},

	plugins: [
		deskTool({
			// Customize the content sidebar.
			structure: (S) => {
				const hideFromNav = ["settings", "media.tag"]

				return S.list()
					.title("Content")
					.items([
						...S.documentTypeListItems().filter(
							(item) => !hideFromNav.includes(String(item.getId())),
						),
						S.listItem()
							.title("Settings")
							.child(S.document().schemaType("settings").documentId("settings"))
							.icon(() => <CogIcon width={24} height={24} />),
					])
			},
		}),
		media(),
		visionTool(),
	],

	schema: { types: schemaTypes },
})

export type ST = InferSchemaValues<typeof config>

export default config
