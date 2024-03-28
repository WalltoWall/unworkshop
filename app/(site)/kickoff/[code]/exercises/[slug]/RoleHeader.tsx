import { cx } from "class-variance-authority"
import { PencilCircle } from "@/components/icons/PencilCircle"
import { Text } from "@/components/Text"

interface RoleHeaderProps {
	children: React.ReactNode
	className?: string
}

export const RoleHeader = ({ children, className }: RoleHeaderProps) => {
	return (
		<div className={cx("bg-gray-50 p-4 text-white", className)}>
			<div className="mx-auto flex w-full max-w-64 items-center justify-start">
				<PencilCircle className="mr-1 w-5" />
				<Text size={16}>{children}</Text>
			</div>
		</div>
	)
}
