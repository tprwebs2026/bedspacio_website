"use client"

import { useState } from "react"
import { useForm } from "react-hook-form";

import axios from "axios";
import { BASE_URL } from '@/config/config'
import CreatedUserModal from "./CreatedUserModal";


interface ModalProp {
    isModalOpen: () => void;
}

type UserType = {
    fullname: string,
    username: string,
    email: string,
    contact_number: string,
    role: string
}

type Data = {
    message: string,
    username: string, 
    password: string
}

export default function UserCreateWrapperModal ({ isModalOpen }: ModalProp) {

    const [createdUser, setCreatedUser] = useState<Data | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [modalOpen, setModalOpen] = useState<boolean>(false)

    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<UserType>();
    const roleSelected = watch("role");


    const onSubmit = async (data: UserType) => {
        console.log('User: ', data);

        setLoading(true)

        try {
            // Fake loading for 2.5 seconds
            await new Promise(resolve => setTimeout(resolve, 2500));

            const result = await axios.post(`${BASE_URL}/user/v1/new_user`, { 
                fullname: data.fullname,
                username: data.username,
                email: data.email,
                contact_number: data.contact_number,
                role: data.role
            }, {
                withCredentials: true
            });

            console.log(result);
            setCreatedUser(result.data)
            setModalOpen(true)
            reset()

            return result.data;

        } catch (err) {
            console.error('Failed to create new user: ', err);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <span className="text-[#FAFAFA] font-bold">..loading</span>
        )
    };


    if (createdUser) {
        return (
            <div className="fixed w-full h-screen bg-[#1D242B]/15 flex items-center justify-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <CreatedUserModal 
                    data={createdUser}
                    closeModal={() => {
                        setCreatedUser(null);
                        setModalOpen(false); 
                        isModalOpen();
                    }}
                />
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="relative flex flex-col w-[700px] h-auto p-[2rem] bg-[#FAFAFA] rounded-[10px] gap-[2rem]">
            <div className="flex items-center justify-between w-full">
                <span className="text-[#1D242B] text-[24px] font-bold leading-tight">Create New User</span>
            </div>

            <div className="flex flex-col items-center justify-center w-full gap-[1rem]">
                <div className="flex flex-col w-full gap-1">
                    <div 
                        className={`
                            grid grid-cols-[1fr_4fr] place-items-center justify-items-start w-full p-[1rem] border-2 gap-2 rounded-[10px] ${errors.fullname ? 'border-[#C5111F]/25 focus-within:border-[#C5111F]' : 'border-[#1D242B]/25 focus-within:border-[#0077C0]'}`
                        }>
                        <span className="text-[#1D242B]">Name</span>
                        <input 
                            type="text" placeholder="Enter name here" 
                            {...register('fullname', {required: "Fullname is required"})}
                            className="w-full text-[#1D242B] font-bold focus:outline-none"
                        />
                    </div>

                    {errors.fullname && (
                        <span className="text-[14px] text-[#C5111F]">{errors.fullname.message}</span>
                    )}
                </div>

                <div className="flex flex-col w-full gap-1">
                    <div 
                        className={`
                            grid grid-cols-[1fr_4fr] place-items-center justify-items-start w-full p-[1rem] border-2 gap-2 rounded-[10px] ${errors.username ? 'border-[#C5111F]/25 focus-within:border-[#C5111F]' : 'border-[#1D242B]/25 focus-within:border-[#0077C0]'}`
                        }>
                        <span className="text-[#1D242B]">Username</span>
                        <input 
                            type="text" placeholder="Enter username here"
                            {...register('username', {required: 'Username is required'})}
                            className="w-full text-[#1D242B] font-bold focus:outline-none"
                        />
                    </div>

                    {errors.username && (
                        <span className="text-[14px] text-[#C5111F]">{errors.username.message}</span>
                    )}
                </div>

                <div className="flex flex-col w-full gap-1">
                    <div 
                        className={`
                            grid grid-cols-[1fr_4fr] place-items-center justify-items-start w-full p-[1rem] border-2 gap-2 rounded-[10px] ${errors.contact_number ? 'border-[#C5111F]/25 focus-within:border-[#C5111F]' : 'border-[#1D242B]/25 focus-within:border-[#0077C0]'}`
                        }>
                        <span className="text-[#1D242B]">Contact #</span>
                        <input 
                            type="text" placeholder="Enter contact number here"
                            {...register('contact_number', {required: 'contact number is required'})}
                            className="w-full text-[#1D242B] font-bold focus:outline-none"
                        />
                    </div>

                    {errors.contact_number && (
                        <span className="text-[14px] text-[#C5111F]">{errors.contact_number.message}</span>
                    )}
                </div>

                <div className="flex flex-col w-full gap-1">
                    <div 
                        className={`
                            grid grid-cols-[1fr_4fr] place-items-center justify-items-start w-full p-[1rem] border-2 gap-2 rounded-[10px] ${errors.email ? 'border-[#C5111F]/25 focus-within:border-[#C5111F]' : 'border-[#1D242B]/25 focus-within:border-[#0077C0]'}`
                        }>
                        <span className="text-[#1D242B]">Email</span>
                        <input 
                            type="text" placeholder="Enter email here"
                            {...register('email', {required: 'Email is required'})}
                            className="w-full text-[#1D242B] font-bold focus:outline-none"
                        />
                    </div>

                    {errors.email && (
                        <span className="text-[14px] text-[#C5111F]">{errors.email.message}</span>
                    )}
                </div>


                {/* TODO: change appearance when one is selected */}
                <div className="grid grid-cols-[1fr_4fr] place-items-center justify-items-start w-full gap-2 px-[1rem] py-[0.5rem] border-2 border-[#1D242B]/25 rounded-[10px]">
                    <span className="text-[#1D242B]">Assign a Role</span>
                    {/* <input type="text" placeholder="Name" className="w-full text-[#1D242B] focus:outline-none"/> */}
                    <div className="flex items-center w-full gap-2">
                        <label htmlFor="property_manager"
                            className={
                                `text-center w-full p-2 rounded-[10px] border cursor-pointer 
                                ${roleSelected === 'property_manager' ? 
                                    "bg-[#1D242B] text-[#FAFAFA]" : 
                                    "border-[#1D242B]/50 text-[#1D242B] hover:bg-[#1D242B]/15 active:bg-[#FAFAFA]"
                                }`
                            }>
                            <span>Property Manager</span>
                            <input 
                                type="radio" id="property_manager" hidden 
                                value={'property_manager'} 
                                {...register("role", { required: true })}
                            />
                        </label>
                        
                        <label htmlFor="admin"
                            className={
                                `text-center w-full p-2 rounded-[10px] cursor-pointer border 
                                ${roleSelected === 'admin' ? 
                                    "bg-[#1D242B] text-[#FAFAFA]" : 
                                    "hover:bg-[#1D242B]/15 active:bg-[#FAFAFA] border-[#1D242B]/50 text-[#1D242B]"
                                }`
                            }>
                            <span>Admin</span>
                            <input 
                                type="radio" id="admin" hidden 
                                value={'admin'} 
                                {...register("role", { required: true })}
                            />
                        </label>
                    </div>
                </div>

                {/* <div className="grid grid-cols-[1fr_4fr] place-items-center justify-items-start w-full p-[1rem] border-2 border-[#1D242B]/25 gap-2 rounded-[10px]">
                    <span className="text-[#1D242B]">Password</span>
                    <div className="flex items-center justify-between w-full">
                        <input type="password" name="password" id="user_password" value={'far_sd156s'} className="focus:outline-none"/>
                        <div className="flex items-center justify-end w-full">
                            <button className="text-[#0077C0] text-[14px] font-bold px-3 py-1 rounded-full hover:bg-[#0077C0]/15 active:bg-[#FAFAFA] cursor-pointer">Generate Password</button>
                        </div>
                    </div>
                </div> */}

            </div>

            <div className="flex items-center w-full gap-2">
                <button className="py-[1rem] text-[#FAFAFA] font-bold bg-[#0077C0] hover:bg-[#0077C0]/80 active:bg-[#0077C0] cursor-pointer rounded-[10px] w-full">Create</button>
                <button type="button" onClick={isModalOpen} className="py-[1rem] text-[#1D242B] font-bold bg-[#1D242B]/15 hover:bg-[#1D242B]/30 active:bg-[#1D242B]/15 cursor-pointer rounded-[10px] w-full">Cancel</button>
            </div>
        </form>
                
                    
    )
}