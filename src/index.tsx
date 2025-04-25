import "./index.css"
import ReactDOM from "react-dom/client"
import { router } from "./router"
import { RouterProvider } from "@tanstack/react-router"

const root = document.getElementById("root")
if (root) {
	ReactDOM.createRoot(root).render(<RouterProvider router={router} />)
}
