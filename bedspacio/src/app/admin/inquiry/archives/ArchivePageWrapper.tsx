"use client"

import { useState } from "react"
import Link from "next/link";
import { ArchiveType, ArchiveModalType } from "./page"
import { deleteSingleArchived, getArchivedInquiries, getArchivedSingleById } from "../../../../../lib/inquiry";
import ArchiveModalWrapper from "./ArchiveModalWrapper";

// icons
import Arrow from '@/asset/icon/arrow-right.svg'

// Toast
import ErrorToast from "@/components/admin/Toast/ErrorToast";
import SuccessToast from "@/components/admin/Toast/SuccessToast";
import ConfirmWindow from "@/components/admin/Toast/ConfirmWindow";


interface ArchiveProp {
    archives: ArchiveType[]
}

export default function ArchivePageWrapper ({ archives }: ArchiveProp) {

    const [checkList, setCheckList] = useState<number[]>([]);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [archivedInquiry, setArchivedInquiry] = useState<ArchiveModalType | null>(null);
    const [archiveList, setArchiveList] = useState<ArchiveType[]>(archives)

    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [sender, setSender] = useState<string>('')

    const [errorMessage, setErrorMessage] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');

    const [confirmType, setConfirmType] = useState<'single' | 'multiple'| null>(null);

    const viewInquiryModal = async (id: number) => {
        const archived = await getArchivedSingleById(id);

        if (!archived) return null;

        setModalOpen(true);
        setArchivedInquiry(archived);
    }

    const loadArchives = async () => {
        try {
            const response = await getArchivedInquiries();
            setArchiveList(response);

        } catch (err) {
            console.log('Failed to retreive archived inquiries');
        } 
    };



    const handleDeleteSingleArchive = async (id: number) => {
        try {
            const archiveDeleted = await deleteSingleArchived(id);

            if (archiveDeleted) {
                await loadArchives();

                setSuccessMessage('Deleted archive successfully');
                setTimeout(() => setSuccessMessage(''), 3500);

                setSelectedId(null);
                setConfirmType(null);
                setModalOpen(prev => !prev)
            };

            console.log('Deleted single archive: ', archiveDeleted);

        } catch (err: any) {
            setErrorMessage(
                err.response?.data?.message
            );

            setTimeout(() => setErrorMessage(''), 2500);
            return;
        }
    }


    const resetModal = () => {
        setModalOpen(false);
        setSelectedId(null);
        setSender('');
    };


    return (
        <>
            <div className="flex w-full min-h-screen">
                <div className="flex flex-col w-full px-[8rem] py-[2rem] gap-[2rem]">
                    
                    <div className="flex items-center justify-between w-full">
                        <span className="text-[28px] text-[#1D242B] font-bold leading-tight">Archived Inquiries</span>

                        <Link href={'/admin/inquiry'} className="flex items-center gap-2 rounded-full bg-[#1D242B]/15 hover:bg-[#1D242B]/30 active:bg-[#1D242B]/15 px-2 py-1 cursor-pointer transition-all duration-100">
                            <span className="font-bold pl-2">Inquiry list</span>
                            <Arrow className="w-[20px] h-[20px]" />
                        </Link>
                    </div>


                    <div className="flex flex-col w-full">
                        
                        <div className="grid grid-cols-[5%_10%_15%_20%_20%_20%_10%] justify-items-center border-b border-b-[#1D242B]/45 px-[1rem] py-1">
                            <span></span>
                            <span className="text-[14px] text-[#1D242B]/75">Inqiury Type</span>
                            <span className="text-[14px] text-[#1D242B]/75">Name</span>
                            <span className="text-[14px] text-[#1D242B]/75">Email</span>
                            <span className="text-[14px] text-[#1D242B]/75">Status</span>
                            <span className="text-[14px] text-[#1D242B]/75">Submitted at (yyy-mm-dd)</span>
                        </div>

                        <div className="flex flex-col w-full">
                                {archiveList.map(arch => (
                                    <div key={arch.id} 
                                    className="grid grid-cols-[5%_10%_15%_20%_20%_20%_10%] border-b border-b-[#1D242B]/15 py-3 place-items-center justify-items-center hover:bg-[#C7EEFF]/25 px-[1rem] transition-all duration-100">
                                        <input type="checkbox" name="inquiry_checker" id={`inquiry_${arch.id}`} 
                                            checked={checkList.includes(arch.id)}
                                            onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setCheckList( prev => [arch.id, ...prev] )
                                                    } else {
                                                        setCheckList( prev => prev.filter(id => id !== arch.id))
                                                    }
                                                }
                                            }
                                        />    

                                        <span className={` px-2 py-1 rounded-full text-[14px] font-bold
                                                ${arch.type === 'room_inquiry' 
                                                    ? 'bg-[#0077C0]/25 text-[#0077C0]' 
                                                    : 'bg-[#1D242B]/25 text-[#1D242B]/75'}
                                            `}>
                                            {arch.type}
                                        </span>
                                        <span>{arch.fullname}</span>
                                        <span>{arch.email}</span>
                                        <span 
                                            className={`px-2 py-1 text-[14px] font-bold w-fit rounded-full
                                            ${arch.status === 'pending' 
                                                ? 'text-[#1D242B] bg-[#1D242B]/15'
                                                : arch.status === 'contacted' 
                                                    ? 'text-[#FF6308]/75 bg-[#FFEF90]/25'
                                                    : arch.status === 'converted'
                                                        ? 'text-[#007C00] bg-[#007C00]/15'
                                                        : 'text-[#FE230A] bg-[#FE230A]/15'
                                            }
                                        `}>{arch.status}</span>
                                        <span>{arch.created_at.split("T")[0].split("-").join('-')}</span>
                                        <button onClick={() => {
                                            viewInquiryModal(arch.id);
                                            setSender(arch.fullname)
                                            setSelectedId(arch.id);
                                        }} className="flex items-center cursor-pointer rounded-full bg-[#1D242B]/10 hover:bg-[#0077C0]/25 active:bg-[#1D242B]/10 px-2">
                                            <span className="px-2 text-[#1D242B] text-[14px] font-bold">View</span>
                                            <Arrow className="w-[20px] h-[29px]" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        
                    </div>

                </div>
            </div>



            {modalOpen && archivedInquiry && (
                <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
                    <ArchiveModalWrapper
                        archives={archivedInquiry}
                        modalOpen={() => setModalOpen(false)}
                        setSuccessMessage={setSuccessMessage}
                        setErrorMessage={setErrorMessage}
                        onSuccess={loadArchives}
                        onDelete={() => setConfirmType('single')}
                    />
                </div>
            )}


            {confirmType === 'single' && (
                <ConfirmWindow 
                    title={'Delete Archived Inquiry'}
                    message={`You are about to delete an archived inquiry from ${sender}. Do you want to proceed?`}
                    onCancel={() =>{
                        setConfirmType(null);
                        setSelectedId(null)
                    }}
                    onConfirm={async () => {
                        await handleDeleteSingleArchive(Number(selectedId));
                        await loadArchives();
                        setConfirmType(null);
                        resetModal();
                    }}
                />
            )}


            {errorMessage && <ErrorToast message={errorMessage} />}
            {successMessage && <SuccessToast message={successMessage} />}

        </>
    )
}