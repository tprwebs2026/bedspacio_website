// ------------- POSTGRES ------------- //

import Arrow from '@/asset/icon/arrow-long.svg'

import Breadcrumbs from "@/components/BreadCrumb";
import Link from "next/link";

import { Metadata } from 'next';
import { getContactImage } from '../../../../lib/content';

export const metadata: Metadata = {
    title: 'Contact Us | BedSpacio',
    description: "Got questions? We're easy to reach and happy to chat. Whether by call or message, our team is here to help you every step of the way."
}


// export type inquiryFormValues = {
//     fullname: string,
//     contact_number: string,
//     email: string,
//     subject: string,
//     message: string
// }

export default async function ContactUs() {

    const contactImage = await getContactImage();

    return (
        <div className="flex flex-col min-h-screen w-full items-start justify-start">

            <div className="flex items-center px-[1rem] xl:px-[8rem] lg:px-[4rem] py-[1rem]">
                <Breadcrumbs />
            </div>

            <div className="flex flex-col xl:grid lg:grid xl:grid-cols-2 lg:grid-cols-2 px-[1rem] px-[1rem] xl:px-[8rem] lg:px-[4rem] py-[2rem] gap-[2rem] w-full">
                <div className="flex flex-col xl:flex lg:flex xl:flex-col lg:flex-col md:grid md:grid-cols-2 gap-[2rem] xl:gap-[4rem] lg:gap-[4rem]">
                    <div className="flex flex-col gap-[2rem]">
                        <div className="flex items-center gap-3">
                            <Link href="/" className='bg-[#0077C0] hover:bg-[#0077C0]/75 active:bg-[#1D242B] xl:active:bg-[#0077C0] lg:active:bg-[#0077C0] rounded-full '>
                                <Arrow className="-rotate-180 w-[50px] h-[50px] p-3 " />
                            </Link>
                            <span className="text-[28px] xl:text-[36px] lg:text-[36px] text-[#1D242B] font-[900] whitespace-nowrap">Contact Us</span>
                        </div>
                        <span className="text-[20px] xl:text-[24px] lg:text-[24px] text-[#1D242B] leading-[1.2]">
                            Got questions? We're easy to reach and happy to chat. Whether by call or message, our team is here to help you every step of the way.
                        </span>
                    </div>

                    <div className="flex flex-col gap-[2rem]">
                        <span className="text-[28px] xl:text-[36px] lg:text-[36px] text-[#0077C0] font-[900] whitespace-nowrap">Reach us on:</span>
                        <div className="flex flex-col items-start w-full gap-2">
                            <span className="text-[20px] text-[#1D242B] leading-[1.2]">Mobile: 0917 849 0044</span>
                            <span className="text-[20px] text-[#1D242B] leading-[1.2]">Landline: (02) 8802 3188</span>
                            <span className="text-[20px] text-[#1D242B] leading-[1.2]">Email: bedspacio@gmail.com</span>
                        </div>
                    </div>
                </div>


                <div className='flex w-full h-full overflow-hidden rounded-[50px]'>
                    <img src={contactImage?.asset_url} alt={contactImage?.asset_name} className='w-full h-full object-cover rounded-[10px]'/>
                </div>


            </div>
        </div>
    )
}