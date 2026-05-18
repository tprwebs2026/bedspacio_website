// "use client"

// import { useForm } from "react-hook-form"
// import { useState } from "react";

// import SubmitHomeInquiry from "@/app/(with_nav)/(home-inquiry)/SubmitHomeInquiry";

// export type InquiryValues = {
//     fullname: string,
//     contactNumber: string,
//     email: string,
//     subject: string,
//     message: string
// }


// export default function HomeInquiry() {

//     const [loading, setLoading] = useState<boolean>(false);
//     const [error, setError] = useState<string>('');
//     const [isSubmitted, setIsSubmitted] = useState(false);

//     const { register, handleSubmit, reset, formState: { errors } } = useForm<InquiryValues>(); 
    
//     const onSubmit = async (data: InquiryValues) => {
//         // Send the data using the payload from InquiryValues to backend
//         setLoading(true);
//         setError('');
//         setIsSubmitted(false);

//         try {
//             // Fake loading of 1.5 seconds 
//             await new Promise(resolve => setTimeout(resolve, 1500));
            

//             const [lead_result] = await Promise.all([
//                 SubmitHomeInquiry(data),

//             ])

//             if (!lead_result?.success) {
//                 setError(
//                     lead_result?.message ||
//                     'Something went wrong'
//                 );
//                 return;
//             };

//             console.log("Payload: ", data);

//             setIsSubmitted(true)
//             reset();

//         } catch (err: any) {
//             console.error('Error submitting inquiry: ', err);
//             const message =
//                 err?.response?.data?.message ||
//                 err?.message ||
//                 'Unexpected error occurred';

//             setError(message);
//             setIsSubmitted(false);

//         } finally {
//             setLoading(false);
//         }
//     }

//     if (loading) {
//         return (
//             <div className="flex w-full items-center justify-center py-[2rem] min-[200px]">
//                 <img src="/loading/loading.gif" alt="loading" className='w-[50px] h-[50px]'/>
//             </div>
//         )
//     }

//     return (
//         <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center justify-center w-full h-auto py-[4rem] px-[1rem] xl:px-[8rem] lg:px-[8rem] md:px-[4rem] gap-[1rem] border-dashed border-t-2 border-t-[#1D242B]/50">
//             <span className="text-[48px] text-[#1D242B] text-center font-[900] leading-[1]">{!isSubmitted ? 'INQUIRE NOW' : 'INQUIRY SENT'}</span>
            
//             {!isSubmitted && !loading ? (
//                 <div className="flex flex-col items-center justify-center w-full xl:w-[700px] lg:w-[700px] md:w-[600px] h-auto gap-[1rem]">
//                     <div className="flex flex-col items-start gap-1 w-full">
//                         <span className="text-[16px] text-[#1D242B]">Full name</span>
//                         <input type="text" id="full_name" placeholder="Enter your full name here..." 
//                         { ...register('fullname', { required: 'Full name is required' }) }
//                         className="w-full p-3 text-[18px] text-[#1D242B] bg-[#FAFAFA] rounded-[10px] border border-[#1D242B] font-bold focus:outline-none focus:border-2 focus:border-[#0077C0]"/>
//                         {errors.fullname && (
//                             <span className='text-[16px] text-[#FF0000]'>{errors.fullname.message}</span>
//                         )}
//                     </div>

//                     <div className="flex flex-col items-start gap-1 w-full">
//                         <span className="text-[16px] text-[#1D242B]">Contact Number</span>
//                         <input type="text" id="contact_number" maxLength={11} placeholder="Enter your contact number here..." 
//                         {...register('contactNumber', { required: 'Contact number is required', 
//                             pattern: {
//                                 value: /^\+?[0-9\s\-()]+$/,
//                                 message: 'Invalid contact number format',
//                             },
//                             validate: value =>
//                                 value.replace(/\D/g, '').length === 11 ||
//                                 'Contact number must be 11 digits',
//                         })}
//                         onInput={(e) => {
//                             const target = e.target as HTMLInputElement;
//                             target.value = target.value.replace(/[^0-9]/g, '');
//                         }}
//                         className="w-full p-3 text-[18px] text-[#1D242B] bg-[#FAFAFA] rounded-[10px] border border-[#1D242B] font-bold focus:outline-none focus:border-2 focus:border-[#0077C0]"/>
//                         {errors.contactNumber && (
//                             <span className='text-[16px] text-[#FF0000]'>{errors.contactNumber.message}</span>
//                         )}
//                     </div>

