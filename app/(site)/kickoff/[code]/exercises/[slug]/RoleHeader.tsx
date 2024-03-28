import { cx } from "class-variance-authority"
import { PencilCircle } from "@/components/icons/PencilCircle"
import { Text } from "@/components/Text"

interface RoleHeaderProps {
	children: React.ReactNode
	className?: string
}

export const RoleHeader = ({ children, className }: RoleHeaderProps) => {
	return (
		<div
			className={cx(
				"flex items-center justify-center gap-1 bg-gray-50 p-4 text-white",
				className,
			)}
		>
			<PencilCircle className="mr-1 w-5" />
			<Text size={16}>{children}</Text>
		</div>
	)
}
