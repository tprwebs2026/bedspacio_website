"use client"

import Add from '@/asset/icon/add.svg';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from "next/navigation";
import { getRoomById } from '../../../../lib/room';
import { AllRoomType } from './page';

interface RoomPageProp {
    rooms: AllRoomType
    pageNumber: number
}

export default function RoomPageWrapper ({ rooms, pageNumber }: RoomPageProp ) {

    const router = useRouter();

    const handleNextPage = () => {
        if (pageNumber < rooms?.totalPage) {
            router.push(`/admin/room-listing?page=${pageNumber + 1}`);
        }
    }
    
    const handlePrevPage = () => {
        if (pageNumber > 1) {
            router.push(`/admin/room-listing?page=${pageNumber - 1}`);
            console.log('asdasd');
        }
    };

    const handleViewRoom = async (id: number) => {
        router.push(`/admin/room-listing/${id}`);
    }

    return (
        <div className="flex w-full min-h-screen">
            <div className="flex flex-col w-full px-[1rem] xl:px-[8rem] lg:px-[1rem] py-[1rem] gap-[4rem]">
                <div className="flex items-center justify-between w-full">
                    <div className='flex items-center gap-[2rem]'>
                        <span className="text-[28px] text-[#1D242B] font-[900]">Room Listings</span>
                    </div>

                    <div className='flex items-center gap-[1rem]'>
                        {/* <input type="search" name="" id="" placeholder='Search for Room ID here' className='w-[300px] bg-[#1D242B]/25 rounded-[5px] text-[14px] p-2 focus:outline-none focus:border-[#0077C0] '/>

                        <div className='flex items-center gap-1'>
                            <span className='text-[14px] font-bold'>Branch</span>
                            <select name="branch" id="branch_select" className='min-w-[150px] text-[14px] bg-[#1D242B]/25 rounded-[5px] p-2 focus:outline-none focus:border-[#0077C0] cursor-pointer'>
                                <option hidden>Select branch</option>
                                <option value="branch_1">branch_1</option>
                                <option value="branch_2">branch_2</option>
                            </select>
                        </div>

                        <div className='flex items-center gap-1'>
                            <span className='text-[14px] font-bold'>Type</span>
                            <select name="room_type" id="room_type_select" className=' min-w-[150px] text-[14px] bg-[#1D242B]/25 rounded-[5px] p-2 focus:outline-none focus:border-[#0077C0] cursor-pointer'>
                                <option hidden>Select room type</option>
                                <option value="type_1">type_1</option>
                                <option value="type_2">type_2</option>
                            </select>
                        </div> */}

                        <Link href="/admin/room-listing/create" className="flex items-center justify-center rounded-[10px] bg-[#0077C0] p-2 cursor-pointer hover:bg-[#1D242B] hover:border-[#1D242B] active:bg-[#1D242B] xl:active:bg-[#0077C0] transition-all duration-100">
                            <Add className="w-[22px] h-auto stroke-[#FAFAFA]" />
                            <span className="text-[#FAFAFA] text-[14px] px-2">Create</span>
                        </Link>
                    </div>
                </div>


                {/* 
                    Display in a list view 
                    > Room list (room_id, title, slot, branch, gender, price)
                */}
                <div className='flex flex-col w-full items-center'>

                    {/* HEADER */}
                    <div className='grid grid-cols-[5%_10%_25%_15%_15%_15%_15%] w-full justify-items-center border-b border-b-[#1D242B] opacity-50 xl:text-[16px] lg:text-[14px]'>
                        <span></span>
                        <span>Room ID</span>
                        <span>Name</span>
                        <span>Branch</span>
                        <span>Type</span>
                        <span>Slot</span>
                        <span>Price</span>
                    </div>
                    
                    {/* TABLE CONTENT*/}
                    <div className='flex flex-col w-full h-[450px]'>
                        {rooms?.data?.map((room, index) => (
                            <Link key={room.id} href={`/admin/room-listing/${room.id}`} className='grid grid-cols-[5%_10%_25%_15%_15%_15%_15%] w-full justify-items-center py-3 cursor-pointer border-b border-b-[#1D242B]/25 hover:bg-[#C7EEFF]/50 active:bg-[#FAFAFA] transition-all duration-100'>
                                <span className='text-[12px] opacity-50'>{(pageNumber - 1) * 10 + index + 1}</span>
                                <span className='text-[14px]'>{room.room_uuid}</span>
                                <span className='text-[14px] text-center w-[300px] truncate'>{room.title}</span>
                                <span className='text-[14px]'>{room.branch}</span>
                                <span 
                                className={`px-2 ${room.type === 'apartment' ? 'bg-[#0077C0]/25 text-[#0077C0]' : 'bg-[#007C00]/25 text-[#007C00]'} h-fit rounded-full text-[14px]`}>
                                    {room.type}
                                </span>
                                <span className='text-[14px]'>{room.slot}</span>
                                <span className='text-[14px]'>Php {room.price}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className='flex items-center justify-center w-full gap-2'>
                    <button onClick={handlePrevPage} disabled={pageNumber === 1} className='cursor-pointer bg-[#141414]/15 p-2 border-2 border-[#141414]/50 rounded-[10px]'>Prev</button>
                    <span className='p-2 px-4 border-2 border-[#141414] rounded-[10px]'>{pageNumber}</span>
                    <button onClick={handleNextPage} disabled={pageNumber >= rooms?.totalPage} className='cursor-pointer p-2 bg-[#141414]/15 border-2  border-[#141414]/50 rounded-[10px]'>Next</button>
                </div>
            </div>
        </div>
    )
}