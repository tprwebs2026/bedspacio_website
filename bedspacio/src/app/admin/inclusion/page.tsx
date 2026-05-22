"use server"

import { redirect } from "next/navigation";
import InclusionPageWrapper from "./InclusionPageWrapper"
import { getInclusions } from "../../../../lib/inclusion"
import { requireUser } from "../../../../lib/user";

export default async function Inclusions () {
    const user = await requireUser();
    const inclusions = await getInclusions();

    return <InclusionPageWrapper inclusions={inclusions} />
}