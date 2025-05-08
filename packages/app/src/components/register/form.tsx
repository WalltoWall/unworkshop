import registerIllustration from "@/assets/images/register-illustration.jpg"
import { Logo } from "@/components/Logo"
import { Participant } from "@/participant"
import z from "zod"
import { RegisterInput } from "./input"
import { getRouteApi } from "@tanstack/react-router"
import { text } from "@/styles/text"

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
				<h1
					className={text({
						style: "heading",
						size: 64,
						class: "!normal-case",
					})}
				>
					{data.kickoff.greeting}
				</h1>

				<div className="flex w-full flex-wrap items-center">
					<div
						className={text({
							size: 64,
							style: "heading",
							class: "!normal-case",
						})}
					>
						Let's
					</div>

					<div className="ml-3 flex items-center">
						<Logo className="-mr-1.5 w-[53px] rotate-6" />
						<div
							className={text({
								size: 64,
								style: "heading",
								class: "!normal-case",
							})}
						>
							ravel
						</div>
					</div>
				</div>

				<div
					className={text({
						size: 64,
						style: "heading",
						class: "!normal-case",
					})}
				>
					your brand.
				</div>

				<img
					src={registerIllustration}
					className="mt-4"
					alt=""
					loading="lazy"
				/>
			</div>

			<div className="flex flex-col items-center gap-3 text-center">
				<h2
					className={text({
						class: "text-brand",
						size: 24,
						style: "heading",
					})}
				>
					Let's get started
				</h2>

				<RegisterInput />

				<p
					className={text({
						class: "text-neutral-500",
						size: 12,
						style: "copy",
					})}
				>
					Don't worry, your answers will be anonymous.
				</p>
			</div>
		</form>
	)
}
