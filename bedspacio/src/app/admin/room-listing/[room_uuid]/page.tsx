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
    room_uuid: number,
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

export default async function RoomViewPage ({ params }: { params: Promise<{ room_uuid: string }> }) {

    const currentUser = await getCurrentUser();

    if (!currentUser) {
        redirect('/login')
    }

    const { room_uuid } = await params;
    console.log('Parameter ID: ', typeof room_uuid);

    const roomId = Number(room_uuid);
    console.log('room uuid type: ', typeof roomId);

    const roomData = await getRoomById(roomId);
    const branches = await getBranchInfo();
    const inclusions = await getInclusions();


    return <RoomViewPageWrapper 
        room={roomData}
        inclusions={inclusions}
        branches={branches}
    />
}