'use server'

import { sanity } from "@/sanity/client"
import z from 'zod'

export interface Participant {
  id: string
  answers: {
    [workshopCode: string]: {
        meta: {
          type: "group" | "individual"
          leaderId: string
        }
    }
  }
}

export interface Exercise {
  groups?: Array<{name: string, leaderId?: string}>
}


export async function submitResponse(formData: FormData) {
    console.log(formData)  

    sanity.patch('').setIfMissing({answers: }).commit().then((answers) => {
      console.log("updated answers object")
    }).catch((err) => {
      console.error("Somethings wrong while patching", err.message)
    })
}