//                     <div className="flex flex-col items-start gap-1 w-full">
//                         <span className="text-[16px] text-[#1D242B]">Email</span>
//                         <input type="text" id="email" placeholder="Enter your email address here..." 
//                         // value={email} onChange={(e) => {setEmail(e.target.value); setEmailError('')}}
//                         {...register('email', { required: 'Email is required', 
//                             pattern: {
//                                 value: /^\S+@\S+$/,
//                                 message: 'Invalid email address'
//                             }
//                         })}
//                         className="w-full p-3 text-[18px] text-[#1D242B] bg-[#FAFAFA] rounded-[10px] border border-[#1D242B] font-bold focus:outline-none focus:border-2 focus:border-[#0077C0]"/>
//                         {errors.email && (
//                             <span className="text-[16px] text-[#FF0000]">{errors.email.message}</span>
//                         )}
//                     </div>

//                     <div className="flex flex-col items-start gap-1 w-full">
//                         <span className="text-[16px] text-[#1D242B]">Subject (what is your inquiry about)</span>
//                         <input type="text" id="subject" placeholder="Enter the subject of your inquiry here..." 
//                         // value={subject} onChange={(e) => {setSubject(e.target.value); setSubjectError('')}}
//                         { ...register('subject', { required: 'Subject is required' }) }
//                         className="w-full p-3 text-[18px] text-[#1D242B] bg-[#FAFAFA] rounded-[10px] border border-[#1D242B] font-bold focus:outline-none focus:border-2 focus:border-[#0077C0]"/>
//                         {errors.subject && (
//                             <span className="text-[16px] text-[#FF0000]">{errors.subject.message}</span>
//                         )}
//                     </div>

//                     <div className="flex flex-col items-start gap-1 w-full">
//                         <span className="text-[16px] text-[#1D242B]">Message (at least 30 characters)</span>
//                         <textarea rows={5} placeholder="Enter your message here..." 
//                         {...register('message', {
//                             required: 'Message is required',
//                             validate: value =>
//                                 value.trim().length >= 30 ||
//                                 'Message must be at least 30 characters',
//                         })}
//                         className="w-full p-3 text-[18px] text-[#1D242B] bg-[#FAFAFA] rounded-[10px] border border-[#1D242B] font-bold focus:outline-none focus:border-2 focus:border-[#0077C0]"></textarea>
//                         {errors.message && (
//                             <span className="text-[16px] text-[#FF0000]">{errors.message.message}</span>
//                         )}
//                     </div>
//                 </div>
//             ) : (
//                 <div className="flex w-[500px] p-[2rem] rounded-[10px] bg-[#C7EEFF]">
//                     <span className="text-[18px] text-[#0077C0] text-center leading-[1.2] font-bold">Thank You! Your inquiry was submitted successfully. We've emailed you a confirmation and will be in with you touch soon.</span>
//                 </div>
//             )}

//             {!isSubmitted && (
//                 <button className="bg-[#1D242B] w-full xl:w-[700px] lg:w-[700px] md:w-[600px] p-3 rounded-[10px] text-[#FAFAFA] text-[18px] font-bold cursor-pointer hover:bg-[#1D242B]/90 active:bg-[#1D242B] transition-all duration-100">Submit</button>
//             )}
//         </form>
//     )
// }


// --------------------- POSTGRESQL ---------------------- //

"use client"

import { useForm } from "react-hook-form"
import { useState } from "react";
import { BASE_URL } from "@/config/config";
import axios from "axios";

export type InquiryValues = {
    fullname: string,
    contact_number: string,
    email: string,
    subject: string,
    message: string
}


