"use client"

import { useState } from "react"
import axios from "axios";

import Back from '@/asset/icon/arrow-right.svg';
import Menu from '@/asset/icon/menu-three-dots.svg';
import ForceDelete from '@/asset/icon/delete.svg'

import ErrorToast from "@/components/admin/Toast/ErrorToast";
import DeleteToast from "@/components/admin/Toast/DeleteToast";
import SuccessToast from "@/components/admin/Toast/SuccessToast";

import { deleteUser } from "../../../../lib/user";
import { DefaultAvatar } from "./DefaultAvatar";


export type UserInfo = {
    id: number,
    fullname: string,
    role: string, 
    username: string,
    contact_number: string,
    email: string,
    is_active: boolean,
    profile_image: string
}

interface ModalProp {
    isModalOpen: () => void;
    user: UserInfo;
    onSuccess: () => void;
    successMessage: (msg: string) => void;
    errorMessage: (msg: string) => void;
    deleteMessage: (msg: string) => void;
}

export default function UserViewWrapperModal ({ isModalOpen, user, onSuccess, successMessage, errorMessage, deleteMessage }: ModalProp) {

    const base_url = 'http://localhost:5000'

    const [menuOpen, setMenuOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    

    const [userInfo, setUserInfo] = useState({
        fullname: user?.fullname,
        username: user?.username,
        contact_number: user?.contact_number,
        email: user?.email,
        role: user?.role,
        is_active: user?.is_active,
        profile_image: user?.profile_image
    });

    const [userEditing, setUserEditing] = useState({
        name: false,
        username: false,
        contact_number: false, 
        email: false,
        role: false
    });

    const toggleEditUser = (field: keyof typeof userEditing ) => {
        setUserEditing(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handleDeleteUser = async (id: number) => {
        setLoading(true);
        deleteMessage('');
        errorMessage('');

        try {
            const deleteResponse = await deleteUser(id);
            console.log('Deleted: ', deleteResponse);
            console.log('user to delete: ', id);

            deleteMessage('Delete successful');
            setTimeout(() => deleteMessage(''), 3500);

            onSuccess();
            isModalOpen();
        } catch (err) {
            console.error('Failed to delete user: ', err)
            errorMessage('Delete failed');

            setTimeout(() => errorMessage(''), 3500);

        } finally {
            setLoading(false);
        }
    };


    
    const handleUpdateUser = async (id: number) => {
        setLoading(true);
        deleteMessage('');
        errorMessage('');
        successMessage('');

        try {
            const activeStatusChanged = userInfo.is_active !== user?.is_active;
            const roleChanged = userInfo.role !== user?.role
    
            const updates: Partial<UserInfo> = {};
    
            if (activeStatusChanged) {
                updates.is_active = userInfo.is_active;
            }
    
            if (roleChanged) {
                updates.role = userInfo.role;
            }
    
            const response = await axios.patch(`${base_url}/user/v1/users/${id}`,  updates, {
                withCredentials: true
            });
    
            console.log('user update response: ', response);
            successMessage('Updated successful');

            onSuccess();
            setTimeout(() => successMessage(''), 3500);
            isModalOpen();


        } catch (err) {
            console.error();
            errorMessage('Update error');
            setTimeout(() => errorMessage(''), 3500);

        } finally {
            setLoading(false);
        }
    }
    

    if (loading) {
        return (
            <div className="flex items-center justify-center w-full h-full">
                <span>
                    {loading ? '...loading' : '' }
                </span>
            </div>
        )
    }

    return (
        <>
            <div className="relative flex flex-col w-[700px] h-auto p-[2rem] bg-[#FAFAFA] rounded-[10px] gap-[2rem]">
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2 ">
                        <button onClick={isModalOpen} className="p-1 rounded-full hover:bg-[#1D242B]/25 active:bg-[#FAFAFA] cursor-pointer">
                            <Back className="-rotate-180 w-auto h-[25px] fill-[#1D242B]"/>
                        </button>
                        <span className="text-[#1D242B] text-[24px] font-bold leading-tight">User Info</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                        <div className="flex items-center gap-1">
                            <span className="text-[#1D242B] text-[14px] font-bold">
                                Account Status
                            </span>

                            <div className="flex items-center rounded-full p-1 bg-[#1D242B] overflow-hidden">
                                {/* ACTIVE */}
                                <button
                                    type="button"
                                    onClick={() =>
                                        setUserInfo(prev => ({
                                            ...prev,
                                            is_active: true
                                        }))
                                    }
                                    className={`flex items-center px-2 h-[25px] rounded-full cursor-pointer ${
                                        userInfo.is_active === true
                                            ? "bg-[#007C00] text-[#FAFAFA] font-bold"
                                            : "text-[#FAFAFA] font-bold"
                                    }`}
                                >
                                    <span className="text-[12px] leading-tight">Active</span>
                                </button>

                                {/* INACTIVE */}
                                <button
                                    type="button"
                                    onClick={() =>
                                        setUserInfo(prev => ({
                                            ...prev,
                                            is_active: false
                                        }))
                                    }
                                    className={`flex items-center px-2 h-[25px] rounded-full cursor-pointer ${
                                        userInfo.is_active === false
                                            ? "bg-[#7C7C7C] text-[#FAFAFA] font-bold"
                                            : "text-[#FAFAFA] font-bold"
                                    }`}
                                >
                                    <span className="text-[12px] leading-[0]">Inactive</span>
                                </button>
                            </div>
                        </div>

                        <div className="relative flex items-center justify-center">
                            <button onClick={() => setMenuOpen(prev => !prev)} className="p-1 rounded-full cursor-pointer hover:bg-[#1D242B]/15 active:bg-[#FAFAFA]">
                                <Menu className="w-[25px] h-[25px]" />
                            </button>
                            
                            {menuOpen && (
                                <button onClick={() => handleDeleteUser(user?.id)} className="absolute top-10 -left-10 flex items-center gap-2 shadow-md border border-[#1D242B]/25 bg-[#FAFAFA] hover:bg-[#FFCECD] active:bg-[#FAFAFA] rounded-[10px] px-4 py-2 cursor-pointer transition-all duration-100">
                                    <ForceDelete className="w-[22px] h-[22px] stroke-2 stroke-[#FF0808]" />
                                    <span className="text-[14px] font-bold text-[#FF0808] whitespace-nowrap">Force Delete</span>
                                </button>
                            )}
                        </div>

                    </div>
                </div>

                <div className="flex flex-col items-center justify-center w-full gap-[1rem] pb-[1rem]">
                    <figure className="w-[150px] h-[150px] rounded-full overflow-hidden">
                        {userInfo?.profile_image ? (
                            <img src={`${base_url}/file/user/${userInfo?.profile_image}`} alt="user-image" className="w-full h-full object-cover"/>
                        ) : (
                            <DefaultAvatar name={userInfo?.fullname}/>
                        )}
                    </figure>

                    <div className={`flex items-center w-full p-[1rem] border-2 ${userEditing.name ? 'border-[#0077C0]' : 'border-[#1D242B]/25' } gap-2 rounded-[10px]`}>
                        <span className="text-[#1D242B]/75">Name</span>
                        <div className="flex items-center justify-center w-full">
                            <span className="w-full text-[#1D242B] font-bold">{userInfo?.fullname}</span>
                        </div>
                    </div>

                    <div className={`flex items-center w-full p-[1rem] border-2 ${userEditing.username ? 'border-[#0077C0]' : 'border-[#1D242B]/25' } gap-2 rounded-[10px]`}>
                        <span className="text-[#1D242B]/75">Username</span>
                        <div className="flex items-center justify-center w-full">
                            <span className="w-full text-[#1D242B] font-bold">{userInfo.username}</span>
                        </div>
                    </div>

                    <div className={`flex items-center w-full p-[1rem] border-2 ${userEditing.contact_number ? 'border-[#0077C0]' : 'border-[#1D242B]/25' } gap-2 rounded-[10px]`}>
                        <span className="text-[#1D242B]/75 whitespace-nowrap">Contact #</span>
                        <div className="flex items-center justify-center w-full">
                            <span className="w-full text-[#1D242B] font-bold">{userInfo.contact_number}</span>
                        </div>
                    </div>

                    <div className={`flex items-center w-full p-[1rem] border-2 ${userEditing.email ? 'border-[#0077C0]' : 'border-[#1D242B]/25' } gap-2 rounded-[10px]`}>
                        <span className="text-[#1D242B]/75">Email</span>
                        <div className="flex items-center justify-center w-full">
                            <span className="w-full text-[#1D242B] font-bold">{userInfo.email}</span>
                        </div>
                    </div>


                    {/* TODO: change appearance when one is selected */}
                    <div className={`grid grid-cols-[1fr_4fr] place-items-center justify-items-start w-full gap-2  rounded-[10px] ${userEditing.role ? "px-[1rem] py-[0.5rem]" : "p-[1rem]"}  border-2 border-[#1D242B]/25 rounded-[10px]`}>
                        <span className="text-[#1D242B]">{userEditing.role ? 'Assign a Role' : 'Role Assigned'}</span>
                        {/* <input type="text" placeholder="Name" className="w-full text-[#1D242B] focus:outline-none"/> */}

                        {userEditing.role ? (
                            <div className="flex items-center w-full gap-2">
                                <label htmlFor="property_manager" className={`text-center w-full p-2 rounded-[10px] border cursor-pointer ${userInfo.role === 'property_manager' ? "bg-[#1D242B] text-[#FAFAFA]" : "border-[#1D242B]/50 text-[#1D242B] hover:bg-[#1D242B]/15 active:bg-[#FAFAFA]"}`}>
                                    <span>Property Manager</span>
                                    <input type="radio" name="role" id="property_manager" hidden value={'property_manager'} checked={userInfo.role === 'property_manager'} onChange={(e) => {setUserInfo(prev => ({...prev, role: e.target.value }));}}/>
                                </label>
                                <label htmlFor="admin" className={`text-center w-full p-2 rounded-[10px] cursor-pointer border ${userInfo.role === 'admin' ? "bg-[#1D242B] text-[#FAFAFA]" : "hover:bg-[#1D242B]/15 active:bg-[#FAFAFA] border-[#1D242B]/50 text-[#1D242B]"}`}>
                                    <span>Admin</span>
                                    <input type="radio" name="role" id="admin" hidden value={'admin'} checked={userInfo.role === 'admin'} 
                                    onChange={
                                        (e) => {setUserInfo(prev => ({ ...prev, role: e.target.value })); }}/>
                                </label>

                                <button onClick={() => toggleEditUser('role')} className="text-[#0077C0] text-[14px] font-bold cursor-pointer active:text-[#0077C0]/50">Cancel</button>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between w-full">
                                <span className="text-[#1D242B] font-bold">{userInfo.role}</span>
                                <button onClick={() => toggleEditUser('role')} className="text-[#0077C0] text-[14px] font-bold cursor-pointer active:text-[#0077C0]/50">Change</button>
                            </div>
                        )}

                    </div>

                    {/* <div className="flex items-center w-full p-[1rem] border-2 border-[#1D242B]/25 gap-2 rounded-[10px]">
                        <span className="text-[#1D242B]">Password</span>
                        <div className="flex items-center justify-between w-full">
                            <input type="password" name="password" id="user_password" value={'far_sd156s'} className="focus:outline-none"/>
                            <button className="text-[#0077C0] text-[14px] hover:text-[#0077C0]/90 cursor-pointer">Generate Password</button>
                        </div>
                    </div> */}

                </div>

                {(userInfo.role !== user?.role || userInfo.is_active !== user?.is_active) && (
                    <div className="flex items-center w-full gap-2">
                        <button onClick={() => handleUpdateUser(user?.id)} className="py-[1rem] text-[#FAFAFA] font-bold bg-[#0077C0] hover:bg-[#0077C0]/80 active:bg-[#0077C0] cursor-pointer rounded-[10px] w-full">Update</button>
                        <button onClick={isModalOpen} className="py-[1rem] text-[#1D242B] font-bold bg-[#1D242B]/15 hover:bg-[#1D242B]/30 active:bg-[#1D242B]/15 cursor-pointer rounded-[10px] w-full">Cancel</button>
                    </div>
                )}
            </div>
        </>
    )
}