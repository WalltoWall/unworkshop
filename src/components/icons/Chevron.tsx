export const Chevron = (props: React.ComponentPropsWithoutRef<"svg">) => {
	return (
		<svg viewBox="0 0 10 18" fill="none" {...props}>
			<path
				d="M9 17L1 9L9 1"
				stroke="currentColor"
				strokeWidth={3}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	)
}
