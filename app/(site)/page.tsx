import { cx } from "class-variance-authority"
import styles from "./page.module.css"
import { Logo } from "@/components/Logo"
import { Text } from "@/components/Text"
import { Button } from "@/components/Button"

export default function Home() {
	return (
		<div
			className={cx(
				styles.dynamicHeight,
				"bg-black text-white flex flex-col overflow-hidden justify-between",
			)}
		>
			<Logo className="relative -top-10 ml-auto -right-10 w-11/12" />

			<div className="px-7">
				<Text style="heading" size={40} className="max-w-[206px] text-right">
					Brand WWorkshop
				</Text>
			</div>

			<div className="px-7 pb-20 space-y-4 text-center">
				<Text style="heading" size={24}>
					Enter your group code
				</Text>

				<form className="flex flex-col">
					<input type="text" name="code" />
					<Button>Continue</Button>
				</form>
			</div>
		</div>
	)
}
