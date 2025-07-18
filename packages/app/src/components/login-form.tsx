import { ArrowPathIcon } from "@heroicons/react/20/solid"
import React from "react"
import { Auth } from "@/auth"
import { Button } from "@/components/Button"
import { Logo } from "@/components/Logo"
import { GoogleIcon } from "./icon/google"

export const LoginForm = () => {
	const [pending, setPending] = React.useState(false)

	function login() {
		setPending(true)
		Auth.login(location.pathname)
	}

	return (
		<div className="flex h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10 overflow-hidden bg-white">
			<div className="flex flex-col gap-6 w-full max-w-sm items-center">
				<Logo className="size-16" />

				<Button
					type="submit"
					className="w-full"
					onClick={login}
					disabled={pending}
				>
					{pending ? (
						<ArrowPathIcon className="size-5 animate-spin" />
					) : (
						<>
							Login With Google <GoogleIcon className="size-5 mt-0.5" />
						</>
					)}
				</Button>
			</div>
		</div>
	)
}
