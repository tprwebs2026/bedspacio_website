"use client"

import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"

import Home from '@/asset/icon/home.svg'
import Profile from '@/asset/icon/profile.svg'
import Logout from '@/asset/icon/log-out.svg'
import List from '@/asset/icon/list.svg'
import Listings from '@/asset/icon/listing.svg'
import ArrowDown from '@/asset/icon/arrow-down.svg'

import { useAuth } from "@/context/AuthContext"
import { logout } from "../../../lib/auth"
import { DefaultAvatar } from "@/app/admin/manage/DefaultAvatar"


type landmark = {
    landmark: string
}

export type branchType = {
    id: number,
    branch_name: string,
    address: string,
    property_manager: string
    landmarks: landmark
}

export default function AdminNavBar () {

    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const router = useRouter(); // navigate to other page
    const user  = useAuth();
    const base_url='http://localhost:5000'


    const path = usePathname();
    const [profileDropdownVisible, setProfileDropdownVisible] = useState<boolean>(false)

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setProfileDropdownVisible(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);




    return (
        <div className="sticky top-0 flex items-center justify-between bg-[#0077C0] px-[1rem] xl:px-[8rem] z-10">
            
            <section className="flex items-center">
                <div className="flex w-full justify-start font-bold text-[28px] text-[#FAFAFA] border-r border-r-[#1D242B] whitespace-nowrap pr-[1rem]">BEDSPACIO ADMIN</div>

                <div className="flex items-center justify-center h-full">
                    <Link href="/admin" className={`h-full relative flex flex-col items-center justify-center p-2 xl:p-6 lg:p-6 whitespace-nowrap text-[#FAFAFA] font-bold hover:bg-[#1D242B]/25 transition-all duration-100  ${path === '/admin' && 'bg-[#1D242B]'}`}>Dashboard</Link>

                    <div className="group relative flex flex-col items-center justify-center cursor-pointer">
                        <div className={`flex items-center gap-1 p-2 xl:p-6 lg:p-6 transition-all duration-100 ${(path.startsWith('/admin/room-listing') || path === '/admin/inclusion') && 'bg-[#1D242B]'} hover:bg-[#1D242B]/25`}>
                            <span className="text-[#FAFAFA] font-bold whitespace-nowrap">Rooms</span>
                            <ArrowDown className="w-[23px] h-[23px] fill-[#FFF]/50" />
                        </div>

                        <div className="opacity-0 invisible group-hover:opacity-100 group-hover:visible absolute top-18 flex flex-col items-center bg-[#0077C0] w-[200px] rounded-b-[10px] shadow-md">
                            <Link href="/admin/room-listing?page=1" className="flex items-center gap-2 w-full p-3 hover:bg-[#C7EEFF]/50">
                                <Listings className="w-[30px] h-[30px] stroke-[#FFF] " />
                                <span className="text-[#FAFAFA]">Room Listings</span>
                            </Link>

                            <Link href="/admin/inclusion" className="flex items-center gap-2 w-full p-3 hover:bg-[#C7EEFF]/50">
                                <List className="w-[30px] h-[30px] stroke-[#FFF] " />
                                <span className="text-[#FAFAFA]">Inclusions</span>
                            </Link>
                        </div>
                    </div>

                    <Link href="/admin/branch" className={`flex flex-col items-center justify-center p-2 xl:p-6 lg:p-6 whitespace-nowrap text-[#FAFAFA] font-bold hover:bg-[#1D242B]/25 transition-all duration-100  ${path === '/admin/branch' && 'bg-[#1D242B]'}`}> Branch </Link>

                    <Link href="/admin/inquiry" className={`flex flex-col items-center justify-center p-2 xl:p-6 lg:p-6 whitespace-nowrap text-[#FAFAFA] font-bold hover:bg-[#1D242B]/25 transition-all duration-100  ${path.startsWith('/admin/inquiry') && 'bg-[#1D242B]'}`}>Inquiry</Link>

                    {user?.role === 'admin' && (
                        <Link href="/admin/manage" className={`flex flex-col items-center justify-center p-2 xl:p-6 lg:p-6 whitespace-nowrap text-[#FAFAFA] font-bold hover:bg-[#1D242B]/25 transition-all duration-100  ${path === '/admin/manage' && 'bg-[#1D242B]'}`}>Manage</Link>
                    )}

                </div>
            </section>

            <div ref={dropdownRef} className="group relative flex flex-col items-end justify-end w-full">
                <button onClick={() => setProfileDropdownVisible(prev => !prev)} className="flex items-center justify-center bg-[#C7EEFF]/25 hover:bg-[#1D242B]/25 active:bg-[#0077C0] cursor-pointer gap-2 px-2 py-2 rounded-full transition-all duration-100">
                    <div className="flex flex-col items-start justify-center">
                        <span className="px-3 text-[#FAFAFA] text-[16px] font-bold leading-tight">{user?.fullname}</span>
                        <span className="px-3 text-[#FAFAFA]/80 leading-tight text-[14px]">{user?.role}</span>
                    </div>
                    <div className="flex items-center justify-center rounded-full w-[35px] h-[35px] rounded-full overflow-hidden bg-[#CCC]/50">  
                        {user?.profile_image ? (
                            <img src={`${base_url}/file/user/${user?.profile_image}`} alt="profile image" className="w-full h-full object-cover"/>
                        ) : (
                            <div className="scale-25 bg-[#FAFAFA]">
                                <DefaultAvatar name={user?.fullname} />
                            </div>
                        )}
                    </div> 
                </button> 
                {/* 
                    Shows a dropdown element
                    > View Profile
                    > Logout
                    > Home page
                */}
                {profileDropdownVisible && (
                    <div className="absolute top-12 flex flex-col items-center w-[200px] rounded-[10px] shadow-md bg-[#FFF] border border-[#1D242B]/50 overflow-hidden">
                        <Link href={`/admin/user/${Number(user?.id)}`} onClick={() => setProfileDropdownVisible(false)} className="flex items-center justify-between gap-2 w-full p-4 whitespace-nowrap border-b border-[#1D242B]/25 cursor-pointer hover:bg-[#1D242B]/10 active:bg-[#FAFAFA]">
                            <Profile className="w-[20px] h-[20px] fill-[#1D242B]" />
                            <span>View Profile</span>
                        </Link>

                        <Link href="/" className="flex items-center justify-between gap-2 w-full p-4 whitespace-nowrap border-b border-[#1D242B]/25 hover:bg-[#1D242B]/10 active:bg-[#FAFAFA]">
                            <Home className="w-[25px] h-[25px] stroke-[#1D242B]" />
                            <span>Go to Home</span>
                        </Link>

                        <button onClick={handleLogout} className="flex items-center justify-between w-full p-4 text-left whitespace-nowrap border-b border-[#1D242B]/25 cursor-pointer hover:bg-[#1D242B]/10 active:bg-[#FAFAFA]">
                            <Logout className="w-[25px] h-[25px] stroke-[#1D242B]" />
                            <span>Log Out</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}