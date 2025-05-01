type Props = {
	condition: boolean
	children: React.ReactNode
	wrap: (props: { children: React.ReactNode }) => JSX.Element
}

/**
 * A component that allows you to conditionally wrap its children based on the
 * provided `condition` prop. The wrapper is determined via the React component
 * passed to the `wrap` prop.
 *
 * See examples for usage:
 *
 * @example
 * ### Truthy
 * In this case, `condition` is `true` so the `<div>` is wrapped by an `<a>`
 * .
 * ```
 * <ConditionalWrap wrap={({ children }) => <a>{children}</a>} condition={true}>
 *     <div>Hello World!</div>
 * </ConditionalWrap>
 *
 * // Result
 * <a>
 *     <div>Hello World!</div>
 * </a>
 * ```
 *
 * @example
 * ### Falsey
 * In this case, `condition` is `false` so the `<div>` is rendered as-is.
 * ```
 * <ConditionalWrap wrap={({ children }) => <a>{children}</a>} condition={false}>
 *     <div>Hello World!</div>
 * </ConditionalWrap>
 *
 * // Result
 * <div>Hello World!</div>
 * ```
 */
export const ConditionalWrap = ({ condition, children, wrap: Wrap }: Props) => {
	if (condition) return <Wrap>{children}</Wrap>

	return children
}
