import React from "react"
import dynamic from "next/dynamic"
import type * as ST from "@/sanity/types.gen"

const QuadrantsPresenterViewClient = dynamic(
	() => import("./QuadrantsPresenterViewClient"),
	{ ssr: false },
)

interface QuadrantsPresenterViewProps {
	exercise: ST.Exercise
}

export const QuadrantsPresenterView = async ({
	exercise,
}: QuadrantsPresenterViewProps) => {
	return (
		<div className="h-[calc(100vh-5.5rem)] px-8 py-12">
			<QuadrantsPresenterViewClient exercise={exercise} />
		</div>
	)
}
