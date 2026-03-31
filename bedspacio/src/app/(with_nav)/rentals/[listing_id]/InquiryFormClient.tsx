"use client"

import Inquire from '@/asset/icon/inquire.svg'
import Reserve from '@/asset/icon/reserve.svg'
import Link from 'next/link';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

import SubmitInquiry from './SubmitInquiry';
import { ODOO_BASE_URL } from '@/config/config';

export type InquiryFormValues = {
    public_room_id: string,
    starting_price: string
    fullname: string,
    contactNumber: string,
    email: string,
    schedule: string,
    targetMoveIn: string,
    monthsOfStay: string,
    other: string
}


type PropertyManagerInfo = {
    slot: number,
    propertyManager: string,
    propertyManagerContact: string,
    profileImage: string,
    public_room_id: string,
    startingPrice: string
}


export default function InquiryFormClient ({ 
    slot,
    propertyManager, 
    propertyManagerContact, 
    profileImage,
    public_room_id,
    startingPrice
}: PropertyManagerInfo) {

    const [inquireOpen, setInquireOpen] = useState<boolean>(true);
    const [reserveOpen, setReserveOpen] = useState<boolean>(false);
    const [payload, setPayload] = useState<InquiryFormValues|null>(null);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false)

    const { register, handleSubmit, reset, formState: { errors, isSubmitSuccessful } } = useForm<InquiryFormValues>();


    const onSubmit = async (data: InquiryFormValues) => {
        if (submitting) return;

        setSubmitting(true);
        setLoading(true);
        setError('');
        setIsSubmitted(false);

        try {

            // Fake loading of 2.5 seconds
            await new Promise(resolve => setTimeout(resolve, 2000));

            const result = await SubmitInquiry(data) 

            if (!result || !result.success) {
                setError(result?.message || 'Something went wrong');
                return;
            }

            setIsSubmitted(true)
            setPayload(data)
            reset();

        } catch (err: any) {
            console.error('Error submitting inquiry: ', err);
            const message =
                err?.response?.data?.message ||
                err?.message ||
                'Unexpected error occurred';

            setError(message);
            setIsSubmitted(false);
            

        } finally {
            setSubmitting(false);
            setLoading(false)
        }
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

            {inquireOpen && !isSubmitted && !loading && (
                <form onSubmit={handleSubmit(onSubmit)} className={`relative flex flex-col w-full gap-[1rem] p-4 py-5 bg-[#C7EEFF]`}>

                    {/* SHOWS WHEN AVAILABLE SLOT FOR THE ROOM IS ZERO */}
                    {slot === 0 && (
                        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-center'>
                            <span className='text-[#1D242B] text-[36px] font-bold leading-[1]'>Sorry, there's no available slot yet.</span>
                        </div>
                    )}

                    <div className='flex flex-col w-full gap-1'>
                        <span className='text-[14px] text-[#1D242B]'>Room ID</span>
                        <span className='w-full border-2 border-[#1D242B]/75 p-2 rounded-[10px] font-bold bg-[#FAFAFA]'>{public_room_id}</span>
                    </div>

                    <input
                        type="hidden" 
                        {...register("public_room_id", { value: public_room_id })}
                    />
                    <input
                        type="hidden" 
                        {...register("starting_price", { value: startingPrice })}
                    />

                    <div className='flex flex-col gap-1 w-full'>
                        <span className='text-[14px] text-[#1D242B]'>Full name</span>
                        <input type="text" id="fullname" placeholder='Enter your full name here...'
                        {...register('fullname', { required: 'Full name is required!' })} disabled={slot==0}
                        className={`w-full border border-[#1D242B]/75 p-2 rounded-[10px] font-bold bg-[#FAFAFA] focus:outline-none focus:border-2 focus:border-[#0077C0] ${slot === 0 && 'opacity-50'}`}/>
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
                        })} disabled={slot==0}
                        onInput={(e) => {
                            const target = e.target as HTMLInputElement;
                            target.value = target.value.replace(/[^0-9]/g, '');
                        }}
                        className={`w-full border border-[#1D242B]/75 p-2 rounded-[10px] font-bold bg-[#FAFAFA] focus:outline-none focus:border-2 focus:border-[#0077C0] ${slot === 0 && 'opacity-50'}`}/>
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
                        })} disabled={slot==0}
                        className={`w-full border border-[#1D242B]/75 p-2 rounded-[10px] font-bold bg-[#FAFAFA] focus:outline-none focus:border-2 focus:border-[#0077C0] ${slot === 0 && 'opacity-50'}`}/>
                        {errors.email && (
                            <span className='text-[16px] text-[#FF0000]'>{errors.email.message}</span>
                        )}
                    </div>

                    <div className='flex flex-col gap-1 w-full'>
                        <span className='text-[14px] text-[#1D242B]'>Work Shift Schedule</span>
                        <select className={`w-full border border-[#1D242B]/75 p-2 rounded-[10px] font-bold bg-[#FAFAFA] focus:outline-none focus:border-2 focus:border-[#0077C0] ${slot === 0 && 'opacity-50'}`} defaultValue={""} {...register('schedule', {required: 'Schedule is required.'})} disabled={slot==0}>
                            {/* Morning Shift, Mid-Shift, Night Shift */}
                            <option value='' hidden>Select a schedule</option>
                            <option value='Morning Shift' >Morning Shift</option>
                            <option value='Mid Shift' >Mid Shift</option>
                            <option value='Night Shift'>Night Shift</option>
                        </select>
                        {errors.schedule && (
                            <span className='text-[16px] text-[#FF0000]'>{errors.schedule.message}</span>
                        )}
                    </div>

                    {/* <div className='flex flex-col gap-1 w-full'>
                        <span className='text-[14px] text-[#1D242B]'>Maximum Budget</span>
                        <input type="text" id="budget" placeholder='Enter your maximum budget...'
                        {...register('budget', { required: 'Maximum Budget is required' })}
                        className='w-full border border-[#1D242B]/75 p-2 rounded-[10px] font-bold bg-[#FAFAFA] focus:outline-none focus:border-2 focus:border-[#0077C0]'/>
                        {errors.budget && (
                            <span className='text-[16px] text-[#FF0000]'>{errors.budget.message}</span>
                        )}
                    </div> */}

                    <div className='flex flex-col gap-1 w-full'>
                        <span className='text-[14px] text-[#1D242B]'>Target Move-In</span>
                        <input type="date" id="target_move_in"
                        {...register('targetMoveIn', { required: 'Target Move-in is required' })} disabled={slot==0}
                        className={`w-full border border-[#1D242B]/75 p-2 rounded-[10px] font-bold bg-[#FAFAFA] focus:outline-none focus:border-2 focus:border-[#0077C0] ${slot === 0 && 'opacity-50'}`}/>
                        {errors.targetMoveIn && (
                            <span className='text-[16px] text-[#FF0000]'>{errors.targetMoveIn.message}</span>
                        )}
                    </div>

                    <div className='flex flex-col gap-1 w-full'>
                        <span className='text-[14px] text-[#1D242B]'>How many months do you plan to stay?</span>
                        <input type="text" id="month_stay" placeholder='Enter a number of months (ex. 3 months)'
                        {...register('monthsOfStay', {
                            required: 'Months of Stay is required',
                            valueAsNumber: true, // 
                            min: {
                                value: 1,
                                message: 'Must be at least 1 month',
                            },
                            max: {
                                value: 60,
                                message: 'Too many months',
                            },
                        })} disabled={slot==0}
                        onInput={(e) => {
                            const target = e.target as HTMLInputElement;
                            target.value = target.value.replace(/[^0-9]/g, '');
                        }}
                        className={`w-full border border-[#1D242B]/75 p-2 rounded-[10px] font-bold bg-[#FAFAFA] focus:outline-none focus:border-2 focus:border-[#0077C0] ${slot === 0 && 'opacity-50'}`}/>
                        {errors.monthsOfStay && (
                            <span className='text-[16px] text-[#FF0000]'>{errors.monthsOfStay.message}</span>
                        )}
                    </div>

                    <div className='flex flex-col gap-1 w-full'>
                        <span className='text-[14px] text-[#1D242B]'>Other:</span>
                        <textarea id="other" rows={5} placeholder='Enter any other concerns you have here...'
                        { ...register('other') } disabled={slot==0}
                        className={`w-full border border-[#1D242B]/75 p-2 rounded-[10px] font-bold bg-[#FAFAFA] focus:outline-none focus:border-2 focus:border-[#0077C0] ${slot === 0 && 'opacity-50'}`}></textarea>
                    </div>

                    <button className='bg-[#0077C0] p-2 w-full rounded-[10px] text-[#FAFAFA] hover:bg-[#1D242B] cursor-pointer active:bg-[#0077C0] transition-all duration-100'>Submit</button>
                </form>
            )} 


            {loading ? (
                <div className='flex items-center justify-center p-[2rem] bg-[#C7EEFF] w-full'>Loading...</div>
            ) : ( 
                isSubmitSuccessful && payload && !reserveOpen && (
                <div className='flex flex-col items-center bg-[#C7EEFF] gap-2 p-4 py-5 w-full'>
                    <div  className='flex flex-col items-center w-full bg-[#FAFAFA] p-4 gap-2 rounded-[15px]'>
                        <span className='font-bold text-[22px] text-left'>Submission details:</span>

                        <div className='flex items-center justify-between w-full border-b border-dashed border-[#1D242B]/25'>
                            <span>Room ID: </span>
                            <span><strong>{payload?.public_room_id}</strong></span>
                        </div>

                        <div className='flex items-center justify-between w-full border-b border-dashed border-[#1D242B]/25'>
                            <span>Name: </span>
                            <span><strong>{payload?.fullname}</strong></span>
                        </div>

                        <div className='flex items-center justify-between w-full border-b border-dashed border-[#1D242B]/25'>
                            <span>Contact Number: </span>
                            <span><strong>{payload?.contactNumber}</strong></span>
                        </div>

                        <div className='flex items-center justify-between w-full border-b border-dashed border-[#1D242B]/25'>
                            <span>Email: </span>
                            <span><strong>{payload?.email}</strong></span>
                        </div>

                        <div className='flex items-center justify-between w-full border-b border-dashed border-[#1D242B]/25'>
                            <span>Work Schedule: </span>
                            <span><strong>{payload?.schedule}</strong></span>
                        </div>

                        <div className={`flex items-center justify-between w-full ${payload?.other !== "" && 'border-b border-dashed border-[#1D242B]/25'}`}>
                            <span>Month/s of stay: </span>
                            <span><strong>{payload?.monthsOfStay}</strong></span>
                        </div>

                        {payload?.other !== "" && (
                            <div className='flex items-start justify-between w-full gap-2'>
                                <span>Other/s: </span>
                                <span className='text-right'><strong>{payload?.other}</strong></span>
                            </div>
                        )}

                        <span className='text-center text-[14px] bg-[#A6EEAB]/50 leading-[1] rounded-[10px] text-[#00822F] w-fit px-3 py-2'>Your inquiry was sent successfully. We've emailed you a confirmation and will be in touch with you soon.</span>
                    </div>
                </div>
            ))}

            {error && (
                <span>{error}</span>
            )}
            
            {reserveOpen && (
                <div className='flex flex-col w-full gap-[1rem] p-5 bg-[#C7EEFF]'>
                    <span className='text-[16px] font-bold'>Give a quick call to the assigned Property Manager of this listing</span>
                    <div className='flex flex-col items-center justify-center w-full rounded-[10px] p-4 bg-[#FAFAFA] gap-4'>
                        <div className='max-w-[150px] max-h-[150px] bg-[#C7EEFF] rounded-full overflow-hidden'>
                            {/* <img src={`data:image/webp;base64,${profileImage}`} alt="property-manager" className='w-full h-full bg-cover' /> */}

                            <img src={`${ODOO_BASE_URL}/${profileImage}`} alt="property-manager" className='w-full h-full bg-cover' />
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