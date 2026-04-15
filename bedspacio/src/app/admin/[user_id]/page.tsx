"use client"

import Manage from '@/asset/icon/settings.svg'

import { useState } from 'react'
import { useAuth } from "@/context/AuthContext"

export default function UserProfile () {


    const user = useAuth();

    const [ userData, setUserData ] = useState({
        name: user?.fullname,
        username: user?.username
    })

    const handleDataChange = (field: string, value: string) => {
        setUserData(prev => ({
            ...prev,
            [field]: value
        }));
    }

    const [ edit, setEdit ] = useState({
        name: false,
        username: false,
    })

    const toggleEdit = (field: keyof typeof edit) => {
        setEdit(prev => {
            const isEditing = prev[field];

            // If currently editing → user clicked "Cancel"
            if (isEditing) {
                setUserData(prevData => ({
                    ...prevData,
                    [field]: user?.[field === 'name' ? 'fullname' : field] || ''
                }));
            }

            return {
                ...prev,
                [field]: !prev[field]
            };
        })
    }
    

    return (
        <div className='flex w-full justify-center items-center py-[4rem]'>
            <div className="relative flex flex-col w-[600px] items-center justify-center h-[auto] bg-[#FAFAFA] rounded-[10px] p-[2rem] gap-[2rem]">
                <span className="text-[24px] text-[#1D242B] font-bold whitespace-nowrap">Manage Profile</span>

                <div className='flex flex-col w-full gap-[1rem] items-center justify-center'>
                    <div className='flex items-center justify-start w-full gap-[2rem] pb-[1rem]'>
                        <figure className='w-[150px] h-[150px] bg-[#1D242B]/25 rounded-full overflow-hidden'>
                            <img src="/image/property_manager.jpg" alt="profile-image" />
                        </figure>

                        <div className='flex flex-col gap-[1rem]'>
                            <button className='w-fit bg-[#1D242B] text-[#FAFAFA] px-3 py-2 rounded-[10px] cursor-pointer hover:bg-[#1D242B]/90 active:bg-[#1D242B]'>Change Image</button>
                            <span className='text-[14px] w-[200px] leading-tight'>(Upload a professional image because it will be displayed on the website)</span>
                        </div>
                    </div>

                    <div className={`grid grid-cols-[1fr_3fr_1fr] place-items-center justify-items-start w-full gap-2 border-2 ${edit.name === false ? 'border-[#1D242B]/25 ' : 'border-[#0077C0]'} rounded-[10px] p-[1rem]`}>
                        <span className='text-[#1D242B] text-[14px]'>Name</span>
                        <input type="text"  className='w-full font-bold focus:outline-none' value={userData.name} onChange={(e) => handleDataChange('name', e.target.value)} disabled={edit.name === false}/> {/* CHANGE THIS LATER */}

                        <div className='flex w-full items-center justify-end'>
                            {edit.name === false ? (
                                <button onClick={() => toggleEdit('name')} className='text-[#0077C0] text-[14px] font-bold px-3 py-1 rounded-full hover:bg-[#0077C0]/15 active:bg-[#FAFAFA] cursor-pointer'>Edit</button>
                            ) : (
                                <button onClick={() => toggleEdit('name')} className='text-[14px] hover:text-[#0077C0] active:text-[#1D242B] cursor-pointer'>Cancel</button>
                            )}
                        </div>
                    </div>

                    <div className={`grid grid-cols-[1fr_3fr_1fr] place-items-center justify-items-start w-full gap-2 border-2 ${edit.username === false ? 'border-[#1D242B]/25 ' : 'border-[#0077C0]'} rounded-[10px] p-[1rem]`}>
                        <span className='text-[#1D242B]'>Username</span>
                        <input type="text"  className='w-full font-bold focus:outline-none' value={userData.username} onChange={(e) => handleDataChange('username', e.target.value)} disabled={edit.username === false}/> {/* CHANGE THIS LATER */}
                        <div className='flex w-full items-center justify-end'>
                            {edit.username === false ? (
                                <button onClick={() => toggleEdit('username')} className='text-[#0077C0] text-[14px] font-bold px-3 py-1 rounded-full hover:bg-[#0077C0]/15 active:bg-[#FAFAFA] cursor-pointer'>Edit</button>
                            ) : (
                                <button onClick={() => toggleEdit('username')} className='text-[14px] hover:text-[#0077C0] active:text-[#1D242B] cursor-pointer'>Cancel</button>
                            )}
                        </div>
                    </div>

                    <div className='group grid grid-cols-[1fr_3fr_1fr] w-full gap-[1rem] border-2 border-[#1D242B]/25 rounded-[10px] p-[1rem]'>
                        <span className='text-[#1D242B]'>Role</span>
                        <span className='w-full font-bold'>Property Manager</span> {/* CHANGE THIS LATER */}
                    </div>

                    {/* <button className='p-3 bg-[#0077C0] hover:bg-[#0077C0]/90 active:bg-[#0077C0] text-[#FAFAFA] rounded-[10px] cursor-pointer'>Continue</button> */}

                    <div className={`grid grid-cols-[1fr_3fr_1fr] w-full gap-[1rem] border-2  border-[#1D242B]/25 rounded-[10px] p-[1rem]`}>
                        <span className='text-[#1D242B]'>Password</span>
                        <span className='font-bold'>********</span>
                        <div className='flex w-full items-center justify-end'>
                            <button className='text-[#0077C0] text-[14px] font-bold px-3 py-1 rounded-full hover:bg-[#0077C0]/15 active:bg-[#FAFAFA] cursor-pointer'>Change</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}