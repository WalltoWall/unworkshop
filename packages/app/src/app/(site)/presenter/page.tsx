import React from "react"
import { DarkLayout } from "@/components/dark-layout"
import { UnworkshopTitle } from "@/components/unworkshop-title"
import { text } from "@/styles/text"
import { CodeForm } from "../code-form"

export default function PresenterHome() {
	return (
		<DarkLayout>
			<UnworkshopTitle className="mx-auto w-[15.625rem]" />

			<div className="space-y-4 px-4 pt-8 pb-10 text-center">
				<h1
					className={text({ style: "heading", size: 24, class: "text-center" })}
				>
					Presenter
				</h1>

				<CodeForm type="presenter" />
			</div>
		</DarkLayout>
	)
}
