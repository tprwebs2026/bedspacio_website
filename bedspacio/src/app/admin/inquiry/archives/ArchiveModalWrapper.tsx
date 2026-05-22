"use client"

import { useState } from 'react';
import Link from 'next/link';

// icons
import Menu from '@/asset/icon/menu-three-dots.svg'
import Arrow from '@/asset/icon/arrow-right.svg'
import Note from '@/asset/icon/note.svg'

// types
import { ArchiveModalType } from './page';
import { unarchivedInquirySingle } from '../../../../../lib/inquiry';

interface ArchiveModalProps {
    archives: ArchiveModalType;
    modalOpen: () => void;
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>
    setSuccessMessage: React.Dispatch<React.SetStateAction<string>>
    onSuccess: () => void;
    onDelete: () => void;
}

export default function ArchiveModalWrapper ({ archives, modalOpen, setErrorMessage, setSuccessMessage, onSuccess, onDelete }: ArchiveModalProps) {

    const [menuOpen, setMenuOpen] = useState<boolean>(false)

    const [status, setStatus] = useState(archives.status)
    const [notesOpen, setNotesOpen] = useState(
        archives.inquiry_logs.length > 0
    );

    const [loading, setLoading] = useState<boolean>(false)


    const handleUnarchiveInquiry = async (id: number) => {
        setLoading(true)

        try {

            await new Promise<void>((resolve) => {
                setTimeout(() => {
                    setLoading(true);
                    resolve();
                }, 1500);
            });

            const response = await unarchivedInquirySingle(id);

            if (response) {
                
                modalOpen();
                onSuccess();
                setSuccessMessage('Inquiry restored successfully!');
                setTimeout(() => setSuccessMessage(''), 3500);

                return;
            }

            return console.log('Unarchived goooooood');

        } catch (err) {
            console.error('Failed to unarchive inquiry: ', err);

            setErrorMessage('Failed to unarchive inquiry.');
            setTimeout(() => setErrorMessage(''), 3500);
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            {loading && (
                <div className="absolute flex items-center justify-center h-full w-full bg-[#1D242B]/50 z-20" >
                    <span className="text-[#FAFAFA] font-bold">...loading</span>
                </div>
            )}

            <div className="flex flex-col w-auto h-auto bg-[#FAFAFA] rounded-[10px] border-2 border-[#1D242B]/50 p-[2rem] gap-[1rem]">

                <div className={`relative grid ${notesOpen  ? 'grid-cols-[auto_auto]' : 'grid-cols-[auto_auto]'} overflow-x-hidden`}>
                    <div className={`relative flex flex-col w-[500px] max-h-[600px]  gap-[1rem]`}>
                        <div className="flex items-center w-full justify-between">
                            <div className='flex items-center gap-2'>
                                <span className="text-[28px] font-bold">Inquiry Information</span>
                                <span className='text-[12px] rounded-[15px] bg-[#1D242B]/15 opacity-75 font-bold px-3 py-1'>Archived</span>
                            </div>

                            <div className="relative flex">
                                <button onClick={() => setMenuOpen(prev => !prev)} className="cursor-pointer bg-[#1D242B]/10 hover:bg-[#1D242B]/20 active:bg-[#1D242B]/10 rounded-full p-2">
                                    <Menu className={`w-[20px] h-[20px] ${menuOpen ? 'rotate-90' : 'rotate-180' } transition-all duration-100`} />
                                    <span></span>
                                </button>

                                {menuOpen && (
                                    <div className="absolute top-5 right-8 flex flex-col gap-1 border-1 border-[#1D242B]/25 rounded-[10px] p-1 bg-[#FAFAFA]">
                                        <button onClick={() => handleUnarchiveInquiry(archives.id)} className="flex items-center justify-center bg-[#089545]/20 hover:bg-[#1D242B]/20 active:bg-[#1D242B]/10 p-2 rounded-[8px] cursor-pointer">
                                            <span className="font-bold text-[#089545] text-[14px] px-2">Unarchive</span>
                                        </button>
                                        <button onClick={onDelete} className="flex items-center justify-center bg-[#1D242B]/10 hover:bg-[#1D242B]/20 active:bg-[#1D242B]/10 p-2 rounded-[8px] cursor-pointer">
                                            <span className="font-bold text-[#1D242B] text-[14px] px-2">Delete</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col w-full gap-[1rem] h-full overflow-y-scroll thin-scrollbar">

                            <div className="flex flex-col items-start w-full">
                                <span className="font-bold">Type </span>
                                <span className="w-full py-2 px-3 rounded-[10px] border border-[#1D242B]/25">{archives.type}</span>
                            </div>

                            <div className="flex flex-col items-start w-full">
                                <span className="font-bold">Sent by</span>
                                <span className="w-full py-2 px-3 rounded-[10px] border border-[#1D242B]/25">{archives.fullname}</span>
                            </div>

                            <div className="flex flex-col items-start w-full">
                                <span className="font-bold">Contact number</span>
                                <span className="w-full py-2 px-3 rounded-[10px] border border-[#1D242B]/25">{archives.contact_number}</span>
                            </div>

                            <div className="flex flex-col items-start w-full">
                                <span className="font-bold">Email</span>
                                <span className="w-full py-2 px-3 rounded-[10px] border border-[#1D242B]/25">{archives.email}</span>
                            </div>

                            {archives.type === 'general_inquiry' && (
                                <div className="flex flex-col items-start w-full">
                                    <span className="font-bold">Subject</span>
                                    <span className="w-full py-2 px-3 rounded-[10px] border border-[#1D242B]/25">{archives.subject}</span>
                                </div>
                                )}

                            {archives.type === 'room_inquiry' && (
                                <>
                                    <div className="flex flex-col items-start w-full">
                                        <span className="font-bold">Room ID</span>

                                        <div className="flex items-center justify-between w-full py-2 px-3 rounded-[10px] border border-[#1D242B]/25">
                                            <span className="w-full">{archives.room_uuid}</span>
                                            
                                            {archives.room_id ? (
                                                <Link href={`/admin/room-listing/${Number(archives.room_id)}`} target={'_blank'} className="flex items-center whitespace-nowrap text-[14px] text-[#1D242B]/90 font-bold opacity-50 hover:opacity-100 active:opacity-75 cursor-pointer">
                                                    <span className="px-2">Check room</span>
                                                    <Arrow className="w-[22px] h-[22px] fill-none" />
                                                </Link>
                                            ) : (
                                                <span className=" cursor-not-allowed whitespace-nowrap text-[14px] text-[#1D242B]/90 font-bold opacity-50">Room deleted</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-start w-full">
                                        <span className="font-bold">Target Move-In (yyyy-mm-dd)</span>
                                        <span className="w-full py-2 px-3 rounded-[10px] border border-[#1D242B]/25">{archives.target_move_in.split("T")[0].split("-").join('-')}</span>
                                    </div>

                                    <div className="flex flex-col items-start w-full">
                                        <span className="font-bold">Months of Stay</span>
                                        <span className="w-full py-2 px-3 rounded-[10px] border border-[#1D242B]/25">{archives.months_of_stay} Months</span>
                                    </div>

                                    <div className="flex flex-col items-start w-full">
                                        <span className="font-bold">Work Schedule</span>
                                        <span className="w-full py-2 px-3 rounded-[10px] border border-[#1D242B]/25">{archives.schedule}</span>
                                    </div>
                                </>
                            )}
                            

                            <div className="flex flex-col items-start w-full">
                                <span className="font-bold">Message</span>
                                <textarea id="messagge" rows={5} disabled value={archives.message} className="resize-none w-full py-2 px-3 rounded-[10px] border border-[#1D242B]/25"></textarea>
                            </div>

                            <div className="flex flex-col items-start w-full">
                                <span className="font-bold">Status</span>
                                <div className="flex items-center w-full border-2 border-dashed border-[#1D242B]/25">
                                    
                                    <label htmlFor="pending" className={`flex items-center justify-center w-full font-bold p-2 border-r-2 border-dashed border-r-[#1D242B]/25 ${status === 'pending' ? 'bg-[#1D242B]/15 text-[#1D242B]/80' : 'bg-[#FAFAFA] text-[#1D242B] opacity-50'}`}>
                                        <span>Pending</span>
                                    </label>

                                    <label htmlFor="contacted" className={`flex items-center justify-center w-full font-bold p-2 border-r-2 border-dashed border-r-[#1D242B]/25 ${status === 'contacted' ? 'bg-[#FFEF90] text-[#FF6308]/75' : 'bg-[#FAFAFA] text-[#1D242B] opacity-50'}`}>
                                        <span>Contacted</span>
                                    </label>
                                    
                                    <label htmlFor="converted" className={`flex items-center justify-center w-full font-bold p-2 border-r-2 border-dashed border-r-[#1D242B]/25 ${status === 'converted' ? 'bg-[#007C00]/15 text-[#007C00]/75' : 'bg-[#FAFAFA] text-[#1D242B] opacity-50'}`}>
                                        
                                        <span>Converted</span>
                                    </label>

                                    <label htmlFor="closed" className={`flex items-center justify-center w-full font-bold p-2 ${status === 'closed' ? 'bg-[#FE230A]/15 text-[#FE230A]/75' : 'bg-[#FAFAFA] text-[#1D242B] opacity-50'}`}>
                                        <span>Closed</span>
                                    </label>
                                </div>
                            </div>

                            <span className="text-[14px] opacity-75">Submitted at {archives.created_at.split("T")[0].split("-").join('-')} by user with IP: {archives.ip_address}</span>
                        </div>

                    </div>

                    {notesOpen && (
                        <div className="flex flex-col w-[400px] pl-[1rem] gap-[1rem] max-h-[600px]">
                            <span className="text-[28px] font-bold">Log Notes</span>

                            <div className="flex flex-col h-full overflow-y-scroll thin-scrollbar gap-[1rem]">

                                {archives.inquiry_logs.map((logs, index) => (
                                    <div key={index} className="flex flex-col w-full gap-1 rounded-[10px] p-2 shadow-sm bg-[#C7EEFF]/50">
                                        <span className="text-[12px] font-bold opacity-50 text-left">{`Noted at ${logs.noted_at} by ${logs.noter}`}</span>
                                        <p className="w-full text-[14px] focus:outline-none leading-tight">
                                            {logs.note}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>


                <div className={`flex items-center w-full justify-end`}>
                    <div className="flex items-center gap-1">
                        <button onClick={() => setNotesOpen(prev => !prev)} className="flex items-center cursor-pointer bg-[#0077C0]/75 hover:bg-[#0077C0]/90 active:bg-[#0077C0]/75 p-2 rounded-[10px] transition-all duration-100">
                            <Note className="w-[20px] h-[20px] stroke-[#1D242B] stroke-2" />
                            <span className="px-2 font-bold text-[16px] text-[#1D242B]">{notesOpen ? 'Hide Note' : 'Show Note'}</span>
                        </button>
                        
                        <button onClick={modalOpen} className="flex items-center cursor-pointer bg-[#1D242B]/25 hover:bg-[#1D242B]/40 active:bg-[#1D242B]/75 p-2 rounded-[10px] transition-all duration-100">
                            <span className="px-2 font-bold text-[16px] text-[#1D242B]">Close</span>
                        </button>
                    </div>

                </div>
            </div>
        </>
    )
}