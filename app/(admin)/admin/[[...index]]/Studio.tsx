"use client"

import dynamic from "next/dynamic"
import config from "@/sanity/sanity.config"

const NextStudio = dynamic(
	() => import("next-sanity/studio").then((mod) => mod.NextStudio),
	{ ssr: false },
)

export const Studio = () => {
	return <NextStudio config={config} />
}
