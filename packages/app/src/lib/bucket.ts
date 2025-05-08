export function bucket<T>(items: T[], n: number): T[][] {
	const result: T[][] = Array.from({ length: n }, () => [])

	for (let i = 0; i < items.length; i++) {
		const idx = i % n
		result[idx]!.push(items[i]!)
	}

	return result
}
