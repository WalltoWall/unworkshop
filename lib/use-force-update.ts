import React from "react"

export const useForceUpdate = (): (() => void) => {
	const [, dispatch] = React.useState<{}>(Object.create(null))

	return React.useCallback(() => dispatch(Object.create(null)), [dispatch])
}
