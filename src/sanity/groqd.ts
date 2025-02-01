import { createGroqBuilder, makeSafeQueryRunner } from "groqd"
import { sanity } from "./sanity-client"
import type * as ST from "./types.gen"

export const runQuery = makeSafeQueryRunner((query) => sanity.fetch(query))

type SchemaConfig = {
	schemaTypes: ST.AllSanitySchemaTypes
	referenceSymbol: typeof ST.internalGroqTypeReferenceTo
}
export const q = createGroqBuilder<SchemaConfig>({})
