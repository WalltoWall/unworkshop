type Props = Omit<
	React.ComponentProps<"img">,
	"src" | "alt" | "width" | "height"
>

export const UnworkshopTitle = (props: Props) => {
	return (
		<img
			{...props}
			src="/images/title.svg"
			width={255}
			height={108}
			alt="The Brand UnWorkshop. Look in. Stand Out."
		/>
	)
}
