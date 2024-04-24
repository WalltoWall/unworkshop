import { watch } from "turbowatch"

void watch({
	project: __dirname,
	debounce: { wait: 0 },
	triggers: [
		{
			expression: [
				"allof",
				["match", "**/*", "basename"],
				["not", ["match", "types.gen.ts", "wholename"]],
			],
			name: "codegen",
			throttleOutput: { delay: 0 },

			onChange: async ({ spawn }) => {
				await spawn`cd sanity && dotenvx run -f ../.env -- sanity schema extract --enforce-required-fields`
				await spawn`cd sanity && sanity typegen generate`
			},
		},
	],
})
