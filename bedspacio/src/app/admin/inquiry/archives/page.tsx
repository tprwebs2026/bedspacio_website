"use server"

import { getAllArchivedInquiries } from "../../../../../lib/inquiry"
import { requireUser } from "../../../../../lib/user"
import ArchivePageWrapper from "./ArchivePageWrapper"


export type ArchiveType = {
    id: number,
    type: string,
    fullname: string,
    contact_number: string,
    inq_status: string,
    created_at: string,
    updated_at: string
}


type InquiryLogsType = {
    id: number,
    note: string,
    noter: string,
    noted_at: string
}

export type ArchiveModalType = {
    id: number,
    room_uuid: string,
    room_id: number,
    fullname: string,
    email: string,
    contact_number: string,
    subject: string,
    work_schedule: string,
    target_move_in: string,
    months_of_stay: number,
    message: string,
    type: string,
    inq_status: string,
    ip_address: string,
    created_at: string,
    inquiry_logs: InquiryLogsType[]
}

export default async function ArchivePage () {

    // checks if a user is logged in
    const user = await requireUser()
    
    const archives = await getAllArchivedInquiries()

    return (
        <ArchivePageWrapper 
            archives={archives}
        />
    )
}