type Props = Omit<
	React.ComponentProps<"img">,
	"src" | "alt" | "width" | "height"
>

export const Logo = (props: Props) => {
	return (
		<img {...props} src="/images/logo.svg" width={47} height={47} alt="Un" />
	)
}
