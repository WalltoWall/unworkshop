import * as R from "remeda"

export const slugify = (s: string) => R.toKebabCase(s)
