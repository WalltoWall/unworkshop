import { Logo } from "@/components/Logo"
import { Button } from "@/components/Button"
import { Auth } from "@/auth"

export const LoginForm = () => {
	return (
		<div className="flex h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10 overflow-hidden bg-white">
			<div className="flex flex-col gap-6 w-full max-w-sm items-center">
				<Logo className="size-16" />

				<Button
					type="submit"
					className="w-full"
					onClick={() => Auth.login(location.pathname)}
				>
					Continue with Google
				</Button>
			</div>
		</div>
	)
}
