import { Button } from "@/components/Button"
import { Text } from "@/components/Text"
import { DarkLayout } from "@/components/DarkLayout"

const NotFound = () => {
	return (
		<DarkLayout>
			<div className="my-auto space-y-4 px-7 pb-20">
				<Text style="heading" size={40}>
					Not Found
				</Text>

				<Button color="gray" outline size="sm" href="/">
					Go back
				</Button>
			</div>
		</DarkLayout>
	)
}

export default NotFound
