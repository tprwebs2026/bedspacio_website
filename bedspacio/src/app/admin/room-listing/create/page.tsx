"use server"

import CreateRoomPageWrapper from "./CreateRoomPageWrapper"

import { getInclusions } from "../../../../../lib/inclusion"
import { getBranchInfo } from "../../../../../lib/branch";
// import { GetPropertyManager } from "../../../../../lib/branch";

export default async function RoomWrapper () {

    const inclusions = await getInclusions();
    const branches = await getBranchInfo();
    // const managers = await GetPropertyManager();

    return (
        <CreateRoomPageWrapper 
            inclusions={inclusions}
            branches={branches}
            // managers={managers}
        />
    )
}