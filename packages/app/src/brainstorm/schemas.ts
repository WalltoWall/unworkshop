export namespace BrainstormS {
	export type Sticky = { id: string; value: string }
	export type Answer = Record<string, Sticky[]>
	export type Shape = { groupAnswers: Record<string, Answer> }
}
