"use server"    

import { redirect } from "next/navigation";
import { getAllBranches } from "../../../../lib/branch"
import BranchPageWrapper from "./BranchPageWrapper";
import { requireUser } from "../../../../lib/user";

export default async function Branch () {

    const user = await requireUser()
    const branches = await getAllBranches();

    return <BranchPageWrapper branches={branches}/>
}