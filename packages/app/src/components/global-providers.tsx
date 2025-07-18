import { Tooltip } from "radix-ui"

export const GlobalProviders = (props: { children: React.ReactNode }) => {
	return (
		<Tooltip.Provider delayDuration={150}>{props.children}</Tooltip.Provider>
	)
}
