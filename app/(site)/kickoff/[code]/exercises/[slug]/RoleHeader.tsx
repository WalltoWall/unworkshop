import { UndoIcon } from "lucide-react"
import { cx } from "class-variance-authority"
import { PencilCircle } from "@/components/icons/PencilCircle"
import { Text } from "@/components/Text"

interface RoleHeaderProps {
	children: React.ReactNode
	className?: string
	onClearClick?: () => void
}

export const RoleHeader = ({
	children,
	className,
	onClearClick,
}: RoleHeaderProps) => {
	return (
		<div
			className={cx(
				"relative flex items-center justify-center gap-1 bg-gray-50 py-4 pl-4 pr-10 text-white",
				className,
			)}
		>
			<PencilCircle className="mr-1 w-5" />
			<Text size={16}>{children}</Text>

			<button className="absolute right-4" onClick={onClearClick}>
				<span className="sr-only">Clear role.</span>
				<UndoIcon className="h-4 w-4" />
			</button>
		</div>
	)
}
