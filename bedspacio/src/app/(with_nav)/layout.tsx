"use client"

import Footer from "@/components/Footer"
import NavigationBar from "@/components/navigationBar"
import NavigationMobile from "@/components/NavigationMobile"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"

export default function WithNavigation({
    children,
}: {
    children: React.ReactNode
}) {

    const [toggleNav, setToggleNav] = useState<boolean>(false)
    const [progress, setProgress] = useState(0)
    const [isLoading, setIsLoading] = useState(false)

    const pathname = usePathname()


    useEffect(() => {
        // Start loading when pathname changes
        setIsLoading(true)
        setProgress(0)

        const timer1 = setTimeout(() => setProgress(40), 50)
        const timer2 = setTimeout(() => setProgress(70), 200)
        const timer3 = setTimeout(() => setProgress(85), 400)

        // Finish loading
        const finishTimer = setTimeout(() => {
            setProgress(100)
            
            setTimeout(() => {
                setIsLoading(false)
                setProgress(0)
            }, 150)
        }, 200)

        return () => {
            clearTimeout(timer1)
            clearTimeout(timer2)
            clearTimeout(timer3)
            clearTimeout(finishTimer)
        }
    }, [pathname])

    return (
        <div className="flex flex-col w-full min-h-screen">

            {isLoading && (
                <div className="fixed top-0 left-0 right-0 h-[3px] z-50 bg-transparent overflow-hidden">
                    <div
                        className="h-full bg-[#1D242B] shadow-[0_0_10px_#1D242B] transition-all duration-200 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            )}

            <NavigationBar
                toggleMobileNav={() => setToggleNav(prev => !prev)}
            />

            {/* Overlay */}
            <div
                onClick={() => setToggleNav(false)}
                className={`fixed inset-0 xl:hidden lg:hidden z-30 transition-opacity duration-200
                ${toggleNav ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
                bg-black/40 backdrop-blur-sm`}
            />

            <div
                className={`fixed inset-y-0 flex items-end justify-end w-full min-h-screen xl:hidden lg:hidden z-40 transition-transform duration-200 ease-out ${
                    toggleNav ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <NavigationMobile
                    toggleNavigation={() => setToggleNav(prev => !prev)}
                />
            </div>

            <main>
                {children}
            </main>

            <Footer />
        </div>
    )
}