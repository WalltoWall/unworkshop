import clsx from "clsx"
import { match } from "ts-pattern"
import { Text } from "@/components/Text"
import type {
	FormField,
	FormFieldAnswer,
	FormParticipant,
	ListFieldAnswer,
	NarrowFieldAnswer,
	TaglineFieldAnswer,
	TextFieldAnswer,
} from "@/app/(site)/kickoff/[code]/exercises/[slug]/FormsExercise/types"

const ShortListResponses = (props: {
	responses: string[]
	className?: string
}) => (
	<ul className={clsx(props.className, "flex flex-wrap gap-2")}>
		{props.responses.map((resp) => (
			<Text
				key={resp}
				className="rounded-lg bg-black px-3 py-2 text-white capsize"
				asChild
				style="copy"
				size={14}
			>
				<li>{resp}</li>
			</Text>
		))}
	</ul>
)

const ListResponseCard = (props: ResponseCardProps<ListFieldAnswer>) => {
	return (
		<div className="max-w-[25rem] rounded-2xl bg-gray-90 p-5">
			<Text asChild style="heading" size={24}>
				<h4>{props.participant.name}</h4>
			</Text>

			{props.answer.groups.map((g, idx) => (
				<div key={idx}>
					{g.label && (
						<Text asChild style="heading" size={18}>
							<h5>{g.label}</h5>
						</Text>
					)}

					<ShortListResponses responses={g.responses} className="mt-4" />
				</div>
			))}
		</div>
	)
}

const NarrowResponseCard = (props: ResponseCardProps<NarrowFieldAnswer>) => {
	return <div>response field answer</div>
}

const TextResponseCard = (props: ResponseCardProps<TextFieldAnswer>) => {
	return <div>text field answer</div>
}

const TaglineResponseCard = ({
	participant,
	answer,
	exerciseId,
	field,
}: ResponseCardProps<TaglineFieldAnswer>) => {
	if (!field.source?.step || !field.source.field) {
		throw new Error("Invalid tagline source field")
	}

	const sourceAnswer = participant.answers?.[exerciseId]?.steps
		.at(field.source.step - 1)
		?.data.at(field.source.field - 1)

	if (!sourceAnswer || sourceAnswer.type !== "List") {
		throw new Error("Invalid resolved tagline source answer.")
	}

	return (
		<div className="max-w-[25rem] rounded-2xl bg-gray-90 p-5">
			<Text asChild style="heading" size={24}>
				<h4>{participant.name}</h4>
			</Text>

			<ShortListResponses
				responses={sourceAnswer.groups.at(0)?.responses ?? []}
				className="mt-4"
			/>

			<ul className="mt-6 space-y-8">
				{answer.responses.map((resp) => (
					<Text key={resp} asChild size={18}>
						<li>{resp}</li>
					</Text>
				))}
			</ul>
		</div>
	)
}

type ResponseCardProps<T extends FormFieldAnswer = FormFieldAnswer> = {
	answer: T
	participant: FormParticipant
	field: FormField
	exerciseId: string
}

export const ResponseCard = (props: ResponseCardProps) => {
	return match(props.answer)
		.with({ type: "List" }, (answer) => (
			<ListResponseCard {...props} answer={answer} />
		))
		.with({ type: "Narrow" }, (answer) => (
			<NarrowResponseCard {...props} answer={answer} />
		))
		.with({ type: "Text" }, (answer) => (
			<TextResponseCard {...props} answer={answer} />
		))
		.with({ type: "Tagline" }, (answer) => (
			<TaglineResponseCard {...props} answer={answer} />
		))
		.exhaustive()
}
