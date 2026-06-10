
// import Link from "next/link";

// import InquiryForm from "./InquiryForm";
// import ArrowLong from '@/asset/icon/arrow-long.svg'
// import Location from '@/asset/icon/map-pin.svg'
// import Map from "@/components/Map";
// import Breadcrumbs from "@/components/BreadCrumb";

// import { getRoomDetails } from "../../../../../lib/room";
// import { ODOO_BASE_URL } from "@/config/config";
// import RoomImages from "./RoomImage";




// type Props = { params: Promise<{ id: number }> };

// type Inclusions = {
//     id: number,
//     name: string,
//     slug: string
// }

// type PaymentTerms = {
//     id: number,
//     label: string,
//     amount: number
// }

// type RoomDetailType = {
//     name: string,
//     type: string,
//     gender: string,
//     description: string,
//     branch_address: string,
//     starting_price: number,
//     property_manager: string,
//     property_manager_contact: string,
//     capacity: number,
//     available_slot: number,
//     available_upper: number,
//     available_lower: number,
//     inclusions: Inclusions[],
//     payment_term: PaymentTerms[]

// }

// export default async function ListingInfoPage ({ params }: Props ) {
//     const { id } = await params

//     const room = await getRoomDetails(id);
//     console.log('Room details from roomImages: ', room);
    

//     return (
//         <div className="flex flex-col items-start w-full min-h-screen">
//             <div className="flex items-center w-full px-[1rem] xl:px-[8rem] lg:px-[6rem] py-[1rem] ">
//                 <Breadcrumbs />
//             </div>

//             <section className="flex flex-col items-start justify-start w-full h-full px-[1rem] xl:px-[8rem] lg:px-[2rem]  box-border">
//                 <div className="relative flex flex-col xl:grid lg:grid md:flex xl:grid-cols-[60%_40%] lg:grid-cols-[60%_40%] md:flex-col pb-[4rem] box-border gap-[2rem] xl:gap-0 lg:gap-0 overflow-wrap w-full">
//                     <div className="flex flex-col items-start justify-start w-full h-full gap-[1rem] pr-2">
//                         <div className="relative flex w-full h-full rounded-[10px]">
//                             <div className="absolute top-3 left-3 z-10 rounded-[10px] p-2 flex items-center gap-2 bg-[#0077C0]">
//                                 <span className="text-[#FAFAFA] text-[16px]">{room.type !== 'bedspace' ? 'Apartment' : 'Bedspace'}</span>
//                                 <span className="text-[#FAFAFA] text-[16px]">|</span>
//                                 <span className="text-[#FAFAFA] text-[16px]">{room.gender !== 'male' ? 'Female' : 'Male'} Only</span>
//                             </div>

//                             {/* <RoomImages images={room_images}/> */}
//                             <RoomImages images={room.images}/>
//                         </div>

//                         <div className="flex flex-col items-start justify-start gap-[1rem] pb-[1rem] w-full">
//                             <span className="text-[22px] xl:text-[24px] lg:text-[24px] text-[#1D242B] font-[900] leading-tight break-words w-full">{room.name}</span>
//                             <div className="flex flex-col items-start gap-1">
//                                 <div className="flex items-center gap-1">
//                                     <span className="text-[#0077C0] text-[24px] font-[900] leading-[1]">Php {room.starting_price}</span>
//                                     <span className="text-[#0077C0] text-[28px] font-bold leading-[0.75] opacity-50">/monthly</span>
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="flex flex-col items-start gap-[1rem] w-full pt-[1rem] border-t border-t-[#1D242B]/50">
//                             <span className="text-[20px] text-[#1D242B] font-[900]">Description</span>
//                             <p className="text-[18px] text-[#1D242B]">{`${room.description}`}</p>
//                         </div>

