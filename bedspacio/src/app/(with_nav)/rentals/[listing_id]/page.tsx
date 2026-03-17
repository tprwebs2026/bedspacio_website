
import Link from "next/link";

import InquiryForm from "./InquiryForm";
import ArrowLong from '@/asset/icon/arrow-long.svg'
import Location from '@/asset/icon/map-pin.svg'

import { getRoomDetails } from "../../../../../lib/room";
import { ODOO_BASE_URL } from "@/config/config";
import RoomImages from "./RoomImage";


type Props = { params: Promise<{ listing_id: number }> };

type Inclusions = {
    id: number,
    name: string
}

type PaymentTerms = {
    id: number,
    label: string,
    amount: number
}

type RoomDetailType = {
    name: string,
    type: string,
    gender: string,
    description: string,
    branch_address: string,
    starting_price: number,
    property_manager: string,
    property_manager_contact: string,
    maximum_pax: number,
    available_slot: number,
    available_upper: number,
    available_lower: number,
    inclusions: Inclusions[],
    payment_term: PaymentTerms[]

}

export default async function ListingInfoPage ({ params }: Props ) {
    const { listing_id } = await params

    // FETCH THE DATA LIKE THIS LATER ON
    /*
        const res = await fetch(
            `http://localhost:5000/api/listings/${params.listingId}`,
            { cache: "no-store" }
        );
    */

    const room = await getRoomDetails(listing_id);

    console.log('Room details from roomImages: ', room);
    

    return (
        <div className="flex flex-col items-start w-full min-h-screen">
            <div className="flex items-center w-full px-[1rem] xl:px-[8rem] lg:px-[6rem] py-[1rem]">
                <span>{`Rentals > Listings >`}</span>
            </div>

            <section className="flex flex-col items-start justify-start w-full h-full px-[1rem] xl:px-[8rem] lg:px-[2rem] gap-[2rem] box-border">
                

                <div className="relative flex flex-col xl:grid lg:grid md:flex xl:grid-cols-[60%_40%] lg:grid-cols-[60%_40%] md:flex-col pb-[4rem] box-border gap-[2rem] overflow-wrap">
                    <div className="flex flex-col items-start justify-start w-full h-full gap-[1rem]">
                        <div className="relative flex w-full h-full gap-[1rem] rounded-[10px]">
                            <div className="absolute top-3 left-3 z-10 rounded-[10px] p-2 flex items-center gap-2 bg-[#0077C0]">
                                <span className="text-[#FAFAFA] text-[16px]">{room.type !== 'bedspace' ? 'Apartment' : 'Bedspace'}</span>
                                <span className="text-[#FAFAFA] text-[16px]">|</span>
                                <span className="text-[#FAFAFA] text-[16px]">{room.gender !== 'male' ? 'Female' : 'Male'} Only</span>
                            </div>

                            {/* <RoomImages images={room_images}/> */}
                            <RoomImages images={room.images}/>
                        </div>
                        
                        <div className="flex flex-col items-start justify-start gap-[1rem] pb-[1rem] w-full">
                            <span className="text-[22px] xl:text-[24px] lg:text-[24px] text-[#1D242B] font-[900] leading-tight break-words w-full">{room.name}</span>
                            <div className="flex flex-col items-start gap-1">
                                <div className="flex items-center gap-1">
                                    <span className="text-[#0077C0] text-[24px] font-[900] leading-[1]">Php {room.starting_price}</span>
                                    <span className="text-[#0077C0] text-[28px] font-bold leading-[0.75] opacity-50">/monthly</span>
                                </div>
                            </div>

                            {/* <div className="grid grid-cols-2 lg:grid-cols-4 gap-1 w-full">
                                <div className="flex  items-center justify-start bg-[#1D242B]/10 pl-4 p-2 gap-2 overflow-hidden">
                                    <span className="text-center text-[16px] font-medium text-[#1D242B] min-w-[100px] max-w-[140px] truncate">
                                    Maximum Pax:
                                    </span>
                                    <span className="font-bold text-[16px] text-[#0077C0] whitespace-nowrap">
                                    {room.maximum_pax}
                                    </span>
                                </div>

                                <div className="flex  items-center justify-start bg-[#1D242B]/10 pl-4 p-2 gap-2  overflow-hidden">
                                    <span className="text-center text-[16px] font-medium text-[#1D242B] min-w-[100px] max-w-[140px] truncate">
                                    Available Slot:
                                    </span>
                                    <span className="font-bold text-[16px] text-[#0077C0] whitespace-nowrap">
                                    {room.available_slot}
                                    </span>
                                </div>

                                {room.type === 'bedspace' && (
                                    <div className="flex  items-center justify-start bg-[#1D242B]/10 pl-4 p-2 gap-2 overflow-hidden">
                                        <span className="text-center text-[16px] font-medium text-[#1D242B] min-w-[100px] max-w-[140px] truncate">
                                            Upper Decks:
                                        </span>
                                        <span className="font-bold text-[16px] text-[#0077C0] whitespace-nowrap">
                                            {room.available_upper}
                                        </span>
                                    </div>
                                )}

                                {room.type === 'bedspace' && (
                                    <div className="flex items-center justify-start bg-[#1D242B]/10 pl-4 p-2 gap-2 overflow-hidden">
                                        <span className="text-center text-[16px] font-medium text-[#1D242B] min-w-[100px] max-w-[140px] truncate">
                                            Lower Decks:
                                        </span>
                                        <span className="font-bold text-[16px] text-[#0077C0] whitespace-nowrap">
                                            {room.available_lower}
                                        </span>
                                    </div>
                                )}
                                </div> */}
                        </div>

                        <div className="flex flex-col items-start gap-[1rem] w-full pt-[1rem] border-t border-t-[#1D242B]/50">
                            <span className="text-[20px] text-[#1D242B] font-[900]">Description</span>
                            <p className="text-[18px] text-[#1D242B]">{`${room.description}`}</p>
                        </div>

                        <div className="flex flex-col items-start gap-[1rem] w-full">
                            <span className="text-[20px] text-[#1D242B] font-[900]">Availability</span>
                            <div className="flex items-center gap-2">
                                <ArrowLong className="w-[25px] h-full" />
                                <span>Maximum pax: <strong>{room.maximum_pax}</strong></span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ArrowLong className="w-[25px] h-full" />
                                <span>Available Slot: <strong>{room.available_slot}</strong></span>
                            </div>
                            {room.room_type !== "bedspace" && (
                                <>
                                    <div className="flex items-center gap-2">
                                        <ArrowLong className="w-[25px] h-full" />
                                        <span>Upper Deck/s: <strong>{room.available_upper}</strong></span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <ArrowLong className="w-[25px] h-full" />
                                        <span>Lower Deck/s: <strong>{room.available_lower}</strong></span>
                                    </div>
                                </>
                            )}
                            
                        </div>

                        <div className="flex flex-col items-start gap-2 w-full">
                            <span className="text-[20px] text-[#1D242B] font-[900]">Inclusion/s</span>
                            <div className="flex flex-wrap gap-[0.5rem] items-start">
                                {room.inclusions.map((inc:Inclusions) => (
                                    <div key={inc.id} className="flex items-center justify-center gap-2 rounded-full border-2 border-[#0077C0] px-3 py-2">
                                        <span className="text-[16px] text-[#0077C0] font-bold leading-[0.75]">{inc.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col items-start gap-[1rem] w-full">
                            <span className="text-[20px] text-[#1D242B] font-[900]">Payment Term/s</span>
                                <div className="flex flex-col gap-[0.5rem] items-start">
                                    {room.payment_terms.length <= 0 ? (
                                        <div className="flex items-center gap-2">
                                            <ArrowLong className="w-[25px] h-full" />
                                            <span>None</span>
                                        </div>
                                    ) : (
                                        room.payment_terms?.map((term: PaymentTerms) => (
                                            <div key={term.id} className="flex items-center gap-2">
                                                <ArrowLong className="w-[25px] h-auto" />
                                                <span className="text-[18px] text-[#1D242B] leading-[1]">{term?.label}</span>
                                            </div>
                                        ))
                                    )}
                                </div>
                        </div>

                        <div className="flex flex-col items-start gap-[1rem] w-full">
                            <span className="text-[20px] text-[#1D242B] font-[900]">Address</span>
                            <div className="flex flex-col gap-[0.5rem] items-start w-full">
                                <div className="flex items-center gap-2">
                                    <Location className="w-[20px] h-[20px]"/>
                                    <span className="text-[20px] text-[#1D242B]">{room.branch.address}</span>
                                </div>
                                <div className="flex w-full aspect-[16/9] rounded-[10px] overflow-hidden border-2 border-[#1D242B]/50">
                                    <iframe className="w-full h-full border-0" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4314.530524048516!2d121.05546727557147!3d14.544422785935382!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c9166b115a33%3A0xfba6d8b32dd2f720!2sBedSpacio!5e1!3m2!1sen!2sph!4v1771987409424!5m2!1sen!2sph"  loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-start gap-[1rem] w-full">
                            <span className="text-[20px] text-[#1D242B] font-[900]">Landmarks</span>
                            <div className="flex flex-col gap-[0.5rem] items-start w-full">
                                {room.branch.landmarks.map((landmark: {id:number, name: string}) => (
                                    <div key={landmark.id} className="flex items-center gap-2">
                                        <ArrowLong className="w-[25px] h-auto" />
                                        <span key={landmark.id} className="text-[18px] text-[#1D242B] leading-[1]">
                                            {landmark.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <InquiryForm 
                        propertyManager={room.property_manager}
                        propertyManagerContact={room.property_manager_contact}
                        profileImage={room.profile_image}
                    />
            </div>
            </section>
        </div>
    )
}