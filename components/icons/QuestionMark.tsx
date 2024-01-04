import type React from "react"

export const QuestionMark = (props: React.ComponentPropsWithoutRef<"svg">) => {
	return (
		<svg viewBox="0 0 12 12" {...props}>
			<path
				fill="#7F7F7F"
				fillOpacity=".5"
				fillRule="nonzero"
				d="M6 0a6 6 0 1 0 6 6 6.007 6.007 0 0 0-6-6Zm0 9.692a.692.692 0 1 1 0-1.384.692.692 0 0 1 0 1.384Zm.462-2.82v.051a.462.462 0 1 1-.924 0v-.461C5.538 6.207 5.745 6 6 6a1.154 1.154 0 1 0-1.154-1.154.462.462 0 1 1-.923 0 2.077 2.077 0 1 1 2.539 2.026Z"
			/>
		</svg>
	)
}
