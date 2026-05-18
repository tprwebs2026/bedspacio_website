"use client"

import { useState } from "react"

import Add from '@/asset/icon/add.svg';
import UserViewWrapperModal from "./UserViewWrapperModal";
import UserCreateWrapperModal from "./UserCreateWrapperModal";
import { UserInfo } from "./UserViewWrapperModal"; // Type

import { getAllUsers, getUserInfo } from "../../../../lib/user";

import ErrorToast from '@/components/admin/Toast/ErrorToast';
import SuccessToast from '@/components/admin/Toast/SuccessToast';
import DeleteToast from '@/components/admin/Toast/DeleteToast';
import AlertTaost from '@/components/admin/Toast/AlertToast';

export type ManageType = {
    id: number,
    fullname: string,
    role: string, 
    username: string,
    is_active: boolean,
    profile_image: string,
    last_login: string
} 


export type ManageProps = {
    users: ManageType[]
}

export default function Manage ({ users }: ManageProps) {

    const [ userWrapperModalOpen, setUserWrapperModal ] = useState<boolean>(false)
    const [ userViewWrapperModalOpen, setUserViewWrapperModal ] = useState<boolean>(false)
    const [ selectedUser, setSelectedUser ] = useState<UserInfo>();
    const [ allUsers, setAllUsers ] = useState<ManageType[]>(users);

    const [successMessage, setSuccessMessage] = useState<string>();
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [deleteMessage, setDeleteMessage] = useState<string>('')

    console.log('see users: ', users);

    const handleShowUserInfo = async (id: number) => {
        const data = await getUserInfo(id);

        console.log(data);
        setUserViewWrapperModal(true);
        setSelectedUser(data);
    }


    const loadAllusers = async () => {
        const allUsers = await getAllUsers();
        setAllUsers(allUsers)
    }
    
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

                            {allUsers?.map((user:ManageType) => (
                                <div key={user?.id} onClick={() => handleShowUserInfo(user?.id)} className="grid grid-cols-5 border-b border-b-[#1D242B]/10 px-[1rem] py-[0.5rem] hover:bg-[#C7EEFF]/25 active:bg-[#FAFAFA] place-items-center justify-items-start cursor-pointer">
                                    <span className="text-[#0077C0] font-bold">{user?.username}</span>
                                    <span>{user?.role}</span>
                                    <span>{user?.fullname}</span>
                                    <span className={`px-2 py-1 text-[14px] font-bold ${user?.is_active === true ? 'text-[#007C00] bg-[#007C00]/15' : 'text-[#E70C0E] bg-[#E70C0E]/15' }  w-fit rounded-full`}>{user?.is_active === true ? 'Active' : 'Inactive'}</span>
                                    <span>{new Date(user?.last_login).toLocaleString()}</span>
                                </div>
                            ))}

                        </div>
                    </div>
                </div>
            </div>

            {userWrapperModalOpen && (
                <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-full h-screen bg-[#1D242B]/50 z-50">
                    <UserCreateWrapperModal 
                        isModalOpen={() => setUserWrapperModal(false)} 
                        onSuccess={loadAllusers}
                    />
                </div>
            )}

            {userViewWrapperModalOpen && selectedUser && (
                <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-full h-screen bg-[#1D242B]/50 z-50">
                    <UserViewWrapperModal 
                        isModalOpen={() => setUserViewWrapperModal(false)} 
                        user={selectedUser}
                        onSuccess={loadAllusers}
                        successMessage={(msg) => setSuccessMessage(msg)}
                        errorMessage={(msg) => setErrorMessage(msg)}
                        deleteMessage={(msg) => setDeleteMessage(msg)}
                    />
                </div>
            )}


            {deleteMessage && <DeleteToast message={deleteMessage} />}
            {successMessage && <SuccessToast message={successMessage} />}
            {errorMessage && <SuccessToast message={errorMessage} />}
        </>
    )
}