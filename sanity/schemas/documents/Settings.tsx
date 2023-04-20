import { SettingsIcon } from "lucide-react"
import { s } from "sanity-typed-schema-builder"

export const Settings = s.document({
	name: "settings",
	title: "Site Settings",
	icon: () => <SettingsIcon width={24} height={24} />,

	fields: [
		{
			name: "siteTitle",
			title: "Site Title",
			description: "The site-wide title of the website.",
			type: s.string(),
		},
	],
})
export type Settings = s.infer<typeof Settings>
