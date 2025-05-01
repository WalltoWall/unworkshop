import registerIllustration from "@/assets/images/register-illustration.jpg"
import { Logo } from "@/components/Logo"
import { Text } from "@/components/Text"
import { Participant } from "@/participant"
import z from "zod"
import { RegisterInput } from "./input"
import { getRouteApi } from "@tanstack/react-router"

const route = getRouteApi("/kickoff/$code")

export const RegisterForm = () => {
	const data = route.useLoaderData()

	function action(data: FormData) {
		const name = z.string().parse(data.get("name"))
		Participant.create(name)
	}

	return (
		<form className="flex grow flex-col justify-between gap-8" action={action}>
			<div>
				<Text style="heading" size={64} className="!normal-case">
					{data.kickoff.greeting}
				</Text>

				<div className="flex w-full flex-wrap items-center">
					<Text size={64} style="heading" className="!normal-case">
						Let's
					</Text>

					<div className="ml-3 flex items-center">
						<Logo className="-mr-1.5 w-[53px] rotate-6" />
						<Text size={64} style="heading" className="!normal-case">
							ravel
						</Text>
					</div>
				</div>

				<Text size={64} style="heading" className="!normal-case">
					your brand.
				</Text>

				<img
					src={registerIllustration}
					className="mt-4"
					alt=""
					loading="lazy"
				/>
			</div>

			<div className="flex flex-col items-center gap-3 text-center">
				<Text style="heading" size={24} asChild className="text-green-40">
					<h2>Let's get started</h2>
				</Text>

				<RegisterInput />

				<Text style="copy" size={12} className="text-gray-500">
					Don't worry, your answers will be anonymous.
				</Text>
			</div>
		</form>
	)
}
