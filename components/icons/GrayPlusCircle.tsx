import React from "react"

export const GrayPlusCircleIcon = (
	props: React.ComponentPropsWithoutRef<"svg">,
) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
			<g fill="none" fillRule="evenodd">
				<path d="M0 0h24v24H0z" />
				<circle
					cx="12.444"
					cy="12.444"
					r="8.889"
					stroke="#7F7F7F"
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="1.5"
				/>
				<path
					stroke="#7F7F7F"
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="1.5"
					d="M8.889 12.45H16M12.45 8.889V16"
				/>
			</g>
		</svg>
	)
}
