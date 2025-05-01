import { Auth } from "@/auth"
import { LoginForm } from "@/components/login-form"
import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/_authenticated")({
	component: RouteComponent,
})

function RouteComponent() {
	if (!Auth.isLoggedIn()) {
		return <LoginForm />
	}

	return <Outlet />
}
