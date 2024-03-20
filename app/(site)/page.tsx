import { redirect } from "next/navigation"
import { zfd } from "zod-form-data"
import { DarkLayout } from "@/components/DarkLayout"
import { RegisterInput } from "@/components/RegisterInput"
import { Text } from "@/components/Text"
import { UnworkshopTitle } from "@/components/UnworkshopTitle"

const FormSchema = zfd.formData({ code: zfd.text() })

async function navigateToWorkshop(data: FormData) {
	"use server"

	const form = FormSchema.parse(data)

	const code = form.code.toLowerCase()

	if (code.includes("-")) return redirect(`/kickoff/${code}`)

	const newCode = code.slice(0, 3) + "-" + code.slice(3)

	redirect(`/kickoff/${newCode}`)
}

const Home = () => {
	return (
		<DarkLayout>
			<div className="mx-auto">
				<UnworkshopTitle className="w-[250px]" />
			</div>

			<div className="space-y-4 px-7 py-8 text-center">
				<Text style="heading" size={24}>
					Enter your group code
				</Text>

				<form
					className="flex flex-col space-y-1.5 pb-10"
					action={navigateToWorkshop}
				>
					<RegisterInput />
				</form>
			</div>
		</DarkLayout>
	)
}

export default Home
