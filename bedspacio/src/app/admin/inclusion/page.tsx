"use server"

import InclusionPageWrapper from "./InclusionPageWrapper"
import { getInclusions } from "../../../../lib/inclusion"

export default async function Inclusions () {
    const inclusions = await getInclusions();

    return <InclusionPageWrapper inclusions={inclusions} />
}