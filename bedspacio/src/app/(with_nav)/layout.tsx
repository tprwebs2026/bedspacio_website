"use client"

import Footer from "@/components/Footer"
import NavigationBar from "@/components/navigationBar"
import NavigationMobile from "@/components/NavigationMobile"

import { useState } from "react"

export default function WithNavigation({ children }: { children: React.ReactNode }) {

    const [toggleNav, setToggleNav] = useState<boolean>(false)

    return (
        <div className="w-full min-h-screen">

            <NavigationBar toggleMobileNav={() => setToggleNav(prev => !prev)}/>

            {/* 
                > Slides from left for mobile version
                > Only visible in mobile UI version
            */}

            {/* Overlay */}
            <div
                onClick={() => setToggleNav(false)}
                className={`fixed inset-0 xl:hidden lg:hidden z-30 transition-opacity duration-200
                ${toggleNav ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
                bg-black/40 backdrop-blur-sm`}
            />

            <div className={`fixed inset-y-0 flex items-end justify-end w-full min-h-screen xl:hidden lg:hidden z-40 transition-transform duration-200 ease-out ${toggleNav ? 'translate-x-0' : 'translate-x-full'}`}>
                <NavigationMobile toggleNavigation={() => setToggleNav(prev => !prev)}/>
            </div>
            
            <main>{children}</main>
            <Footer />
        </div>
    )   
}