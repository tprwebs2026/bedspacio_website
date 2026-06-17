"use server"

import DashboardPageWrapper from "./(dashboard_components)/DashboardPageWrapper"
import { requireUser } from "../../../lib/user"
import { getBestRooms, getInquiryStageCounts, getNewLeadInquiries } from "../../../lib/dashboard";

export type InquiryType = {
    inq_status: string,
    count: number
}

export type RecentInquiryType = {
    id: number,
    reference_number: string,
    fullname: string,
    inq_status: string,
    created_at: string
}

export type BestRoomType = {
    id: number,
    room_uuid: string,
    title: string,
    type: string,
    inquiry_count: number
}




export default async function Dashboard () {

    const user = await requireUser();

    // Gives the count for each stages -- used for counting each stage on Inquiries table on database //
    const stageCounts = await getInquiryStageCounts();
    const recent = await getNewLeadInquiries();
    const bestRooms = await getBestRooms('bedspace');

    return <DashboardPageWrapper 
        inquiries={stageCounts}
        recentInquiries={recent}
        bestRooms={bestRooms}
    />
}   