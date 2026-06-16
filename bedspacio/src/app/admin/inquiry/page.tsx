"use server"

import InquiryPageWrapper from "./InquiryPageWrapper"
import { getAllInquiry, getRoomID } from "../../../../lib/inquiry"
import { requireUser } from "../../../../lib/user";

export type InquiryPageType = {
    id: number,
    reference_number: string,
    fullname: string,
    contact_number: string,
    type: string,
    ghl_status: string,
    ghl_pipeline_stage: string,
    created_at: string,
}

export type Pagination = {
    page: number,
    limit: number,
    total: number,
    totalPages: number
}

type InquiryLogsType = {
    id: number,
    note: string,
    noter: string,
    noted_at: string
}

export type InquiryModalType = {
    id: number,
    room_uuid: string,
    room_id: number,
    reference_number: string,
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
    ghl_status: string,
    ghl_pipeline_stage: string,
    ip_address: string,
    created_at: string,
    inquiry_logs: InquiryLogsType[]
}

export default async function Inquiry({
    searchParams
}: {
    searchParams: Promise<{
        ghl_status?: string;
        page?: string;
        search?: string
    }>
}) {

    const user = await requireUser(); 
    

    const params = await searchParams;
    const clean = (v?: string) =>
        v && v.trim() !== "" ? v : undefined;

    const page = Number(params?.page || 1);

    const response = await getAllInquiry({
        ghl_status: clean(params.ghl_status),
        page,
        search: clean(params.search),
    });

    const roomUUIDs = await getRoomID();
    

    return (
        <InquiryPageWrapper
            inquiries={response.data}
            pagination={response.pagination}
            currentStatus={params?.ghl_status ?? ""}
            roomUUIDs={roomUUIDs}
        />
    );
}




// --------------- Website FALLBACK if GoHighLevel is not integrated ------------------ //


// "use server"

// import InquiryPageWrapper from "./InquiryPageWrapper"
// import { getAllInquiries, getRoomID } from "../../../../lib/inquiry"
// import { requireUser } from "../../../../lib/user";

// export type InquiryPageType = {
//     id: number,
//     reference_number: string,
//     fullname: string,
//     contact_number: string,
//     type: string,
//     inq_status: string,
//     created_at: string,
// }

// export type Pagination = {
//     page: number,
//     limit: number,
//     total: number,
//     totalPages: number
// }

// type InquiryLogsType = {
//     id: number,
//     note: string,
//     noter: string,
//     noted_at: string
// }

// // ------------ fallback if GHL is NOT integrated - 6-8-2026

// export type InquiryModalType = {
//     id: number,
//     room_uuid: string,
//     room_id: number,
//     reference_number: string,
//     fullname: string,
//     email: string,
//     contact_number: string,
//     subject: string,
//     work_schedule: string,
//     target_move_in: string,
//     months_of_stay: number,
//     message: string,
//     type: string,
//     inq_status: string,
//     ip_address: string,
//     created_at: string,
//     inquiry_logs: InquiryLogsType[]
// }



// export default async function Inquiry({
//     searchParams
// }: {
//     searchParams: Promise<{
//         inq_status?: string;
//         page?: string;
//         search?: string
//     }>
// }) {

//     const user = await requireUser(); 
    

//     const params = await searchParams;
//     const clean = (v?: string) =>
//         v && v.trim() !== "" ? v : undefined;

//     const page = Number(params?.page || 1);

//     const response = await getAllInquiries({
//         inq_status: clean(params.inq_status),
//         page,
//         search: clean(params.search),
//     });

//     const roomUUIDs = await getRoomID();
    

//     return (
//         <InquiryPageWrapper
//             inquiries={response.data}
//             pagination={response.pagination}
//             currentStatus={params?.inq_status ?? ""}
//             roomUUIDs={roomUUIDs}
//         />
//     );
// }