//                         <div className="flex flex-col items-start gap-[1rem] w-full">
//                             <span className="text-[20px] text-[#1D242B] font-[900]">Capacity</span>
//                             <div className="flex items-center gap-2">
//                                 <ArrowLong className="w-[25px] h-full" />
//                                 <span>Maximum Pax: <strong>{room.capacity}</strong></span>
//                             </div>
//                             <div className="flex items-center gap-2">
//                                 <ArrowLong className="w-[25px] h-full" />
//                                 <span className={`${room.available_slot > 0 ? 'text-[#007C01]' : 'text-[#F60002]' }`}>Available Slot: <strong>{room.available_slot}</strong></span>
//                             </div>
//                             {room.room_type === "bedspace" ? (
//                                 <>
//                                     <div className="flex items-center gap-2">
//                                         <ArrowLong className="w-[25px] h-full" />
//                                         <span>Upper Deck/s: <strong>{room.available_upper}</strong></span>
//                                     </div>
//                                     <div className="flex items-center gap-2">
//                                         <ArrowLong className="w-[25px] h-full" />
//                                         <span>Lower Deck/s: <strong>{room.available_lower}</strong></span>
//                                     </div>
//                                 </>
//                             ) : (
//                                 <></>
//                                 // Upper decks and lower deck slots are not show if the room type is APARTMENT
//                             )}
                            
//                         </div>

//                         <div className="flex flex-col items-start gap-2 w-full">
//                             <span className="text-[20px] text-[#1D242B] font-[900]">Inclusion/s</span>
//                             <div className="flex flex-wrap gap-[0.5rem] items-start">
//                                 {room.inclusions.map((inc:Inclusions) => (
//                                     <Link href={`/rentals?page=1&inclusion=${inc.slug}`} key={inc.id} className="group flex items-center justify-center gap-2 rounded-full border-2 border-[#0077C0] px-3 py-2 hover:bg-[#0077C0] text-[#0077C0] active:bg-[#1D242B] active:border-[#1D242B]">
//                                         <span className="group-hover:text-[#FAFAFA] text-[16px] font-bold leading-[0.75]">{inc.name}</span>
//                                     </Link>
//                                 ))}
//                             </div>
//                         </div>

//                         <div className="flex flex-col items-start gap-[1rem] w-full">
//                             <span className="text-[20px] text-[#1D242B] font-[900]">Payment Term/s</span>
//                                 <div className="flex flex-col gap-[0.5rem] items-start">
//                                     {room.payment_terms.length <= 0 ? (
//                                         <div className="flex items-center gap-2">
//                                             <ArrowLong className="w-[25px] h-full" />
//                                             <span>None</span>
//                                         </div>
//                                     ) : (
//                                         room.payment_terms?.map((term: PaymentTerms) => (
//                                             <div key={term.id} className="flex items-center gap-2">
//                                                 <ArrowLong className="w-[25px] h-auto" />
//                                                 <span className="text-[18px] text-[#1D242B] leading-[1]">{term?.label}</span>
//                                             </div>
//                                         ))
//                                     )}
//                                 </div>
//                         </div>

//                         <div className="flex flex-col items-start gap-[1rem] w-full">
//                             <span className="text-[20px] text-[#1D242B] font-[900]">Address</span>
//                             <div className="flex flex-col gap-[0.5rem] items-start w-full">
//                                 <div className="flex items-center gap-2">
//                                     <Location className="w-[20px] h-[20px]"/>
//                                     <span className="text-[20px] text-[#1D242B]">{room.branch.address}</span>
//                                 </div>
//                                 <div className="flex w-full aspect-[16/9] rounded-[10px] overflow-hidden border-2 border-[#1D242B]/50">
//                                     <Map address={room.branch.address} />
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="flex flex-col items-start gap-[1rem] w-full">
//                             <span className="text-[20px] text-[#1D242B] font-[900]">Landmarks</span>
//                             <div className="flex flex-col gap-[0.5rem] items-start w-full">
//                                 {room.branch.landmarks.map((landmark: {id:number, name: string}) => (
//                                     <div key={landmark.id} className="flex items-center gap-2">
//                                         <ArrowLong className="w-[25px] h-auto" />
//                                         <span key={landmark.id} className="text-[18px] text-[#1D242B] leading-[1]">
//                                             {landmark.name}
//                                         </span>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>

