export const Arrow = (props: React.ComponentPropsWithoutRef<"svg">) => {
	return (
		<svg viewBox="0 0 14 12" {...props}>
			<g fill="none" fillRule="evenodd" stroke="currentColor" strokeWidth={1.5}>
				<path strokeLinecap="round" strokeLinejoin="round" d="M0 6h14" />
				<path strokeLinecap="square" d="m8 0 6 6-6 6" />
			</g>
		</svg>
	)
}
