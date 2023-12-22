/**
 * This file contains small GROQ query fragments that can be used to compose
 * larger queries throughout the project.
 */
import { groq } from "next-sanity"

export const linkFragment = groq`
    ...,
    !external => {
        page->{slug, title}
    }
`
export const imageBlurFragment = groq`
    ...,
    asset->{ 
        _id, 
        _type, 
        metadata { lqip }
    }
`
export const richTextFragment = groq`
    ...,
    markDefs[] {
        ...,
        _type == 'inlineLink' => { ${linkFragment} }
    }
`
