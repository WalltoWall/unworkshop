import { stripIndent } from "common-tags"
import type { Answer } from "@/party/types"
import type { QuadrantsAnswer } from "./types"

export function assertQuadrantsAnswer(
	answer: Answer,
): asserts answer is QuadrantsAnswer {
	if (answer.type !== "quadrants") {
		throw new Error(stripIndent`
			Invalid answer found for this exercise. 
				Expected: "quadrants"
				Received: "${answer.type}"
		`)
	}
}
