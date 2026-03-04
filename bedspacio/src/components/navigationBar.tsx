"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import Contact from '@/asset/icon/contact.svg'
import BurgerMenu from '@/asset/icon/burger-menu.svg'


export default function NavigationBar() {

    const url = usePathname();


    return (
        <div className="sticky top-0 h-[80px] xl:h-auto lg:h-auto md:h-[80px] flex items-center justify-between lg:grid lg:grid-cols-3 w-full bg-[#FAFAFA] box-border px-[1rem] border-b-2 border-[#0077C0] z-10">
            <div className="flex w-full items-center">    
                <Link href="/">
                    <img src="/asset/bedspacio_logo.jpg" alt="bedspacio-logo" className="w-[70px] h-auto"/>
                </Link>
            </div>

            <div className="hidden xl:flex lg:flex md:hidden sm:hidden items-center justify-center w-full">
                <Link href="/" className={`${url === "/" ? 'bg-[#0077C0] text-[#FAFAFA] active:bg-[#1D242B]' : 'hover:bg-[#C7EEFF] active:bg-[#FAFAFA]'} text-[#0077C0] text-[18px] font-bold p-2 xl:p-6 lg:p-6 whitespace-nowrap`}>Home</Link>
                <Link href="/rentals" className={`${url === "/rentals" || url.startsWith("/rentals/") ? 'bg-[#0077C0] text-[#FAFAFA] active:bg-[#1D242B]' : 'hover:bg-[#C7EEFF] active:bg-[#FAFAFA]'} text-[#0077C0] text-[18px] font-bold p-2 xl:p-6 lg:p-6 whitespace-nowrap`}>Rentals</Link>
                <Link href="/about" className={`${url === "/about" ? 'bg-[#0077C0] text-[#FAFAFA] active:bg-[#1D242B]' : 'hover:bg-[#C7EEFF] active:bg-[#FAFAFA]'} text-[#0077C0] text-[18px] font-bold p-2 xl:p-6 lg:p-6 whitespace-nowrap`}>About Us</Link>
                <Link href="/how-it-works" className={`${url === "/how-it-works" ? 'bg-[#0077C0] text-[#FAFAFA] active:bg-[#1D242B]' : 'hover:bg-[#C7EEFF] active:bg-[#FAFAFA]'} text-[#0077C0] text-[18px] font-bold p-2 xl:p-6 lg:p-6 whitespace-nowrap`}>How It Works</Link>
            </div>

            <div className="hidden xl:flex lg:flex md:hidden sm:hidden flex items-center xl:justify-end lg:justify-end md:justify-end">
                <Link href="/contact-us" className="flex items-center gap-2 text-[#FAFAFA] text-[16px] font-bold w-fit py-3 px-6 rounded-full bg-[#0077C0] hover:bg-[#1D242B] hover:scale-104 active:bg-[#0077C0] transition-all duration-100">
                    <Contact className="stroke-[#FAFAFA]"/>
                    <span className="whitespace-nowrap">Contact Us</span>
                </Link>
            </div>


            <div className="flex xl:hidden lg:hidden md:flex">
                <BurgerMenu className="flex w-[40px] h-[40px]" />
            </div>
        </div>
    )
}