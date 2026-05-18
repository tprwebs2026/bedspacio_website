"use client"

import { useState } from "react";
import Link from "next/link";
import { InquiryModalType } from "./page"
import { BASE_URL } from '@/config/config'

import Arrow from '@/asset/icon/arrow-long.svg'
import Close from '@/asset/icon/close.svg'
import { updateStatusById } from "../../../../lib/inquiry";

interface InquiryModalProps {
    modalOpen: () => void;
    inquiry: InquiryModalType
    onSuccess: () => void
}


export default function InquiryModalWrapper ({ modalOpen, inquiry, onSuccess }: InquiryModalProps) {

    const [status, setStatus] = useState(inquiry.status)
    // const [newStatus, setNewStatus] = useState<string>('');


    const handleUpdateStatus = async (id: number, status: string) => {
        try {
            if (status === inquiry.status) return;

            await updateStatusById(id, status); 

            console.log('converted');

            onSuccess();
            modalOpen();

            return console.log('Status updated');
        } catch (err) {
            console.error('Failed to update status');
        }
    }

    return (
        <div className="relative flex flex-col w-[600px] max-h-[700px] overflow-y-auto bg-[#FAFAFA] rounded-[10px] border-2 border-[#1D242B]/50 p-[2rem] gap-[1rem]">
            <div className="flex items-center w-full justify-between">
                <span className="text-[28px] font-bold">Inquiry Information</span>
                <button onClick={modalOpen} className="p-1 bg-[#FAFAFA] hover:bg-[#1D242B]/15 active:bg-[#FAFAFA] rounded-full cursor-pointer">
                    <Close className="w-[30px] h-[30px] stroke-[#1D242B] stroke-2" />
                </button>
            </div>

            <div className="flex flex-col w-full gap-[1rem]">

                <div className="flex flex-col items-start w-full">
                    <span className="font-bold">Type </span>
                    <span className="w-full py-2 px-3 rounded-[10px] border border-[#1D242B]/25">{inquiry.type}</span>
                </div>

                <div className="flex flex-col items-start w-full">
                    <span className="font-bold">Sent by</span>
                    <span className="w-full py-2 px-3 rounded-[10px] border border-[#1D242B]/25">{inquiry.fullname}</span>
                </div>

                <div className="flex flex-col items-start w-full">
                    <span className="font-bold">Email</span>
                    <span className="w-full py-2 px-3 rounded-[10px] border border-[#1D242B]/25">{inquiry.email}</span>
                </div>
                
                <div className="flex flex-col items-start w-full">
                    <span className="font-bold">Contact number</span>
                    <span className="w-full py-2 px-3 rounded-[10px] border border-[#1D242B]/25">{inquiry.contact_number}</span>
                </div>

                {inquiry.type === 'room_inquiry' && (
                    <>
                        <div className="flex flex-col items-start w-full">
                            <span className="font-bold">Room ID</span>

                            <div className="flex items-center justify-between w-full py-2 px-3 rounded-[10px] border border-[#1D242B]/25">
                                <span className="w-full">{inquiry.room_uuid}</span>
                                
                                <Link href={`/admin/room-listing/${Number(inquiry.room_id)}`} target={'_blank'} className="flex items-center whitespace-nowrap text-[14px] text-[#1D242B]/90 font-bold opacity-50 hover:opacity-100 active:opacity-75 cursor-pointer">
                                    <span className="px-2">Check room</span>
                                    <Arrow className="w-[22px] h-[22px] fill-none" />
                                </Link>
                            </div>
                        </div>

                        <div className="flex flex-col items-start w-full">
                            <span className="font-bold">Target Move-In (yyyy-mm-dd)</span>
                            <span className="w-full py-2 px-3 rounded-[10px] border border-[#1D242B]/25">{inquiry.target_move_in.split("T")[0].split("-").join('-')}</span>
                        </div>

                        <div className="flex flex-col items-start w-full">
                            <span className="font-bold">Months of Stay</span>
                            <span className="w-full py-2 px-3 rounded-[10px] border border-[#1D242B]/25">{inquiry.months_of_stay} Months</span>
                        </div>

                        <div className="flex flex-col items-start w-full">
                            <span className="font-bold">Work Schedule</span>
                            <span className="w-full py-2 px-3 rounded-[10px] border border-[#1D242B]/25">{inquiry.schedule}</span>
                        </div>
                    </>
                )}
                

                <div className="flex flex-col items-start w-full">
                    <span className="font-bold">Message</span>
                    <textarea id="messagge" rows={5} disabled value={inquiry.message} className="resize-none w-full py-2 px-3 rounded-[10px] border border-[#1D242B]/25"></textarea>
                </div>

                <div className="flex flex-col items-start w-full">
                    <span className="font-bold">Status</span>
                    <div className="flex items-center w-full border-2 border-dashed border-[#1D242B]/25">
                        
                        <label htmlFor="pending" className={`flex items-center justify-center w-full font-bold p-2 border-r-2 border-dashed border-r-[#1D242B]/25 cursor-pointer hover:bg-[#1D242B]/15 ${status === 'pending' ? 'bg-[#1D242B]/15 text-[#1D242B]/75' : 'bg-[#FAFAFA] text-[#1D242B]'}`}>
                            <input type="radio" name="status" id="pending" hidden checked={status === 'pending'} onChange={() => { setStatus('pending'); handleUpdateStatus(inquiry.id, 'pending'); }}/>
                            <span>Pending</span>
                        </label>

                        <label htmlFor="contacted" className={`flex items-center justify-center w-full font-bold p-2 border-r-2 border-dashed border-r-[#1D242B]/25 cursor-pointer hover:bg-[#1D242B]/15 ${status === 'contacted' ? 'bg-[#FFEF90] text-[#FF6308]/75' : 'bg-[#FAFAFA] text-[#1D242B]'}`}>
                            <input type="radio" name="status" id="contacted" hidden checked={status === 'contacted'} onChange={() => { setStatus('contacted'); handleUpdateStatus(inquiry.id, 'contacted'); }}/>
                            <span>Contacted</span>
                        </label>
                        
                        <label htmlFor="converted" className={`flex items-center justify-center w-full font-bold p-2 border-r-2 border-dashed border-r-[#1D242B]/25 cursor-pointer hover:bg-[#1D242B]/15
                            ${status === 'converted' ? 'bg-[#007C00]/15 text-[#007C00]/75' : 'bg-[#FAFAFA] text-[#1D242B]'}`}>
                            <input type="radio" name="status" id="converted" hidden checked={status === 'converted'} onChange={() => { setStatus('converted'); handleUpdateStatus(inquiry.id, 'converted'); }}/>
                            <span>Converted</span>
                        </label>

                        <label htmlFor="closed" className={`flex items-center justify-center w-full font-bold p-2 cursor-pointer hover:bg-[#1D242B]/15 ${status === 'closed' ? 'bg-[#FE230A]/15 text-[#FE230A]/75' : 'bg-[#FAFAFA] text-[#1D242B]'}`}>
                            <input type="radio" name="status" id="closed" hidden checked={status === 'closed'} onChange={() => { setStatus('closed'); handleUpdateStatus(inquiry.id, 'closed') }}/>
                            <span>Closed</span>
                        </label>
                    </div>
                </div>

                <span className="text-[14px] opacity-75">Submitted at {inquiry.created_at.split("T")[0].split("-").join('-')} by user with IP: {inquiry.ip_address}</span>
            </div>
        </div>
    )
}