//                     <InquiryForm 
//                         slot = {room.available_slot}
//                         propertyManager={room.property_manager}
//                         propertyManagerContact={room.property_manager_contact}
//                         profileImage={room.profile_image}
//                         publicRoomId={room.public_room_id}
//                         startingPrice={room.starting_price}
//                     />
//                 </div>
//             </section>
//         </div>
//     )
// }


// ------ FOR SEO ------ //

import type { Metadata } from "next";

    type MetaDataProps = {
        params: Promise<{ id: number }>;
    };

    export async function generateMetadata(
    { params }: Props
    ): Promise<Metadata> {

    const { id } = await params;

    const room = await getRoomPreviewById(id);

    return {
        title: `${room.title} | BedSpacio`,
        description: `${room.type} for rent at ${room.branch.address}. Starting at ₱${room.price}/month.`,

        openGraph: {
            title: room.title,
            description: room.description,
            images: room.images?.length
                ? [room.images[0].image_url]
                : [],
            type: "website",
        },

        alternates: {
            canonical: `https://bedspacio.com/rentals/${id}`,
        },
    };
}


// ------------------ POSTGRES ---------------- //


import Link from "next/link";

import InquiryForm from "./InquiryForm";
import ArrowLong from '@/asset/icon/arrow-long.svg'
import Location from '@/asset/icon/map-pin.svg'
import Map from "@/components/Map";
import Breadcrumbs from "@/components/BreadCrumb";

import { getRoomPreviewById } from "../../../../../lib/room";
import { ODOO_BASE_URL } from "@/config/config";
import RoomImages from "./RoomImage";




type Props = { params: Promise<{ id: number }> };

type Inclusions = {
    id: number,
    inclusion: string,
    slug: string
}

type PaymentTerms = {
    term: string,
    amount: number
}

type RoomDetailType = {
    title: string,
    type: string,
    gender: string,
    description: string,
    branch_address: string,
    price: number,
    property_manager: string,
    property_manager_contact: string,
    capacity: number,
    available_slot: number,
    available_upper: number,
    available_lower: number,
    inclusions: Inclusions[],
    payment_term: PaymentTerms[]

}

