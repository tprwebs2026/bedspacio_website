"use server"

import CreateRoomPageWrapper from "./CreateRoomPageWrapper"

import { getInclusions } from "../../../../../lib/inclusion"
import { getBranchInfo } from "../../../../../lib/branch";
// import { GetPropertyManager } from "../../../../../lib/branch";
import { getCurrentUser } from "../../../../../lib/user";
import { redirect } from "next/navigation";

export default async function RoomWrapper () {

    const inclusions = await getInclusions();
    const branches = await getBranchInfo();
    // const managers = await GetPropertyManager();
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        redirect('/login')
    }

    return (
        <CreateRoomPageWrapper 
            inclusions={inclusions}
            branches={branches}
            // managers={managers}
        />
    )
}