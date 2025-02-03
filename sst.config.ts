/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
	app(input) {
		return {
			name: "unworkshop",
			removal: input?.stage === "production" ? "retain" : "remove",
			home: "aws",
			providers: {
				aws: { profile: "wtw", region: "us-west-2" },
			},
		}
	},
	async run() {
		const secrets = {
			SanityToken: new sst.Secret("SanityToken"),
			SanityDataset: new sst.Secret("SanityDataset", "development"),
			SanityProjectId: new sst.Secret("SanityProjectId"),
		}
		const allSecrets = Object.values(secrets)

		const bucket = new sst.aws.Bucket("Bucket")
		const web = new sst.aws.Nextjs("Web", {
			link: [bucket, ...allSecrets],
			environment: {
				SANITY_TOKEN: secrets.SanityToken.value,
				NEXT_PUBLIC_SANITY_PROJECT_ID: secrets.SanityProjectId.value,
				NEXT_PUBLIC_SANITY_DATASET: secrets.SanityDataset.value,
			},
		})

		new sst.x.DevCommand("PartyKit", {
			link: [...allSecrets],
			dev: { command: "bunx partykit dev" },
		})

		return {
			bucket: bucket.name,
			url: web.url,
		}
	},
})
