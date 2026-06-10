"use client"

import Link from "next/link"

export default function HomeInquiryRedirect() {

    return (
        <div className="flex flex-col items-center justify-center w-full h-auto py-[4rem] px-[1rem] xl:px-[8rem] lg:px-[8rem] md:px-[4rem] gap-[1rem] border-dashed border-t-2 border-t-[#1D242B]/50">
            <div className="flex items-center justify-center gap-[2rem] bg-[#0077C0] rounded-[10px] p-[2rem]">
                <div className="flex flex-col w-full items-start justify-center">
                    <span className="text-5xl text-[#FAFAFA] font-bold leading-tight whitespace-nowrap">Are you interested?</span>
                    <span className="text-lg text-[#FAFAFA]">Contact us and tell us what you need, we are happy to help you!</span>
                </div>

                <div className="flex w-full items-center justify-center">
                    <Link href={'/contact-us'} className="flex items-center justify-center bg-[#1D242B] hover:bg-[#1D242B]/75 active:bg-[#1D242B] cursor-pointer rounded-full p-[1rem] px-[3rem]">
                        <span className="text-2xl text-[#FAFAFA] font-bold">Inquire Now</span>
                    </Link>
                </div>
            </div>
        </div>
    )
}