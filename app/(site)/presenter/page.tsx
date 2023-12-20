import { redirect } from "next/navigation"
import { zfd } from "zod-form-data"
import { Button } from "@/components/Button"
import { Text } from "@/components/Text"
import { PresenterHeader } from "./PresenterHeader"

const FormSchema = zfd.formData({ code: zfd.text() })

async function navigateToWorkshop(data: FormData) {
	"use server"

	const form = FormSchema.parse(data)
	redirect(`/presenter/${form.code}`)
}

const PresenterPage = () => {
	return (
		<>
			<PresenterHeader />
			<div className="space-y-4 px-7 py-8 text-center">
				<Text style="heading" size={24}>
					Enter your group code
				</Text>

				<form
					className="mx-auto flex max-w-lg flex-col space-y-1.5"
					action={navigateToWorkshop}
				>
					<input
						type="text"
						name="code"
						className="h-[4.5rem] w-full rounded-2xl bg-gray-75 px-4 text-center align-middle uppercase text-black text-56 leading-heading font-heading placeholder:text-gray-38"
						placeholder="WTW-1234"
						required
					/>

					<Button color="black">Continue</Button>
				</form>
			</div>
		</>
	)
}

export default PresenterPage
