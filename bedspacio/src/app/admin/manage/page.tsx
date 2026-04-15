"use client"

import { useState } from "react"
import Link from "next/link";

import Add from '@/asset/icon/add.svg';
import UserWrapperModal from "./UserCreateWrapperModal";
import UserViewWrapperModal from "./UserViewWrapperModal";
import UserCreateWrapperModal from "./UserCreateWrapperModal";


export default function Manage () {

    const [ userWrapperModalOpen, setUserWrapperModal ] = useState<boolean>(false)
    const [ userViewWrapperModalOpen, setUserViewWrapperModal ] = useState<boolean>(false)
    
    return (
        <>
            <div className="flex w-full min-h-screen">
                <div className="flex flex-col w-full px-[8rem] py-[2rem] gap-[3rem]">

                    <div className="flex items-center justify-between w-full">
                        <span className="text-[28px] text-[#1D242B] font-bold leading-tight">Manage</span>

                        <button onClick={() => setUserWrapperModal(true)} className="flex items-center justify-center rounded-[10px] bg-[#0077C0] p-2 cursor-pointer border-2 border-[#0077C0] hover:bg-[#1D242B] hover:border-[#1D242B] active:bg-[#1D242B] xl:active:bg-[#0077C0] transition-all duration-100">
                            <Add className="w-[25px] h-auto stroke-[#FAFAFA]" />
                            <span className="text-[#FAFAFA] text-[16px] px-2">Create New User</span>
                        </button>
                    </div>


                    <div className="flex flex-col w-full">
                        <div className="grid grid-cols-5 border-b border-b-[#1D242B]/50 opacity-50 text-[14px] px-[1rem] py-2">
                            <span>Username</span>
                            <span>Role</span>
                            <span>Name</span>
                            <span>Status</span>
                            <span>Last Logged In</span>
                        </div>


                        <div className="flex flex-col w-full">

                            <div onClick={() => setUserViewWrapperModal(true)} className="grid grid-cols-5 border-b border-b-[#1D242B]/10 px-[1rem] py-[0.5rem] hover:bg-[#C7EEFF]/25 active:bg-[#FAFAFA] place-items-center justify-items-start cursor-pointer">
                                <span className="text-[#0077C0] font-bold">GeloyC</span>
                                <span>Admin</span>
                                <span>Angelo Cabangal</span>
                                <span className="px-2 py-1 text-[14px] font-bold text-[#007C00] bg-[#007C00]/15 w-fit rounded-full">Active</span>
                                <span>04-13-2026 9:05 PM</span>
                            </div>

                            <div onClick={() => setUserViewWrapperModal(true)} className="grid grid-cols-5 border-b border-b-[#1D242B]/10 px-[1rem] py-[0.5rem] hover:bg-[#C7EEFF]/25 active:bg-[#FAFAFA] place-items-center justify-items-start cursor-pointer">
                                <span className="text-[#0077C0] font-bold">Jenn</span>
                                <span>Property Manager</span>
                                <span>Jennifer Sernicula</span>
                                <span className="px-2 py-1 text-[14px] font-bold text-[#007C00] bg-[#007C00]/15 w-fit rounded-full">Active</span>
                                <span>04-13-2026 9:05 PM</span>
                            </div>

                            <div onClick={() => setUserViewWrapperModal(true)} className="grid grid-cols-5 border-b border-b-[#1D242B]/10 px-[1rem] py-[0.5rem] hover:bg-[#C7EEFF]/25 active:bg-[#FAFAFA] place-items-center justify-items-start cursor-pointer">
                                <span className="text-[#0077C0] font-bold">Nigg</span>
                                <span>Property Manager</span>
                                <span>Bleck Neeg</span>
                                <span className="px-2 py-1 text-[14px] font-bold text-[#E70C0E] bg-[#E70C0E]/15 w-fit rounded-full">Inactie</span>
                                <span>04-13-2026 9:05 PM</span>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {userWrapperModalOpen && (
                <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-full h-screen bg-[#1D242B]/50 z-50">
                    <UserCreateWrapperModal isModalOpen={() => setUserWrapperModal(false)} />
                </div>
            )}

            {userViewWrapperModalOpen && (
                <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-full h-screen bg-[#1D242B]/50 z-50">
                    <UserViewWrapperModal isModalOpen={() => setUserViewWrapperModal(false)} />
                </div>
            )}
        </>
    )
}