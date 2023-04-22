import { Logo } from "@/components/Logo"
import { Text } from "@/components/Text"
import { ExerciseCodeForm } from "./ExerciseCodeForm"

const Home = () => {
	return (
		<main
			id="main"
			className="dynamic-screen overflow-hidden bg-black text-white"
		>
			<div className="mx-auto flex h-full max-w-md flex-col justify-between">
				<Logo className="relative -right-10 -top-10 ml-auto w-[325px]" />

				<div className="px-7">
					<Text style="heading" size={40} className="max-w-[206px] text-right">
						Brand WWorkshop
					</Text>
				</div>

				<ExerciseCodeForm />
			</div>
		</main>
	)
}

export default Home
