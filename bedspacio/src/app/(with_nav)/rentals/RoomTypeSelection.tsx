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
    const room_type = [ 'bedspace', 'apartment' ]

    return (
        <div className='relative flex flex-col items-start justify-between w-full xl:w-[350px] lg:w-[250px]  rounded-[10px]'>
            <button onClick={() => setOpenRoomType(prev => !prev)} className={`flex items-center justify-between text-[18px] font-bold p-3 cursor-pointer  hover:bg-[#C7EEFF] active:bg-[#C7EEFF] rounded-[10px] w-full ${selectedRoomType ? 'border-2 border-[#1D242B] bg-[#FAFAFA]' : 'border-2 border-[#FAFAFA] text-[#1D242B] bg-[#FAFAFA]'}`}>
                <span className="text-left whitespace-nowrap w-[225px] truncate">{!selectedRoomType ? 'Choose room type' : selectedRoomType}</span>
                <ArrowDown className={`${openRoomType && 'rotate-180'} w-[30px] h-auto transition-all duration-100`} />
            </button>

            {openRoomType && (
                <div className='absolute top-15 z-10 flex flex-col items-start justify-start bg-[#FAFAFA] w-full rounded-[10px] overflow-hidden'>
                    {room_type.map((type, index) => (
                        <div key={index} className='flex flex-col w-full'>
                            <span onClick={() => {setSelectedRoomType(type); setOpenRoomType(false) }} className='p-3 text-[#0077C0] text-[16px] font-bold cursor-pointer hover:bg-[#C7EEFF] active:bg-[#C7EEFF] w-full'>{type === 'bedspace' ? 'Bedspace' : 'Apartment'}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}