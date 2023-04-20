"use client"

import { NextStudioLoading } from "next-sanity/studio/loading"
import config from "@/sanity.config"

const Loading = () => {
	return <NextStudioLoading config={config} />
}

export default Loading
