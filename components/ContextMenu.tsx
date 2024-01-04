import * as Context from "@radix-ui/react-context-menu"

interface ContextMenuProps extends React.ComponentPropsWithoutRef<"div"> {
	items: Array<string>
}

export const ContextMenu = ({ children, items }: ContextMenuProps) => {
	return (
		<Context.Root>
			<Context.Trigger>{children}</Context.Trigger>

			<Context.Portal>
				<Context.Content className="flex min-w-[120px] flex-col gap-3 overflow-hidden rounded-lg bg-black px-3 py-2.5">
					{items &&
						items.map((item, idx) => (
							<Context.Item key={idx} className="hover:bg-yellow-58">
								<p className="text-white text-14 leading-[1.07] font-sans">
									{item}
								</p>
							</Context.Item>
						))}
				</Context.Content>
			</Context.Portal>
		</Context.Root>
	)
}
