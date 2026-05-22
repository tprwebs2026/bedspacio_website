"use server"

import { redirect } from "next/navigation";
import RoomViewPageWrapper from "./RoomViewPageWrapper"
import { getBranchInfo } from "../../../../../lib/branch"
import { getRoomById } from "../../../../../lib/room";
import { getInclusions } from "../../../../../lib/inclusion";
import { getCurrentUser } from "../../../../../lib/user";

export type InclusionViewType = {
    id: number,
    inclusion: string
} 

type PaymentTermViewType = {
    term: string,
    amount: number
}

export type ImageViewType = {
    id: number,
    image: string
}

export type BranchViewType = {
    branch_id: number,
    branch_name: string
    property_manager_id: number,
    property_manager: string
}


export type RoomViewType = {
    id: number,
    room_uuid: string,
    title: string,
    description: string,
    price: string,
    upper_deck_total: number,
    lower_deck_total: number,
    upper_deck_available: number,
    lower_deck_available: number,
    type: string,
    slot: number,
    capacity: number,
    payment_term: PaymentTermViewType[],
    gender: string,
    branch_id: number,
    images: ImageViewType[]
    inclusions: InclusionViewType[]
}

export default async function RoomViewPage ({ params }: { params: Promise<{ id: string }> }) {

    const currentUser = await getCurrentUser();

    if (!currentUser) {
        redirect('/login')
    }

    const { id } = await params;
    console.log('Parameter ID: ', id);

    const roomId = Number(id);

    const roomData = await getRoomById(roomId);
    const branches = await getBranchInfo();
    const inclusions = await getInclusions();


    return <RoomViewPageWrapper 
        room={roomData}
        inclusions={inclusions}
        branches={branches}
    />
}