export default async function RoomDetails ({ params }: Props ) {
    const { id } = await params

    const room = await getRoomPreviewById(id);

    return (
        <div className="flex flex-col items-start w-full min-h-screen">
            <div className="flex items-center w-full px-[1rem] xl:px-[8rem] lg:px-[6rem] py-[1rem] ">
                <Breadcrumbs />
            </div>

            <section className="flex flex-col items-start justify-start w-full h-full px-[1rem] xl:px-[8rem] lg:px-[2rem]  box-border">
                <div className="relative flex flex-col xl:grid lg:grid md:flex xl:grid-cols-[60%_40%] lg:grid-cols-[60%_40%] md:flex-col pb-[4rem] box-border gap-[2rem] xl:gap-0 lg:gap-0 overflow-wrap w-full">
                    <div className="flex flex-col items-start justify-start w-full h-full gap-[1rem] pr-2">
                        <div className="relative flex w-full h-full rounded-[10px]">
                            <div className="absolute top-3 left-3 z-10 rounded-[10px] p-2 flex items-center gap-2 bg-[#0077C0]">
                                <span className="text-[#FAFAFA] text-[16px]">{room.type !== 'bedspace' ? 'Apartment' : 'Bedspace'}</span>
                                <span className="text-[#FAFAFA] text-[16px]">|</span>
                                <span className="text-[#FAFAFA] text-[16px]">{room.gender !== 'male' ? 'Female' : 'Male'} Only</span>
                            </div>

                            {/* <RoomImages images={room_images}/> */}
                                <RoomImages images={room.images}/>
                        </div>

                        <div className="flex flex-col items-start justify-start gap-[1rem] pb-[1rem] w-full">
                            <span className="text-[22px] xl:text-[24px] lg:text-[24px] text-[#1D242B] font-[900] leading-tight break-words w-full">{room.title}</span>
                            <div className="flex flex-col items-start gap-1">
                                <div className="flex items-center gap-1">
                                    <span className="text-[#0077C0] text-[24px] font-[900] leading-[1]">Php {room.price}</span>
                                    <span className="text-[#0077C0] text-[28px] font-bold leading-[0.75] opacity-50">/monthly</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-start gap-[1rem] w-full pt-[1rem] border-t border-t-[#1D242B]/50">
                            <span className="text-[20px] text-[#1D242B] font-[900]">Description</span>
                            <p className="text-[18px] text-[#1D242B] whitespace-pre-wrap">{`${room.description}`}</p>
                        </div>

                        <div className="flex flex-col items-start gap-[1rem] w-full">
                            <span className="text-[20px] text-[#1D242B] font-[900]">Capacity</span>
                            <div className="flex items-center gap-2">
                                <ArrowLong className="w-[25px] h-full stroke-[#1D242B] stroke-2" />
                                <span>Maximum Pax: <strong>{room.capacity}</strong></span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ArrowLong className="w-[25px] h-full stroke-[#1D242B] stroke-2" />
                                <span className={`${room.slot === 0 ? 'text-[#F60002]' : 'text-[#007C01]' }`}>Available Slot: <strong>{room.slot}</strong></span>
                            </div>

                            {/* Ignore */}
                            {/* {room.room_type === "bedspace" ? (
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
                            ) : (
                            )} */}
                            
                        </div>

                        <div className="flex flex-col items-start gap-2 w-full">
                            <span className="text-[20px] text-[#1D242B] font-[900]">Inclusion/s</span>
                            <div className="flex flex-wrap gap-[0.5rem] items-start">
                                {room.inclusions.map((inc:Inclusions) => (
                                    <Link href={`/rentals?page=1&inclusion=${inc.slug}`} key={inc.id} className="group flex items-center justify-center gap-2 rounded-full border-2 border-[#0077C0] px-3 py-2 hover:bg-[#0077C0] text-[#0077C0] active:bg-[#1D242B] active:border-[#1D242B]">
                                        <span className="group-hover:text-[#FAFAFA] text-[16px] font-bold leading-[0.75]">{inc.inclusion}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col items-start gap-[1rem] w-full">
                            <span className="text-[20px] text-[#1D242B] font-[900]">Payment Term/s</span>
                                <div className="flex flex-col gap-[0.5rem] items-start">
                                    {room.payment_term.length <= 0 ? (
                                        <div className="flex items-center gap-2">
                                            <ArrowLong className="w-[25px] h-full stroke-[#1D242B] stroke-2" />
                                            <span>None</span>
                                        </div>
                                    ) : (
                                        room.payment_term?.map((term: PaymentTerms, index: number) => (
                                            <div key={index} className="flex items-center gap-2">
                                                <ArrowLong className="w-[25px] h-auto stroke-[#1D242B] stroke-2" />
                                                <span className="text-[18px] text-[#1D242B] leading-[1]">{term?.term}</span>
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
                                    <Map address={room.branch.address} />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-start gap-[1rem] w-full">
                            <span className="text-[20px] text-[#1D242B] font-[900]">Landmarks</span>
                            <div className="flex flex-col gap-[0.5rem] items-start w-full">
                                {room.branch.landmarks.map((lm: {id:number, name: string, landmark: string}) => (
                                    <div key={lm.id} className="flex items-center gap-2">
                                        <ArrowLong className="w-[25px] h-auto stroke-[#1D242B] stroke-2" />
                                        <span key={lm.id} className="text-[18px] text-[#1D242B] leading-[1]">
                                            {lm.landmark}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Ignore */}
                    {/* <InquiryForm 
                        slot = {room.slot}
                        propertyManager={room.property_manager.fullname}
                        propertyManagerContact={room.property_manager.contact_number}
                        profileImage={room.profile_image}
                        publicRoomId={room.room_uuid}
                        startingPrice={room.starting_price}
                    /> */}

                    <InquiryForm 
                        slot = {room.slot}
                        propertyManager={room.property_manager.fullname}
                        propertyManagerContact={room.property_manager.contact_number}
                        profileImage={room.profile_image}
                        room_uuid={room.room_uuid}
                        room_name={room.title}
                        startingPrice={parseFloat(room.price)}
                    />
                </div>
            </section>
        </div>
    )
}