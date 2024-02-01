export const Arrow = (props: React.ComponentPropsWithoutRef<"svg">) => {
	return (
		<svg {...props} viewBox="0 0 32 32">
			<g fill="none" fillRule="evenodd">
				<path d="M0 0h32v32H0z" />
				<path
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="3"
					d="M27 16H5M14 7l-9 9 9 9"
				/>
			</g>
		</svg>
	)
}
