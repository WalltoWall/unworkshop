export const XCircleIcon = (props: React.ComponentPropsWithoutRef<"svg">) => {
	return (
		<svg viewBox="0 0 22 22" {...props}>
			<g fill="none" fillRule="evenodd">
				<path d="M0 0h22v22H0z" />
				<circle
					cx="10.5"
					cy="10.5"
					r="8.5"
					stroke="#000"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					stroke="#000"
					strokeLinecap="round"
					strokeLinejoin="round"
					d="m13 8-5 5M13 13 8 8"
				/>
			</g>
		</svg>
	)
}
