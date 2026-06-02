"use client"

// icons
import Time from '@/asset/icon/time.svg'
import Lock from '@/asset/icon/closed.svg'
import Message from '@/asset/icon/message.svg'
import Convert from '@/asset/icon/convert.svg' 
import Graph from '@/asset/icon/conversion_rate.svg'
import Arrow from '@/asset/icon/downward-arrow.svg'
import ArrowRight from '@/asset/icon/arrow-long.svg'
import Filter from '@/asset/icon/filter.svg'


import { BestRoomType, InquiryType, RecentInquiryType } from '../page'

import Link from 'next/link'
import { useState } from 'react'

// helpers
import { timeAgo, formatDate } from '../../../../helpers/timeFormat'
import { getBestRooms } from '../../../../lib/dashboard'
import { useAuth } from '@/context/AuthContext'

interface DashboardWrapperProps {
    inquiries: InquiryType[]
    recentInquiries: RecentInquiryType[]
    bestRooms: BestRoomType[]
}


export default function DashboardPageWrapper ({
    inquiries,
    recentInquiries,
    bestRooms,
}: DashboardWrapperProps) {

    const { id, fullname } = useAuth();

    const [roomType, setRoomType] = useState('bedspace');


    const filteredRooms = bestRooms.filter(
        room => room.type === roomType
    );


    return (
        <div className="flex w-full min-h-screen">
            
            <div className="flex flex-col w-full h-auto p-[1rem] xl:px-[8rem] lg:px-[1rem] gap-[1rem]">

                <div className='flex items-center w-full justify-between pt-[1rem]'>
                    <span className='text-[22px] font-bold'>Hello, {fullname}!</span>

                    <div className='flex items-center gap-1'>
                        <span className='text-[14px] font-bold pr-2'>Quick Actions</span>

                        <Link href={'/admin/room-listing/create'} className='flex items-center rounded-[5px] p-1 bg-[#0077C0] hover:bg-[#1D242B] active:bg-[#0077C0] transition-all duration-100'>
                            <span className='font-bold text-[14px] text-[#FAFAFA] px-2'>+ Create New Room</span>
                        </Link>

                        <Link href={'/admin/inquiry'} className='flex items-center rounded-[5px] p-1 bg-[#0077C0] hover:bg-[#1D242B] active:bg-[#0077C0] transition-all duration-100'>
                            <Graph className="w-[20px] h-[20px] fill-[#FAFAFA]" />
                            <span className='font-bold text-[14px] text-[#FAFAFA] px-2'>Manage Inquiries</span>
                        </Link>
                    </div>
                </div>

                <div className='flex flex-col w-full rounded-[5px] gap-2'>
                    <div className='flex items-center gap-2'>
                        <span className='text-[22px] font-bold text-[#1D242B]/90 leading-[1] py-2'>Overview</span>
                        <Arrow className="w-[25px] h-[25px]" />
                    </div>

                    <div className="grid grid-cols-4 w-full rounded-[5px] gap-2">

                        {inquiries.map((inq, index) => (
                            <Link key={index} href={`/admin/inquiry?status=${inq.ghl_status}`} className="flex flex-col w-full gap-2 items-start justify-evenly p-4 rounded-[10px] cursor-pointer border border-[#1D242B]/50 hover:bg-[#0077C0]/10 hover:-translate-y-1 transition-all duration-100">
                                <div className="flex items-center justify-start gap-2 w-full">
                                    <Time className="w-[25px] h-[25px] opacity-75" />
                                    <span className="text-[14px] font-bold text-[#1D242B] opacity-80">{inq.ghl_status}</span>
                                </div>

                                <span className="text-[48px] text-[#1D242B] font-bold leading-[1]">{inq.count}</span>
                            </Link>
                        ))}
                        {/* <div className="flex flex-col w-full gap-2 items-start justify-evenly p-4 rounded-[10px] cursor-pointer border border-[#1D242B]/50 hover:bg-[#0077C0]/10 hover:-translate-y-1 transition-all duration-100">
                            <div className="flex items-center justify-start gap-2 w-full">
                                <Message className="w-[25px] h-[25px] opacity-75" />
                                <span className="text-[14px] font-bold text-[#1D242B] opacity-80">Contacted</span>
                            </div>

                            <span className="text-[48px] text-[#1D242B] font-bold leading-[1]">0</span>
                        </div>

                        <div className="flex flex-col w-full gap-2 items-start justify-evenly p-4 rounded-[10px] cursor-pointer border border-[#1D242B]/50 hover:bg-[#0077C0]/10 hover:-translate-y-1 transition-all duration-100">
                            <div className="flex items-center justify-start gap-2 w-full">
                                <Convert className="w-[25px] h-[25px] opacity-75" />
                                <span className="text-[14px] font-bold text-[#1D242B] opacity-80">Converted</span>
                            </div>

                            <span className="text-[48px] text-[#1D242B] font-bold leading-[1]">0</span>
                        </div>

                        <div className="flex flex-col w-full gap-2 items-start justify-evenly p-4 rounded-[10px] cursor-pointer border border-[#1D242B]/50 hover:bg-[#0077C0]/10 hover:-translate-y-1 transition-all duration-100">
                            <div className="flex items-center justify-start gap-2 w-full">
                                <Lock className="w-[25px] h-[25px] opacity-75" />
                                <span className="text-[14px] font-bold text-[#1D242B] opacity-80">Closed</span>
                            </div>

                            <span className="text-[48px] text-[#1D242B] font-bold leading-[1]">0</span>
                        </div> */}

                    </div>
                </div>


                <div className='grid grid-cols-[3fr_2fr] w-full gap-[1rem] pb-[1rem]'>

                    <div className='flex flex-col border border-[#1D242B]/50 p-4 rounded-[10px] gap-[1rem]'>
                        <div className='flex items-center justify-between w-full'>
                            <div className='flex items-center gap-2'>
                                <span className='text-[22px] text-[#1D242B]/90 font-bold'>Recently Added Leads</span>
                                <Arrow className="w-[25px] h-[25px]" />
                            </div>

                            
                        </div>

                        <div className='flex flex-col items-center w-full h-full gap-1'>
                            <div className='grid grid-cols-[10%_20%_20%_20%_15%_15%] justify-items-center place-items-center w-full text-[12px] text-[#1D242B]/50 font-bold pb-1'>
                                <span>Room ID</span>
                                <span>Name</span>
                                <span>Pipeline Stage</span>
                                <span>Status</span>
                                <span>Submmitted at</span>
                                <span></span>
                            </div>

                            <div className='flex flex-col w-full h-[300px] overflow-y-auto thin-scrollbar gap-1'>
                                {recentInquiries.length > 0 ? (
                                    <>
                                        {recentInquiries.map(recent => (
                                            <div key={recent.id} className='grid grid-cols-[10%_20%_20%_20%_15%_15%] place-items-center justify-items-center w-full text-[14px] text-[#1D242B] border border-[#1D242B]/20 py-2 font-bold rounded-[5px] bg-[#C7EEFF]/50'>
                                                <span>{recent.room_uuid}</span>
                                                <span>{recent.fullname}</span>
                                                {/* <span>{formatDate(recent.target_move_in)}</span> */}
                                                <span>{recent.ghl_pipeline_stage}</span>
                                                <span>{recent.ghl_status.charAt(0).toUpperCase() + recent.ghl_status.slice(1).toLowerCase()}</span>
                                                <span>{timeAgo(recent.created_at)}</span>
                                                <Link href={`/admin/inquiry?page=1&search=${recent.room_uuid}`} className='cursor-pointer flex items-center gap-1 bg-[#0077C0]/50 hover:bg-[#0077C0]/75 active:bg-[#0077C0]/50 rounded-full px-2 py-1 text-[12px]'>
                                                    <span>View</span>
                                                    <ArrowRight className="w-[15px] h-[15px] stroke-[#1D242B] stroke-2" />
                                                </Link>
                                            </div>
                                        ))}

                                        <div className='flex items-center justify-center w-full py-2'>
                                            <Link href={'/admin/inquiry'} className='flex items-center gap-1 opacity-80 px-3 py-1 hover:bg-[#0077C0]/15 hover:opacity-100 active:bg-[#FAFAFA] active:translate-x-1 rounded-full transition-all duration-100'>
                                                <span className='text-[#0077C0] font-bold text-[14px]'>View all inquiries</span>
                                                <ArrowRight className="w-[20px] h-[20px] stroke-[#0077C0] stroke-2" />
                                            </Link>
                                        </div>
                                    </>
                                ) : (
                                    <div className='flex items-center justify-center w-full h-full'>
                                        <span className='text-[14px] font-bold'>Nothing to show yet</span>
                                    </div>
                                )}
                                    


                            </div>
                        </div>
                    </div>

                    <div className='flex flex-col w-full h-full gap-2 border border-[#1D242B]/50 rounded-[10px] p-4'>
                        <div className='flex items-center justify-between w-full'>
                            <div className='flex items-center gap-2'>
                                <span className='text-[22px] text-[#1D242B]/90 font-bold'>Top Performing Rooms</span>
                                <Arrow className="w-[25px] h-[25px]" />
                            </div>

                            <Link href={'/admin/room-listing'} className='flex items-center gap-1 opacity-80 hover:opacity-100 active:translate-x-1 transition-all duration-100'>
                                <span className='text-[#0077C0] font-bold text-[14px]'>View all rooms</span>
                                <ArrowRight className="w-[20px] h-[20px] stroke-[#0077C0] stroke-2" />
                            </Link>
                        </div>

                        <div className='flex flex-col w-full h-full gap-[1rem]'>

                            <div className='grid grid-cols-3 w-full gap-1'>
                                <div className='flex items-center gap-2'>
                                    <Filter className="w-[15px] h-[15px]" />
                                    <span className='text-[14px] opacity-90 font-bold'>Filter</span>
                                </div>

                                <input type="radio" name='room_type' id='bedspace' hidden checked={roomType === 'bedspace'} onChange={() => setRoomType('bedspace')}/>
                                <label htmlFor="bedspace"
                                className={`flex items-center justify-center cursor-pointer text-[12px] font-bold border border-[#1D242B]/50 rounded-[5px] px-2 w-full ${roomType === 'bedspace' ? 'bg-[#1D242B] text-[#FAFAFA]' : 'bg-[#FAFAFA] text-[#1D242B]/90'}`}>Bedspace</label>

                                <input type="radio" name='room_type' id='apartment' hidden checked={roomType === 'apartment'} onChange={() => setRoomType('apartment')}/>
                                <label htmlFor="apartment"
                                className={`flex items-center justify-center cursor-pointer text-[12px] text-[#1D242B]/90 font-bold border border-[#1D242B]/50 rounded-[5px] px-2 w-full ${roomType === 'apartment' ? 'bg-[#1D242B] text-[#FAFAFA]' : 'bg-[#FAFAFA] text-[#1D242B]/90'}`}>Apartment</label>
                            </div>

                            <div className='grid grid-cols-[25%_50%_25%] justify-items-center place-items-center text-[12px] text-[#1D242B]/50 font-bold pb-1 w-full'>
                                <span>Room ID</span>
                                <span>Name</span>
                                <span>Inquiries</span>
                            </div>

                            <div className='flex flex-col w-full h-full overflow-y-auto thin-scrollbar gap-1'>
                                {filteredRooms.length > 0 ? (
                                    filteredRooms.map(room => (
                                        <div key={room.room_uuid} className='grid grid-cols-[25%_50%_25%] justify-items-center place-items-center w-full text-[14px] text-[#1D242B] border border-[#1D242B]/20 py-2 font-bold rounded-[5px] bg-[#C7EEFF]/50'>
                                            <span>{room.room_uuid}</span>
                                            <span className='w-[250px] truncate text-center'>{room.title}</span>
                                            <span>{room.inquiry_count}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className='flex items-center justify-center w-full h-full'>
                                        <span className='text-[14px] font-bold'>Nothing to show yet</span>
                                    </div>
                                )}


                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}