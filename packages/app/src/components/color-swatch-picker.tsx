import { cva, cx, type VariantProps } from "class-variance-authority"
import { Colors } from "@/colors"

export const swatchStyles = cva(
	"border-presenter rounded-full transition duration-300 ease-out shrink-0",
	{
		variants: {
			size: {
				small: "size-4 border",
				default: "size-5 border-2",
				large: "size-6 border-3",
			},
			hover: {
				true: "hover:scale-120",
			},
			active: {
				true: "bg-black",
				false: "bg-presenter",
			},
		},
		defaultVariants: {
			size: "default",
			hover: true,
			active: false,
		},
	},
)

type Props = {
	activeColor?: Colors.Variant
	onSwatchClick: (color: Colors.Variant) => void
} & VariantProps<typeof swatchStyles>

export const ColorSwatchPicker = ({
	activeColor,
	size,
	hover,
	onSwatchClick,
}: Props) => {
	return Colors.variants.map((v) => (
		<button
			key={v}
			style={Colors.style(v)}
			className={swatchStyles({
				size,
				hover,
				active: activeColor === v,
			})}
			onClick={() => onSwatchClick?.(v)}
		>
			<span className="sr-only">Change color to {v}</span>
		</button>
	))
}
