"use client"

import Inquire from '@/asset/icon/inquire.svg'
import Reserve from '@/asset/icon/reserve.svg'
import Link from 'next/link';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

type InquiryFormValues = {
    fullname: string,
    contactNumber: string,
    email: string,
    schedule: string,
    targetMoveIn: string,
    budget: string,
    monthsOfStay: string,
    other: string
}


type PropertyManagerInfo = {
    propertyManager: string,
    propertyManagerContact: string,
    profileImage: string
}



export default function InquiryForm ({ 
    propertyManager, 
    propertyManagerContact, 
    profileImage
}: PropertyManagerInfo) {

    const [inquireOpen, setInquireOpen] = useState<boolean>(true);
    const [reserveOpen, setReserveOpen] = useState<boolean>(false)

    const { register, handleSubmit, reset, formState: { errors, isSubmitted, isSubmitSuccessful } } = useForm<InquiryFormValues>();


    const onSubmit = (data: InquiryFormValues) => {
        console.log('Payload: ', data);
        reset();        
    };


    return (
        <div className={`flex flex-col items-start w-full rounded-[10px] h-fit border-dashed border-2 border-[#0077C0]/75 overflow-hidden`}>
            <div className='grid grid-cols-2 w-full place-items-center bg-[#FAFAFA]'>
                <button onClick={() => {setInquireOpen(true); setReserveOpen(false);}} className={`${inquireOpen ? 'bg-[#C7EEFF] text-[#0077C0]' : 'bg-[#FAFAFA] text-[#0077C0] opacity-50'} flex items-center justify-center gap-2 p-2 py-4 w-full cursor-pointer hover:opacity-100 transition-all duration-100`}>
                    <Inquire className={`fill-[#0077C0] w-[30px] h-auto`} />
                    <span className='text-[20px] font-[900]'>Inquire</span>
                </button>
                <button onClick={() => {setReserveOpen(true); setInquireOpen(false);}} className={`${reserveOpen ? 'bg-[#C7EEFF] text-[#0077C0]' : 'bg-[#FAFAFA] text-[#0077C0] opacity-50'} flex items-center justify-center w-full gap-2 p-2 py-4 cursor-pointer hover:opacity-100 transition-all duration-100`}>
                    <Reserve className={`stroke-[#0077C0] w-[30px] h-auto`} />
                    <span className='text-[20px] font-[900]'>Reserve</span>
                </button>
            </div>

            {inquireOpen && (
                !isSubmitSuccessful ? (
                    <form onSubmit={handleSubmit(onSubmit)} className={`flex flex-col w-full gap-[1rem] p-4 py-5 bg-[#C7EEFF]`}>
                        <div className='flex flex-col w-full gap-1'>
                            <span className='text-[14px] text-[#1D242B]'>Selected Room</span>
                            <span className='w-full border-2 border-[#1D242B]/75 p-2 rounded-[10px] font-bold bg-[#FAFAFA]'>ROOM TITLE</span>
                        </div>

                        <div className='flex flex-col gap-1 w-full'>
                            <span className='text-[14px] text-[#1D242B]'>Full name</span>
                            <input type="text" id="fullname" placeholder='Enter your full name here...'
                            {...register('fullname', { required: 'Full name is required!' })}
                            className='w-full border border-[#1D242B]/75 p-2 rounded-[10px] font-bold bg-[#FAFAFA] focus:outline-none focus:border-2 focus:border-[#0077C0]'/>
                            {errors.fullname && (
                                <span className='text-[16px] text-[#FF0000]'>{errors.fullname.message}</span>
                            )}
                        </div>

                        <div className='flex flex-col gap-1 w-full'>
                            <span className='text-[14px] text-[#1D242B]'>Contact Number</span>
                            <input type="text" id="contact_number" placeholder='Enter your contact number here...'
                            {...register('contactNumber', { required: 'Contact number is required', 
                                pattern: {
                                    value: /^\+?[0-9\s\-()]+$/,
                                    message: 'Invalid contact number format',
                                },
                                validate: value =>
                                    value.replace(/\D/g, '').length === 11 ||
                                    'Contact number must be 11 digits',
                            })}
                            className='w-full border border-[#1D242B]/75 p-2 rounded-[10px] font-bold bg-[#FAFAFA] focus:outline-none focus:border-2 focus:border-[#0077C0]'/>
                            {errors.contactNumber && (
                                <span className='text-[16px] text-[#FF0000]'>{errors.contactNumber.message}</span>
                            )}
                        </div>

                        <div className='flex flex-col gap-1 w-full'>
                            <span className='text-[14px] text-[#1D242B]'>Email</span>
                            <input type="text" id="email" placeholder='Enter your email address here...'
                            {...register('email', { required: 'Email is required', 
                                pattern: {
                                    value: /^\S+@\S+$/,
                                    message: 'Invalid email address'
                                }
                            })}
                            className='w-full border border-[#1D242B]/75 p-2 rounded-[10px] font-bold bg-[#FAFAFA] focus:outline-none focus:border-2 focus:border-[#0077C0]'/>
                            {errors.email && (
                                <span className='text-[16px] text-[#FF0000]'>{errors.email.message}</span>
                            )}
                        </div>

                        <div className='flex flex-col gap-1 w-full'>
                            <span className='text-[14px] text-[#1D242B]'>Work Shift Schedule</span>
                            <input type="text"  id="schedule" placeholder='Enter the time of your work shift (ex. 10:00 AM to 7:00 PM)'
                            {...register('schedule', { required: 'Work shift schedule is required.' })}
                            className='w-full border border-[#1D242B]/75 p-2 rounded-[10px] font-bold bg-[#FAFAFA] focus:outline-none focus:border-2 focus:border-[#0077C0]'/>
                            {errors.schedule && (
                                <span className='text-[16px] text-[#FF0000]'>{errors.schedule.message}</span>
                            )}
                        </div>

                        <div className='flex flex-col gap-1 w-full'>
                            <span className='text-[14px] text-[#1D242B]'>Maximum Budget</span>
                            <input type="text" id="budget" placeholder='Enter your maximum budget...'
                            {...register('budget', { required: 'Maximum Budget is required' })}
                            className='w-full border border-[#1D242B]/75 p-2 rounded-[10px] font-bold bg-[#FAFAFA] focus:outline-none focus:border-2 focus:border-[#0077C0]'/>
                            {errors.budget && (
                                <span className='text-[16px] text-[#FF0000]'>{errors.budget.message}</span>
                            )}
                        </div>

                        <div className='flex flex-col gap-1 w-full'>
                            <span className='text-[14px] text-[#1D242B]'>Target Move-In</span>
                            <input type="date" id="target_move_in"
                            {...register('targetMoveIn', { required: 'Target Move-in is required' })}
                            className='w-full border border-[#1D242B]/75 p-2 rounded-[10px] font-bold bg-[#FAFAFA] focus:outline-none focus:border-2 focus:border-[#0077C0]'/>
                            {errors.targetMoveIn && (
                                <span className='text-[16px] text-[#FF0000]'>{errors.targetMoveIn.message}</span>
                            )}
                        </div>

                        <div className='flex flex-col gap-1 w-full'>
                            <span className='text-[14px] text-[#1D242B]'>How many months do you plan to stay?</span>
                            <input type="text" id="month_stay" placeholder='Enter a number of months (ex. 3 months)'
                            { ...register('monthsOfStay', { required: 'Months of Stay is required' }) }
                            className='w-full border border-[#1D242B]/75 p-2 rounded-[10px] font-bold bg-[#FAFAFA] focus:outline-none focus:border-2 focus:border-[#0077C0]'/>
                            {errors.monthsOfStay && (
                                <span className='text-[16px] text-[#FF0000]'>{errors.monthsOfStay.message}</span>
                            )}
                        </div>

                        <div className='flex flex-col gap-1 w-full'>
                            <span className='text-[14px] text-[#1D242B] font-bold'>Other:</span>
                            <textarea id="other" rows={5} placeholder='Enter any other concerns you have here...'
                            { ...register('other') }
                            className='w-full border border-[#1D242B]/75 p-2 rounded-[10px] font-bold bg-[#FAFAFA] focus:outline-none focus:border-2 focus:border-[#0077C0]'></textarea>
                        </div>

                        <button className='bg-[#0077C0] p-2 w-full rounded-[10px] text-[#FAFAFA] hover:bg-[#1D242B] cursor-pointer active:bg-[#0077C0] transition-all duration-100'>Submit</button>
                    </form>
                ) : (
                    <span className='text-center text-[#0077C0] font-bold w-full p-4 py-5 bg-[#C7EEFF]'>Thanks! Your inquiry was sent successfully. We've emailed you a confirmation and will be in touch soon.</span>
                )
            )}
            
            {reserveOpen && (
                <div className='flex flex-col w-full gap-[1rem] p-5 bg-[#C7EEFF]'>
                    <span className='text-[16px] font-bold'>Give a quick call to the assigned Property Manager of this listing</span>
                    <div className='flex flex-col items-center justify-center w-full rounded-[10px] p-4 bg-[#FAFAFA] gap-4'>
                        <div className='max-w-[150px] max-h-[150px] bg-[#C7EEFF] rounded-full overflow-hidden'>
                            <img src={`data:image/webp;base64,${profileImage}`} alt="property-manager" className='w-full h-full bg-cover' />
                        </div>

                        <div className='flex flex-col items-center justify-center gap-2 w-full'>
                            <span className='text-[20px] text-[#0077C0] font-[900] leading-[1]'>{propertyManager}</span>
                            <span className='text-[16px] text-[#1D242B] leading-[1]'>Assigned Branch</span>

                            <div className='flex flex-col items-center justify-center w-full gap-4 pt-2'>
                                <span className='text-[16px] text-[#FAFAFA] p-2 bg-[#0077C0] rounded-full leading-[0.75]'>Contact Details</span>
                                <span className='text-[20px] text-[#1D242B] font-bold leading-[1]'>{propertyManagerContact}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}