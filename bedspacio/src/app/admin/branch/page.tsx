"use server"    

import { getAllBranches } from "../../../../lib/branch"
import BranchPageWrapper from "./BranchPageWrapper";

export default async function Branch () {

    const branches = await getAllBranches();

    return <BranchPageWrapper branches={branches}/>
}