import { at, defineMigration, unset } from "sanity/migrate"

export default defineMigration({
	title: "Remove onboarded field for participants",
	documentTypes: ["participant"],
	migrate: {
		document(_doc, _context) {
			return [at("onboarded", unset())]
		},
	},
})
