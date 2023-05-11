import Image from "next/image"
import { Text } from "@/components/Text"
import { Arrow } from "@/components/icons/Arrow"
import { findKickoffOrThrow } from "@/sanity/client"
import Link from "next/link"

import brainstormIllustration from "@/assets/images/brainstorm-illustration.jpg"

const ExercisesPage = async (props: { params: { code: string } }) => {
	const kickoff = await findKickoffOrThrow(props.params.code)

	return (
		<div>
			<Text style="heading" size={40}>
				Exercises
			</Text>

			<ul className="mt-6 grid gap-4">
				{kickoff.exercises.map((exercise) => (
					<li key={exercise._id}>
						<Link
							href={`/kickoff/${kickoff.code.current}/exercises/${exercise.slug.current}`}
							className="relative grid aspect-[289/160] grid-cols-[4fr,6fr] overflow-hidden rounded-lg bg-gradient-to-r from-[#4BEEE1] to-[#E477D1]"
						>
							<div className="self-end pb-4 pl-3">
								<Text style="heading" size={24}>
									{exercise.name}
								</Text>

								<div className="mt-3 flex items-center gap-1">
									<Text style="copy" size={16}>
										Start Exercise
									</Text>

									<Arrow className="w-3" />
								</div>
							</div>

							<Image
								src={brainstormIllustration}
								alt=""
								placeholder="blur"
								className="absolute right-0 top-0 h-[128%] -translate-y-[3%] translate-x-[28%] -rotate-[17deg] object-contain mix-blend-multiply"
							/>
						</Link>
					</li>
				))}
			</ul>
		</div>
	)
}

export const metadata = {
	title: "Exercises - W|W Workshop",
}

export default ExercisesPage
