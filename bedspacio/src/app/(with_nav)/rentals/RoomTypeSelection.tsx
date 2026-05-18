
// NO NEED TO COMPLY WITH ODOO - both Odoo and Postgres can used this

"use client"

import { useState } from "react";

// ICON
import ArrowDown from '@/asset/icon/arrow-down.svg'

type RoomTypeProps = {
    selectedRoomType: string
    setSelectedRoomType: React.Dispatch<React.SetStateAction<string>>
}

export default function RoomTypeSelection ({ selectedRoomType, setSelectedRoomType }: RoomTypeProps ) {
    const [openRoomType, setOpenRoomType] = useState<Boolean>(false);
    const roomTypes = [
        { value: "bedspace", label: "Bedspace" },
        { value: "apartment", label: "Apartment" },
    ]

    return (
        <div className='relative flex flex-col items-start justify-between w-full h-full xl:w-[300px] lg:w-[200px]'>
            <span className={`text-[#FAFAFA] text-[16px] font-bold pb-1 pl-2`}>Room Type</span>
            <button onClick={() => setOpenRoomType(prev => !prev)} className={`flex items-center justify-between text-[18px] font-bold cursor-pointer  hover:bg-[#C7EEFF] active:bg-[#C7EEFF] rounded-[5px] h-[50px] px-3 w-full bg-[#FAFAFA]`}>
                <span className="text-left whitespace-nowrap w-[225px] truncate">{(!selectedRoomType ? 'All' : selectedRoomType).charAt(0).toUpperCase() + (!selectedRoomType ? 'All' : selectedRoomType).slice(1)}</span>
                <ArrowDown className={`${openRoomType && 'rotate-180'} w-[30px] h-auto transition-all duration-100 fill-[#1D242B]`} />
            </button>

            {openRoomType && (
                <div className='absolute top-21 z-10 flex flex-col items-start justify-start bg-[#FAFAFA] w-full rounded-[5px] overflow-hidden'>
                        <div className='flex flex-col w-full'>
                            {roomTypes.map((type, index) => (
                                <span key={index} onClick={() => {setSelectedRoomType(type.value); setOpenRoomType(false) }} className='p-3 text-[#0077C0] text-[16px] font-bold cursor-pointer hover:bg-[#C7EEFF] active:bg-[#C7EEFF] w-full'>{type.label}</span>
                            ))}

                            <span onClick={() => {setSelectedRoomType('All'); setOpenRoomType(false) }} className='p-3 text-[#0077C0] text-[16px] font-bold cursor-pointer hover:bg-[#C7EEFF] active:bg-[#C7EEFF] w-full'>{'All'}</span>
                        </div>
                </div>
            )}
        </div>
    )
}