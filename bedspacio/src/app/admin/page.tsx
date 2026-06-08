"use server"

import DashboardPageWrapper from "./(dashboard_components)/DashboardPageWrapper"
import { requireUser } from "../../../lib/user"
import { getBestRooms, getInquiryCounts, getRecentInquiries } from "../../../lib/dashboard";

export type InquiryType = {
    ghl_status: string,
    count: number
}

// export type RecentInquiryType = {
//     id: number,
//     room_uuid: string,
//     fullname: string,
//     target_move_in: string,
//     ghl_status: string,
//     created_at: string
// }

// aligned with GHL 
// removed target_move_in and replaced by ghl_pipeline_stage
export type RecentInquiryType = {
    id: number,
    reference_number: string,
    fullname: string,
    ghl_pipeline_stage: string,
    ghl_status: string,
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
    const inquiries = await getInquiryCounts();
    const recent = await getRecentInquiries();
    const bestRooms = await getBestRooms('bedspace');

    return <DashboardPageWrapper 
        inquiries={inquiries}
        recentInquiries={recent}
        bestRooms={bestRooms}
    />
}   