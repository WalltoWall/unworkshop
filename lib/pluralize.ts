type Expressions =
	| [quantity: number]
	| [quantity: number, formatFunction: (qty: number) => string]

/**
 * Template tag that formats pluralization tokens based on the quantities
 * injected into the string.
 *
 * @param strings - Template string.
 * @param exps - The expressions to evaluate.
 *
 * @example
 * ### Simple Case
 * Pluralization tokens have the form "[singular|plural]" and are resolved using
 * the first expression found to the left of each token or, if no
 * left-expression is available, the first expression to the right.
 * ```
 * pluralize`I have ${1} kitt[en|ies]`; // ⇨ 'I have 1 kitten'
 * pluralize`I have ${3} kitt[en|ies]`; // ⇨ 'I have 3 kitties'
 * ```
 *
 *  @example
 *  ### Multiple Tokens
 * ```
 *  pluralize`There [is|are] ${1} fox[|es] and ${4} octop[us|i]`; // ⇨ 'There is 1 fox and 4 octopi'
 *  pluralize`There [is|are] ${4} fox[|es] and ${1} octop[us|i]`; // ⇨ 'There are 4 foxes and 1 octopus'
 * ```
 *
 * @example
 * ### Custom quantities
 * Quantity values may be customized using value of the form, [quantity, format function].
 * ```
 * function format(qty) {
 *  return qty == 1 ? 'sole' :
 *      qty == 2 ? 'twin' :
 *      qty;
 *  }
 *
 *  pluralize`Her ${[1, format]} br[other|ethren] left`; // ⇨ 'Her sole brother left'
 *  pluralize`Her ${[2, format]} br[other|ethren] left`; // ⇨ 'Her twin brethren left'
 *  pluralize`Her ${[3, format]} br[other|ethren] left`; // ⇨ 'Her 3 brethren left'
 * ```
 */
export function pluralize(
	strings: TemplateStringsArray,
	...exps: Expressions[]
): string {
	const result = []
	const { isArray } = Array

	// Convert quantity expressions to [quantity, quantity string] tuples
	exps.forEach((v, i) => {
		if (typeof v === "number") {
			exps[i] = [v, v]
		} else if (isArray(v)) {
			if (typeof v[0] === "number") {
				// @ts-ignore
				exps[i] = [v[0], typeof v[1] === "function" ? v[1](v[0]) : null]
			} else {
				// Edge case where the caller injects an Array but doesn't intend for it
				// to be treated as a quantity.  Not worth solving at present.
				throw TypeError("First item in array must be a Number")
			}
		}
	})

	// Initialize the quantity to use for pluralization
	let qty = exps.find(isArray)
	let last

	for (let s of strings) {
		// Trim leading whitespace hidden quantities
		if (isArray(last) && last[1] == null) {
			s = s.replace(/^\s+/, "")
		}

		// Push current string, pluralizing if we have a valid quantity
		if (qty) {
			result.push(
				s.replace(/\[([^|]*)\|([^\]]*)\]/g, qty[0] == 1 ? "$1" : "$2"),
			)
		} else {
			result.push(s)
		}

		if (!exps.length) break

		// Locate next quantity
		qty = exps.find(isArray) || qty

		// Push quantity string
		last = exps.shift()
		result.push(last === qty ? qty![1] : last)
	}

	return result.join("")
}
