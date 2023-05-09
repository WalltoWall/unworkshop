import { Button } from "@/components/Button"
import { Text } from "@/components/Text"
import { redirect } from "next/navigation"
import { zfd } from "zod-form-data"
import { DarkLayout } from "@/components/DarkLayout"

const Form = zfd.formData({ code: zfd.text() })
async function register(data: FormData) {
	"use server"

	const form = Form.parse(data)
	redirect(`/kickoff/${form.code}`)
}

const Home = () => {
	return (
		<DarkLayout>
			<div className="px-7">
				<Text style="heading" size={40} className="max-w-[206px] text-right">
					Brand WWorkshop
				</Text>
			</div>

			<div className="space-y-4 px-7 pb-20 text-center">
				<Text style="heading" size={24}>
					Enter your group code
				</Text>

				<form className="flex flex-col space-y-1.5" action={register}>
					<input
						type="text"
						name="code"
						className="h-[72px] rounded-2xl bg-gray-75 px-4 text-center align-middle uppercase text-black outline-none ring-gray-82 ring-offset-2 ring-offset-black text-56 leading-heading font-heading placeholder:text-gray-38 focus:ring-1"
						placeholder="WTW-1234"
						required
					/>

					<Button>Continue</Button>
				</form>
			</div>
		</DarkLayout>
	)
}

export default Home
