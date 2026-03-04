"use client"

import { useForm } from "react-hook-form";

type inquiryFormValues = {
    fullname: string,
    contactnumber: string,
    email: string,
    subject: string,
    message: string
}

export default function ContactUs() {


    const { register, handleSubmit, reset, formState: { errors, isSubmitSuccessful } } = useForm<inquiryFormValues>();
    
    const onSubmit = (data: inquiryFormValues) => {
        console.log('Payload: ', data);
        reset();
    }

    return (
        <div className="flex flex-col min-h-screen w-auto items-start justify-start">
            <div className="flex flex-col xl:grid lg:grid xl:grid-cols-2 lg:grid-cols-2 px-[2rem] xl:px-[6rem] py-[4rem] gap-[2rem]">
                <div className="grid grid-cols-2 xl:flex lg:flex xl:flex-col lg:flex-col gap-[2rem] xl:gap-[4rem] lg:gap-[4rem]">
                    <div className="flex flex-col gap-[2rem]">
                        <span className="text-[28px] xl:text-[36px] lg:text-[36px] text-[#1D242B] font-[900] whitespace-nowrap">Contact Us</span>
                        <span className="text-[20px] xl:text-[24px] lg:text-[24px] text-[#1D242B] leading-[1.2]">
                            Got questions? We're easy to reach and happy to chat. Whether by call or message, our team is here to help you every step of the way.
                        </span>
                    </div>

                    <div className="flex flex-col gap-[2rem]">
                        <span className="text-[28px] xl:text-[36px] lg:text-[36px] text-[#0077C0] font-[900] whitespace-nowrap">Reach us on:</span>
                        <div className="flex flex-col items-start w-full">
                            <span className="text-[20px] text-[#1D242B] leading-[1.2]">Mobile: 0917 849 0044</span>
                            <span className="text-[20px] text-[#1D242B] leading-[1.2]">Telephone: (02) 8802 3188</span>
                            <span className="text-[20px] text-[#1D242B] leading-[1.2]">Email: bedspacio@gmail.com</span>
                        </div>
                    </div>
                </div>

                {!isSubmitSuccessful ? (
                    <div className="flex flex-col w-full h-auto rounded-[15px] border border-[#1D242B]/50 bg-[#C7EEFF]/50 overflow-hidden">
                        <span className="w-full py-[0.5rem] border-b-2 border-dashed border-b-[#1D242B]/50 text-[26px] text-center bg-[#FAFAFA] italic">Inquiry Form</span>

                        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col p-[2rem] w-full gap-[1rem]">
                            <div className="flex flex-col w-full items-start gap-1">
                                <span>Full Name</span>
                                <input type="text" id="full_name" placeholder="Enter your full name here..."
                                {...register('fullname', { required: 'Full name is required' })}
                                className="bg-[#FAFAFA] p-2 rounded-[5px] w-full border border-[#1D242B]/50 focus:outline-none focus:border-2 focus:border-[#0077C0]"
                                />
                                { errors.fullname && (
                                    <span className="text-[16px] leading-[1] text-[#FF0000]">{errors.fullname.message}</span>
                                ) }
                            </div>

                            <div className="flex flex-col w-full items-start gap-1">
                                <span>Contact Number</span>
                                <input type="text" id="contact_number" placeholder="Enter your contact number here..."
                                {...register('contactnumber', { required: 'Contact number is required', 
                                    pattern: {
                                        value: /^\+?[0-9\s\-()]+$/,
                                        message: 'Invalid contact number format',
                                    },
                                    validate: value =>
                                        value.replace(/\D/g, '').length === 11 ||
                                        'Contact number must be 11 digits',
                                }) }
                                className="bg-[#FAFAFA] p-2 rounded-[5px] w-full border border-[#1D242B]/50 focus:outline-none focus:border-2 focus:border-[#0077C0]"
                                />
                                {errors.contactnumber && (
                                    <span className="text-[16px] leading-[1] text-[#FF0000]">{errors.contactnumber.message}</span>
                                )}
                            </div>

                            <div className="flex flex-col w-full items-start gap-1">
                                <span>Email</span>
                                <input type="text" id="email_address" placeholder="Enter your email address here..."
                                {...register('email', { required: 'Email is required', 
                                    pattern: {
                                        value: /^\S+@\S+$/,
                                        message: 'Invalid email address'
                                    }
                                })}
                                className="bg-[#FAFAFA] p-2 rounded-[5px] w-full border border-[#1D242B]/50 focus:outline-none focus:border-2 focus:border-[#0077C0]"
                                />
                                {errors.email && (
                                    <span className="text-[16px] leading-[1] text-[#FF0000]">{errors.email.message}</span>
                                )}
                            </div>

                            <div className="flex flex-col w-full items-start gap-1">
                                <span>Subject (what your inquiry is about)</span>
                                <input type="text" id="subject" placeholder="Enter the subject of your inquiry here..."
                                {...register('subject', { required: 'Subject is required' })}
                                className="bg-[#FAFAFA] p-2 rounded-[5px] w-full border border-[#1D242B]/50 focus:outline-none focus:border-2 focus:border-[#0077C0]"
                                />
                                {errors.subject && (
                                    <span className="text-[16px] leading-[1] text-[#FF0000]">{errors.subject.message}</span>
                                )}
                            </div>

                            <div className="flex flex-col w-full items-start gap-1">
                                <span>Message</span>
                                <textarea id="message" rows={5} placeholder="Enter your message here..."
                                {...register('message', {
                                    required: 'Message is required',
                                    validate: value =>
                                        value.trim().length >= 30 ||
                                        'Message must be at least 30 characters',
                                })}
                                className="bg-[#FAFAFA] p-2 rounded-[5px] w-full border border-[#1D242B]/50 focus:outline-none focus:border-2 focus:border-[#0077C0]"></textarea>
                                {errors.message && (
                                    <span className="text-[16px] leading-[1] text-[#FF0000]">{errors.message.message}</span>
                                )}
                            </div>

                            <button className="w-fit self-end px-[4rem] py-[0.75rem] bg-[#1D242B] rounded-full text-[#FAFAFA] cursor-pointer hover:bg-[#0077C0] active:bg-[#1D242B] transition-all duration-100">Submit</button>
                        </form>
                    </div>
                ) : (
                    <div className="flex flex-col w-full h-auto items-center justify-center rounded-[15px] border-2 border-dashed border-[#1D242B]/50 bg-[#C7EEFF]/50 gap-[1rem] overflow-hidden">
                        <span className="text-[28px] text-[#0077C0] font-bold">INQUIRY SENT!</span>
                        <span className="text-[20px] text-[#1D242B] text-center leading-[1.2] w-[400px]">Thanks! Your inquiry was sent successfully. We've emailed you a confirmation and will be in touch soon.</span>
                    </div>
                )}
            </div>
        </div>
    )
}