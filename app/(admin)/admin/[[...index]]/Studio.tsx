"use client"

import { NextStudio } from "next-sanity/studio"
import config from "@/sanity/config"

export const Studio = () => {
	//@ts-ignore
	return <NextStudio config={config} />
}
