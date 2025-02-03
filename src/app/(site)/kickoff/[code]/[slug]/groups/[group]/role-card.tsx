import Image, { type StaticImageData } from "next/image"
import { cx } from "class-variance-authority"
import { text } from "@/styles/text"

interface Props {
	className?: string
	name: string
	instructions: string
	img: StaticImageData
	onClick: React.MouseEventHandler<HTMLButtonElement>
}

export const RoleCard = ({
	onClick,
	className,
	name,
	instructions,
	img,
}: Props) => {
	return (
		<button
			className={cx(
				"hover:bg-brand relative flex min-h-[200px] flex-col rounded-lg border border-black p-4 text-left transition duration-200",
				className,
			)}
			onClick={onClick}
		>
			<Image src={img} alt="" className="absolute top-2 right-2" priority />

			<h3
				className={text({
					class: "relative mt-auto",
					style: "heading",
					size: 32,
				})}
			>
				{name}
			</h3>

			<p className="relative">{instructions}</p>
		</button>
	)
}
