"use server"

import InquiryPageWrapper from "./InquiryPageWrapper"
import { getAllInquiry } from "../../../../lib/inquiry"


export type InquiryPageType = {
    id: number,
    fullname: string,
    email: string,
    type: string,
    status: string,
    created_at: string
}

export type InquiryModalType = {
    id: number,
    room_uuid: string,
    room_id: number,
    fullname: string,
    email: string,
    contact_number: string,
    schedule: string,
    target_move_in: string,
    months_of_stay: number,
    message: string,
    type: string,
    status: string,
    ip_address: string,
    created_at: string
}

export default async function Inquiry () {

    const inquiries = await getAllInquiry();

    return <InquiryPageWrapper inquiries={inquiries}/>
    
}