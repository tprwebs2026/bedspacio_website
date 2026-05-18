"use client"

import { useState } from "react";

import { InquiryPageType, InquiryModalType } from "./page"
import InquiryModalWrapper from "./InquiryModalWrapper";
import { getAllInquiry, getInquiryById } from "../../../../lib/inquiry";

interface InquiryPageProp {
    inquiries: InquiryPageType[];
}

export default function InquiryPageWrapper ({ inquiries }: InquiryPageProp) {

    console.log('Inquiries: ', inquiries);

    const [inquiryList, setInquiryList] = useState<InquiryPageType[]>(inquiries)
    const [inquiry, setInquiry] = useState<InquiryModalType | null>(null);
    const [modalOpen, setModalOpen] = useState<boolean>(false);

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

    return (
        <>
            <div className="flex w-full min-h-screen">
                <div className="flex flex-col w-full px-[8rem] py-[2rem] gap-[2rem]">

                    <div className="flex items-center justify-between w-full">
                        <span className="text-[28px] text-[#1D242B] font-bold leading-tight">Inquiry</span>
                    </div>

                    <div className="flex flex-col w-full">

                        <div className="grid grid-cols-5 justify-items-center border-b border-b-[#1D242B]/45 px-[1rem] py-1">
                            <span className="text-[14px] text-[#1D242B]/75">Inqiury Type</span>
                            <span className="text-[14px] text-[#1D242B]/75">Name</span>
                            <span className="text-[14px] text-[#1D242B]/75">Email</span>
                            <span className="text-[14px] text-[#1D242B]/75">Status</span>
                            <span className="text-[14px] text-[#1D242B]/75">Submitted at (yyy-mm-dd)</span>
                        </div>

                        <div className="flex flex-col w-full">
                            {inquiryList.map(inquiry => (
                                <button onClick={() => viewModal(inquiry.id)} key={inquiry.id} className="grid grid-cols-5  border-b border-b-[#1D242B]/15 py-3 place-items-center justify-items-center hover:bg-[#C7EEFF]/50 active:bg-[#FAFAFA] cursor-pointer px-[1rem] transition-all duration-100">
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
                                </button>
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
                    />
                </div>
            )}

        </>
    )
}