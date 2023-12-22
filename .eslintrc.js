module.exports = {
	extends: ["next/core-web-vitals"],
	plugins: ["@typescript-eslint"],
	rules: {
		"@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
		"no-console": ["warn", { allow: ["warn", "error", "info"] }],
		"react/no-unescaped-entities": "off",
	},
}
