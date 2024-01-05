import { PencilCircle } from "@/components/icons/PencilCircle"
import { Text } from "@/components/Text"

interface RoleHeaderProps {
	role: "captain" | "contributor"
	group: string
}

export const RoleHeader = ({ role, group }: RoleHeaderProps) => (
	<div className="-mx-7 -mt-3.5 mb-6 flex items-center justify-center bg-gray-50 p-4 text-white">
		<PencilCircle className="mr-1 w-5" />
		<Text size={16}>
			You're{" "}
			{role === "captain" ? (
				<>
					the <strong>Captain</strong>
				</>
			) : (
				<>
					a <strong>Contributor</strong>
				</>
			)}{" "}
			of <strong>{group}</strong>
		</Text>
	</div>
)
