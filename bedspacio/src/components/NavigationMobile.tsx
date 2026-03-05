"use client"

import Link from "next/link"

import Close from '@/asset/icon/close.svg'

type Toggle = {
    toggleNavigation: () => void
}

export default function NavigationMobile ({ toggleNavigation }: Toggle) {

    return (
        <div className="fixed flex flex-col items-end justify-start min-w-[300px] h-full bg-[#0077C0] gap-[1rem]">
            <button onClick={toggleNavigation} className="group flex items-center p-[1rem] py-[1.5rem] ">
                <span className="flex items-center gap-1 text-[#FAFAFA] text-[16px] font-bold bg-[#1D242B] group-active:active:bg-[#0077C0] p-2 pr-[1rem] rounded-full">
                    <Close className="w-[25px] h-[25px]" />
                    Close
                </span>
            </button>

            <div className="flex flex-col items-center justify-between w-full">
                <Link href="/" onClick={toggleNavigation} className="flex items-start justify-between w-full border-b border-b-[#C7EEFF]/50 p-[1rem] active:bg-[#1D242B]/75">
                    <span className="font-bold text-[#FAFAFA] text-[20px]">Home</span>
                </Link>
                <Link href="/rentals" onClick={toggleNavigation} className="flex items-center justify-between w-full border-b border-b-[#C7EEFF]/50 p-[1rem] active:bg-[#1D242B]/75">
                    <span className="font-bold text-[#FAFAFA] text-[20px]">Rentals</span>
                </Link>
                <Link href="/about" onClick={toggleNavigation} className="flex items-center justify-between w-full border-b border-b-[#C7EEFF]/50 p-[1rem] active:bg-[#1D242B]/75">
                    <span className="font-bold text-[#FAFAFA] text-[20px]">About Us</span>
                </Link>
                <Link href="/how-it-works" onClick={toggleNavigation} className="flex items-center justify-between w-full border-b border-b-[#C7EEFF]/50 p-[1rem] active:bg-[#1D242B]/75">
                    <span className="font-bold text-[#FAFAFA] text-[20px]">How It Works</span>
                </Link>
                <Link href="/contact-us" onClick={toggleNavigation} className="flex items-center justify-between w-full border-b border-b-[#C7EEFF]/50 p-[1rem] bg-[#C7EEFF] text-[#0077C0] active:text-[#FAFAFA] active:bg-[#1D242B]/75">
                    <span className="font-bold text-[20px]">Contact Us</span>
                </Link>
            </div>
        </div>
    )
}