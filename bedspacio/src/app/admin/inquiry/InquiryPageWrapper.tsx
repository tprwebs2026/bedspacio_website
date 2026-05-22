"use client"

import { useEffect, useState } from "react";

// icons
import Arrow from '@/asset/icon/arrow-right.svg'
import Menu from '@/asset/icon/menu-three-dots.svg'
import ArchiveIcon from '@/asset/icon/archive.svg'

// toast
import ErrorToast from "@/components/admin/Toast/ErrorToast";
import SuccessToast from "@/components/admin/Toast/SuccessToast";

import { InquiryPageType, InquiryModalType } from "./page"
import InquiryModalWrapper from "./InquiryModalWrapper";
import { getAllInquiry, getInquiryById, deleteSingleInquiry, deleteMultipleInquiry, archiveInquirySingle, archiveInquiryMultiple } from "../../../../lib/inquiry";
import WindowDeleteMultiple from "@/components/admin/WindowDeleteMultiple";
import ConfirmWindow from "@/components/admin/Toast/ConfirmWindow";
import Link from "next/link";

interface InquiryPageProp {
    inquiries: InquiryPageType[];
}

export default function InquiryPageWrapper ({ inquiries }: InquiryPageProp) {


    const [inquiryList, setInquiryList] = useState<InquiryPageType[]>(inquiries)
    const [inquiry, setInquiry] = useState<InquiryModalType | null>(null);

    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [sender, setSender] = useState<string>('');

    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [menuOpen, setMenuOpen] = useState<boolean>(false);

    const [checkList, setCheckList] = useState<number[]>([]);
    const [confirmOpen, setConfirmOpen] = useState<boolean>(false)
    const [confirmType, setConfirmType] = useState<'single' | 'multiple' | 'archive' | 'archive_single' | null>(null);

    const [errorMessage, setErrorMessage] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');

    const viewModal = async (id: number) => {
        const inquiry = await getInquiryById(id);

        if (!inquiry) return null;

        setModalOpen(true)
        setInquiry(inquiry);
    }

    const loadInquiries = async () => {
        const response = await getAllInquiry();
        setInquiryList(response);
    }


    const resetModal = () => {
        setModalOpen(false);
        setInquiry(null);
        setSelectedId(null);
        setSender('');
    };


    const handleDeleteSingle = async (id: number) => {
        try {

            const deleted = await deleteSingleInquiry(id);

            if (deleted) {
                await loadInquiries();

                setSuccessMessage('Delete successful');
                setTimeout(() => setSuccessMessage(''), 2500);

                setSelectedId(null);
                setConfirmType(null);
            }

            console.log('delete report: ', deleted);

        } catch (err: any) {
            setErrorMessage(
                err.response?.data?.message
            );

            setTimeout(() => setErrorMessage(''), 2500);
            return;
        }
    }


    const handleDeleteMultiple = async (ids: number[]) => {
        try {

            console.log('ids: ', ids);

            const response = await deleteMultipleInquiry(ids);
            const data = response.data;

            await loadInquiries();

            if (data.deleted.length > 0) {
                setSuccessMessage(`Successfully deleted ${data.deleted.length} inquiries.`);
                setTimeout(() => setSuccessMessage(''), 2500);
            }

            if (data.not_closed.length > 0) {
                setErrorMessage(
                    `Some inquiries were not deleted due to 'unclosed' status`
                );

                setTimeout(() => setErrorMessage(''), 5000);
            }

            if (data.not_found.length > 0) {
                const messages = data.not_found
                    .map((n: any) => `ID ${n.id} not found`)
                    .join(', ');

                setErrorMessage(`Not found: ${messages}`);

                setTimeout(() => setErrorMessage(''), 3500);
            }

            setCheckList([]);
            setConfirmType(null);

            console.log('Deleted: ', response.data.deleted);
            console.log('Skipped: ', response.data.skipped);


        } catch (err: any) {
            setErrorMessage(
                err.response?.data?.message
            );

            setTimeout(() => setErrorMessage(''), 3500);
            return;
        }
    };


    const handleArchiveSingle = async (id: number) => {
        try {
            const archive = await archiveInquirySingle(id);

            if (archive) {
                setSuccessMessage('Inquiry archived successfully!');
                setTimeout(() => setSuccessMessage(''), 3500);

                return;
            }

            console.log('Archived: ', archive);

        } catch (err) {
            console.error('Failed to archive inquiry: ', err);

            setErrorMessage('Failed to archive inquiry');
            setTimeout(() => setErrorMessage(''), 3500);
        }
    }


    const handleArchiveMultiple = async (ids: number[]) => {
        try {
            
            if (!Array.isArray(ids)) {
                setErrorMessage('Ids must be an array of id');
                setTimeout(() => setErrorMessage(''), 3500);

                return;
            }

            const response = await archiveInquiryMultiple(ids);
            const data = response.data;

            await loadInquiries();

            if (data.archived.length > 0) {
                setSuccessMessage(`Successfully archived ${data.archived.length} inquiries.`);

                setTimeout(() => setSuccessMessage(''), 3500)
            }

            setCheckList([]);
            setConfirmType(null);


        } catch (err: any) {
            
            setErrorMessage(
                err?.response?.data?.message
            );

            setTimeout(() => setErrorMessage(''), 3500);
            return;
        }
    }

    

    useEffect(() => {
        console.log('check list: ', checkList);
        console.log('How many? ', checkList.length);
    }, [checkList])

    return (
        <>
            <div className="flex w-full min-h-screen">
                <div className="flex flex-col w-full px-[8rem] py-[2rem] gap-[2rem]">

                    <div className="flex items-center justify-between w-full">
                        <span className="text-[28px] text-[#1D242B] font-bold leading-tight">Inquiry</span>

                        <div className="relative flex flex-col">
                            <button onClick={() => setMenuOpen(prev => !prev)} className="flex item-center justify-center cursor-pointer bg-[#1D242B]/15 hover:bg-[#1D242B]/30 active:bg-[#1D242B]/15 rounded-full p-2 transitional-all duration-100">
                                <Menu className="w-[20px] h-[20px]" />
                            </button>

                            {menuOpen && (
                                <div className="absolute top-7 right-5 flex flex-col bg-[#FAFAFA] gap-1 p-1 rounded-[10px] border border-[#1D242B]/25">
                                    <Link href={'/admin/inquiry/archives'} className="flex items-center p-1 cursor-pointer bg-[#0077C0]/25 hover:bg-[#0077C0]/40 active:bg-[#0077C0]/25 rounded-[8px] transition-all duration-100">
                                        <ArchiveIcon className="w-[20px] h-[20px]" />
                                        <span className="px-2 text font-bold bg-[#]">Archives</span>
                                    </Link>
                                </div>
                            )}
                        </div>
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
                            {inquiryList.map(inquiry => (
                                <div key={inquiry.id} 
                                className="grid grid-cols-[5%_10%_15%_20%_20%_20%_10%] border-b border-b-[#1D242B]/15 py-3 place-items-center justify-items-center hover:bg-[#C7EEFF]/25 px-[1rem] transition-all duration-100">
                                    <input type="checkbox" name="inquiry_checker" id={`inquiry_${inquiry.id}`} 
                                        checked={checkList.includes(inquiry.id)}
                                        onChange={(e) => {
                                                if (e.target.checked) {
                                                    setCheckList( prev => [inquiry.id, ...prev] )
                                                } else {
                                                    setCheckList( prev => prev.filter(id => id !== inquiry.id))
                                                }
                                            }
                                        }
                                    />    

                                    <span className={` px-2 py-1 rounded-full text-[14px] font-bold
                                            ${inquiry.type === 'room_inquiry' 
                                                ? 'bg-[#0077C0]/25 text-[#0077C0]' 
                                                : 'bg-[#1D242B]/25 text-[#1D242B]/75'}
                                        `}>
                                        {inquiry.type}
                                    </span>
                                    <span>{inquiry.fullname}</span>
                                    <span>{inquiry.email}</span>
                                    <span 
                                        className={`px-2 py-1 text-[14px] font-bold w-fit rounded-full
                                        ${inquiry.status === 'pending' 
                                            ? 'text-[#1D242B] bg-[#1D242B]/15'
                                            : inquiry.status === 'contacted' 
                                                ? 'text-[#FF6308]/75 bg-[#FFEF90]/25'
                                                : inquiry.status === 'converted'
                                                    ? 'text-[#007C00] bg-[#007C00]/15'
                                                    : 'text-[#FE230A] bg-[#FE230A]/15'
                                        }
                                    `}>{inquiry.status}</span>
                                    <span>{inquiry.created_at.split("T")[0].split("-").join('-')}</span>
                                    <button onClick={() => {
                                            setSelectedId(inquiry.id);
                                            setSender(inquiry.fullname)
                                            viewModal(inquiry.id);
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

            {modalOpen && inquiry && (
                <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
                    <InquiryModalWrapper 
                        modalOpen={() => setModalOpen(false)}
                        inquiry={inquiry}
                        onSuccess={loadInquiries}
                        onDelete={() => setConfirmType('single')}
                        onArchiveSingle={() => setConfirmType('archive_single')}
                        successMessage={(msg) => setSuccessMessage(msg)}
                        errorMessage={(msg) => setErrorMessage(msg)}
                    />
                </div>
            )}

            {checkList.length > 0 && (
                <div className="z-20">
                    <WindowDeleteMultiple 
                        count={checkList.length}
                        ids={checkList}
                        onCancel={() => setCheckList([])}
                        onConfirm={() => setConfirmType('multiple')}
                        onArchive={() => setConfirmType('archive')}   /// add the function here first 
                    />
                </div>
            )}

            {confirmType === 'multiple' && checkList.length > 0 && selectedId === null &&  (
                <ConfirmWindow 
                    title={`Delete Inquiries`}
                    message={`You will be deleting ${checkList.length} inquiries. Do you want to proceed`}
                    onCancel={() => {
                        setConfirmType(null)
                        // setCheckList([]);
                    }}
                    onConfirm={async () => {
                        await handleDeleteMultiple(checkList);
                        setConfirmType(null);
                        resetModal();
                    }}
                />
            )}

            {confirmType === 'single' && (
                <ConfirmWindow
                    title={'Delete Inquiry'}
                    message={`You are about to delete an inquiry from ${sender}. Do you want to proceed?`}
                    onCancel={() => {
                        setConfirmType(null);
                        setSelectedId(null);
                    }}
                    onConfirm={async () => {
                        await handleDeleteSingle(Number(selectedId));
                        await loadInquiries();
                        setConfirmType(null)
                        resetModal();
                    }}
                />
            )}

            {confirmType === 'archive' && (
                <ConfirmWindow
                    title={'Archive Inquiries'}
                    message={`You will be archiving ${checkList.length} inquiries. Do you want to proceed?`}
                    onCancel={() => {
                        setConfirmType(null);
                        setCheckList([]);
                    }}
                    onConfirm={async () => {
                        await handleArchiveMultiple(checkList); 
                        await loadInquiries(); 
                        setConfirmType(null) 
                        resetModal(); 
                    }}
                />
            )}

            {confirmType === 'archive_single' && (
                <ConfirmWindow
                    title={'Archive Inquiry'}
                    message={`You are about to archive an inquiry from ${sender}. Do you want to proceed?`}
                    onCancel={() => {
                        setConfirmType(null);
                        setSelectedId(null);
                    }}
                    onConfirm={async () => {
                        await handleArchiveSingle(Number(selectedId)); // change this to handleArchiveMultiple
                        await loadInquiries(); 
                        setConfirmType(null) 
                        resetModal(); 
                    }}
                />
            )}


            {errorMessage && <ErrorToast message={errorMessage} />}
            {successMessage && <SuccessToast message={successMessage} />}
        </>
    )
}