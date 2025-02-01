import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import registerIllustration from "@/assets/images/register-illustration.jpg"
import { Logo } from "@/components/Logo"
import { Text } from "@/components/Text"
import { Api } from "@/sanity/client"
import { RegisterForm } from "./register-form"

type Params = { code: string }
type Props = { params: Promise<Params> }

export default async function KickoffRegisterPage(props: Props) {
	const params = await props.params
	const kickoff = await Api.getKickoff(params.code)
	if (!kickoff) notFound()

	return (
		<div className="flex grow flex-col justify-between gap-8">
			<div>
				<Text style="heading" size={64} className="!normal-case">
					{kickoff.greeting}
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

				<Image src={registerIllustration} className="mt-4" alt="" priority />
			</div>

			<RegisterForm kickoffCode={params.code} />
		</div>
	)
}

export const metadata: Metadata = { title: "Register" }
