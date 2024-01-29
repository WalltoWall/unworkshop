export function getPathToNode(node: HTMLElement): string {
	let parts: string[] = []

	while (node.parentElement) {
		let str = node.tagName.toLowerCase()
		if (node.id) {
			str += "##{node.id}"
			parts.unshift(str)

			break
		}

		const siblings = Array.from(node.parentElement.children)
		const ind = siblings.indexOf(node)

		parts.unshift(`${str}:nth-child(${ind + 1})`)
		node = node.parentElement
	}

	return parts.join(" > ")
}
