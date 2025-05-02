import { ConditionalWrap } from "@/components/conditional-wrap"
import { Logo } from "@/components/Logo"
import { Modal } from "@/components/modal"
import { ParticipantGreeting } from "@/components/participant-greeting"
import { RegisterForm } from "@/components/register/form"
import { Participant } from "@/participant"
import {
	createFileRoute,
	Link,
	notFound,
	Outlet,
	useParams,
} from "@tanstack/react-router"

export const Route = createFileRoute("/kickoff")({
	component: RouteComponent,
	head: () => ({
		meta: [
			{ name: "color-scheme", content: "light" },
			{ name: "theme-color", content: "#fff" },
		],
	}),
	loader: ({ location }) => {
		if (location.pathname === "/kickoff/") throw notFound()
	},
})

function RouteComponent() {
	const participant = Participant.useInfo()
	const params = useParams({ strict: false })

	return (
		<>
			<div className="mx-auto flex min-h-svh w-full max-w-[32rem] flex-col px-4 pb-16 text-black lg:pb-8">
				<header className="flex items-center justify-between gap-2 pt-4.5 pb-6">
					<ConditionalWrap
						condition={Boolean(params.code)}
						wrap={(props) => (
							// biome-ignore lint/style/noNonNullAssertion: Asserted by `condition`
							<Link to="/kickoff/$code" params={{ code: params.code! }}>
								{props.children}
							</Link>
						)}
					>
						<Logo className="w-[46px]" />
					</ConditionalWrap>

					<ParticipantGreeting />
				</header>

				<main id="main" className="flex grow flex-col">
					{participant ? <Outlet /> : <RegisterForm />}
				</main>
			</div>

			<Modal.Component />
		</>
	)
}
