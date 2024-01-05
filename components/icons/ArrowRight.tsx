export const ArrowRight = (props: React.ComponentPropsWithoutRef<"svg">) => {
	return (
		<svg viewBox="0 0 13 13" {...props}>
			<g fill="none" fillRule="evenodd">
				<path d="M0 0h13v13H0z" />
				<path
					stroke="currentColor"
					strokeLinecap="square"
					strokeWidth={2}
					d="M2 7h8M7 3l5 4-5 4"
				/>
			</g>
		</svg>
	)
}