export default function HomeInquiry() {

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<InquiryValues>(); 
    
    const onSubmit = async (data: InquiryValues) => {
        // Send the data using the payload from InquiryValues to backend
        setLoading(true);
        setError('');
        setIsSubmitted(false);

        try {
            // Fake loading of 1.5 seconds 
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            const payload = {
                fullname: data?.fullname,
                contact_number: data?.contact_number,
                email: data?.email,
                subject: data?.subject,
                message: data?.message
            };

            const inquiry = await axios.post(
                `${BASE_URL}/inquiry/v1/general-inquiry`, payload, { withCredentials: true }
            );

            console.log('General inquiry: ', inquiry);

            setIsSubmitted(true)
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
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="flex w-full items-center justify-center py-[2rem] min-[200px]">
                <img src="/loading/loading.gif" alt="loading" className='w-[50px] h-[50px]'/>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center justify-center w-full h-auto py-[4rem] px-[1rem] xl:px-[8rem] lg:px-[8rem] md:px-[4rem] gap-[1rem] border-dashed border-t-2 border-t-[#1D242B]/50">
            <span className="text-[48px] text-[#1D242B] text-center font-[900] leading-[1]">{!isSubmitted ? 'INQUIRE NOW' : 'INQUIRY SENT'}</span>
            
            {!isSubmitted && !loading ? (
                <div className="flex flex-col items-center justify-center w-full xl:w-[700px] lg:w-[700px] md:w-[600px] h-auto gap-[1rem]">
                    <div className="flex flex-col items-start gap-1 w-full">
                        <span className="text-[16px] text-[#1D242B]">Full name</span>
                        <input type="text" id="full_name" placeholder="Enter your full name here..." 
                        { ...register('fullname', { required: 'Full name is required' }) }
                        className="w-full p-3 text-[18px] text-[#1D242B] bg-[#FAFAFA] rounded-[10px] border border-[#1D242B] font-bold focus:outline-none focus:border-2 focus:border-[#0077C0]"/>
                        {errors.fullname && (
                            <span className='text-[16px] text-[#FF0000]'>{errors.fullname.message}</span>
                        )}
                    </div>

                    <div className="flex flex-col items-start gap-1 w-full">
                        <span className="text-[16px] text-[#1D242B]">Contact Number</span>
                        <input type="text" id="contact_number" maxLength={11} placeholder="Enter your contact number here..." 
                        {...register('contact_number', { required: 'Contact number is required', 
                            pattern: {
                                value: /^\+?[0-9\s\-()]+$/,
                                message: 'Invalid contact number format',
                            },
                            validate: value =>
                                value.replace(/\D/g, '').length === 11 ||
                                'Contact number must be 11 digits',
                        })}
                        onInput={(e) => {
                            const target = e.target as HTMLInputElement;
                            target.value = target.value.replace(/[^0-9]/g, '');
                        }}
                        className="w-full p-3 text-[18px] text-[#1D242B] bg-[#FAFAFA] rounded-[10px] border border-[#1D242B] font-bold focus:outline-none focus:border-2 focus:border-[#0077C0]"/>
                        {errors.contact_number && (
                            <span className='text-[16px] text-[#FF0000]'>{errors.contact_number.message}</span>
                        )}
                    </div>

                    <div className="flex flex-col items-start gap-1 w-full">
                        <span className="text-[16px] text-[#1D242B]">Email</span>
                        <input type="text" id="email" placeholder="Enter your email address here..." 
                        // value={email} onChange={(e) => {setEmail(e.target.value); setEmailError('')}}
                        {...register('email', { required: 'Email is required', 
                            pattern: {
                                value: /^\S+@\S+$/,
                                message: 'Invalid email address'
                            }
                        })}
                        className="w-full p-3 text-[18px] text-[#1D242B] bg-[#FAFAFA] rounded-[10px] border border-[#1D242B] font-bold focus:outline-none focus:border-2 focus:border-[#0077C0]"/>
                        {errors.email && (
                            <span className="text-[16px] text-[#FF0000]">{errors.email.message}</span>
                        )}
                    </div>

                    <div className="flex flex-col items-start gap-1 w-full">
                        <span className="text-[16px] text-[#1D242B]">Subject (what is your inquiry about)</span>
                        <input type="text" id="subject" placeholder="Enter the subject of your inquiry here..." 
                        // value={subject} onChange={(e) => {setSubject(e.target.value); setSubjectError('')}}
                        { ...register('subject', { required: 'Subject is required' }) }
                        className="w-full p-3 text-[18px] text-[#1D242B] bg-[#FAFAFA] rounded-[10px] border border-[#1D242B] font-bold focus:outline-none focus:border-2 focus:border-[#0077C0]"/>
                        {errors.subject && (
                            <span className="text-[16px] text-[#FF0000]">{errors.subject.message}</span>
                        )}
                    </div>

                    <div className="flex flex-col items-start gap-1 w-full">
                        <span className="text-[16px] text-[#1D242B]">Message (at least 30 characters)</span>
                        <textarea rows={5} placeholder="Enter your message here..." 
                        {...register('message', {
                            required: 'Message is required',
                            validate: value =>
                                value.trim().length >= 30 ||
                                'Message must be at least 30 characters',
                        })}
                        className="w-full p-3 text-[18px] text-[#1D242B] bg-[#FAFAFA] rounded-[10px] border border-[#1D242B] font-bold focus:outline-none focus:border-2 focus:border-[#0077C0]"></textarea>
                        {errors.message && (
                            <span className="text-[16px] text-[#FF0000]">{errors.message.message}</span>
                        )}
                    </div>
                </div>
            ) : (
                <div className="flex w-[500px] p-[2rem] rounded-[10px] bg-[#C7EEFF]">
                    <span className="text-[18px] text-[#0077C0] text-center leading-[1.2] font-bold">Thank You! Your inquiry was submitted successfully. We've emailed you a confirmation and will be in with you touch soon.</span>
                </div>
            )}

            {!isSubmitted && (
                <button className="bg-[#1D242B] w-full xl:w-[700px] lg:w-[700px] md:w-[600px] p-3 rounded-[10px] text-[#FAFAFA] text-[18px] font-bold cursor-pointer hover:bg-[#1D242B]/90 active:bg-[#1D242B] transition-all duration-100">Submit</button>
            )}
        </form>
    )
}