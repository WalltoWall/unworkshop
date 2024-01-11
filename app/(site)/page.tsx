import { redirect } from "next/navigation"
import { zfd } from "zod-form-data"
import { Button } from "@/components/Button"
import { DarkLayout } from "@/components/DarkLayout"
import { Text } from "@/components/Text"

const FormSchema = zfd.formData({ code: zfd.text() })

async function navigateToWorkshop(data: FormData) {
	"use server"

	const form = FormSchema.parse(data)
	redirect(`/kickoff/${form.code.toLowerCase()}`)
}

const Home = () => {
	return (
		<DarkLayout>
			<div className="px-7">
				<Text style="heading" size={40} className="max-w-[206px] text-right">
					Brand WWorkshop
				</Text>
			</div>

			<div className="space-y-4 px-7 py-8 text-center">
				<Text style="heading" size={24}>
					Enter your group code
				</Text>

				<form className="flex flex-col space-y-1.5" action={navigateToWorkshop}>
					<input
						type="text"
						name="code"
						className="w-full rounded-2xl bg-gray-75 px-4 pb-2 text-center align-middle uppercase text-black text-56 leading-none font-heading placeholder:text-gray-38"
						placeholder="WTW-1234"
						required
					/>

					<Button size="sm" color="gray" outline>
						Continue
					</Button>
				</form>
			</div>
		</DarkLayout>
	)
}

export default Home
