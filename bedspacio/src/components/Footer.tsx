"use client"

import Phone from '@/asset/icon/telephone.svg'
import Address from '@/asset/icon/map-marker.svg'
import Email from '@/asset/icon/email.svg'
import Facebook from '@/asset/icon/facebook.svg'
import Instagram from "@/asset/icon/instagram.svg"
import Tiktok from '@/asset/icon/tiktok.svg'

import Link from 'next/link'

export default function Footer() {
    return (
        <div className="flex flex-col items-start justify-between min-h-[350px] w-auto px-[1rem] pt-[3rem] bg-[#1D242B]">
            <div className="flex flex-col pb-[2rem] xl:grid lg:grid md:grid xl:grid-cols-[40%_30%_30%] lg:grid-cols-[40%_30%_30%] md:grid-cols-[40%_30%_30%] w-full">
                <div className="flex flex-col items-start justify-start gap-[2.5rem]">
                    <img src="/asset/bedspacio_logo.jpg" alt="bedspacio-logo" className="w-[100px] h-auto"/>
                    
                </div>
                <div className="flex flex-col items-start justify-start w-auto gap-[2rem]">
                    <span className="text-[20px] text-[#C7EEFF] font-[900]">Contact Us</span>

                    <div className="flex flex-col items-start justify-start gap-[0.2rem]">
                        <span className='text-[18px] text-[#FAFAFA]'>(63) 917-849-0044</span>
                        <span className='text-[18px] text-[#FAFAFA]'>Lirio St Pembo , Makati, Philippines, 1218</span>
                        <span className='text-[18px] text-[#FAFAFA]'>bedspacio@gmail.com</span>
                    </div>
                </div>

                <div className="flex flex-col items-start justify-start w-auto gap-[2rem]">
                    <span className="text-[20px] text-[#C7EEFF] font-[900]">Our Company</span>

                    <div className='flex flex-col items-start justify-start'>
                        <Link href="/about" className='text-[18px] text-[#FAFAFA] hover:underline active:text-[#C7EEFF]'>About Us</Link>
                        <Link href="/how-it-works" className='text-[18px] text-[#FAFAFA] hover:underline active:text-[#C7EEFF]'>How It Works</Link>
                        <Link href="/rentals" className='text-[18px] text-[#FAFAFA] hover:underline active:text-[#C7EEFF]'>Rental Listings</Link>
                    </div>
                </div>
            </div>

            <div className='flex flex-col items-center justify-between w-full border-t border-t-[#FAFAFA]/25 gap-[1rem] py-[1rem]'>
                <span className="text-[16px] xl:text-[18px] lg:text-[18px] md:text-[16px] text-[#FAFAFA]">Comfortable bedspace and dormitory living with BedSpacio.</span>
                <div className='flex items-center gap-[1rem]'>
                    <span className='text-[20px] text-[#FAFAFA] font-bold'>Follow Us</span>
                    <div className='flex items-center gap-[1rem]'>
                        <Link href="https://www.facebook.com/BedSpacio" target='_blank' className='flex items-center justify-center w-[40px] h-[40px] rounded-full bg-[#FAFAFA]'>
                            <Facebook className="w-[35px] h-auto hover:scale-110 active:scale-100 transition-all duration-100" />
                        </Link>
                        <Link href="https://www.instagram.com/bedspacio/" target='_blank' className='flex items-center justify-center w-[40px] h-[40px] rounded-full bg-[#FAFAFA]'>
                            <Instagram className="w-[35px] h-auto hover:scale-110 active:scale-100 transition-all duration-100" />
                        </Link>
                        <Link href="https://www.tiktok.com/@bedspacio/" target='_blank' className='flex items-center justify-center w-[40px] h-[40px] rounded-full bg-[#FAFAFA]'>
                            <Tiktok className="w-[25px] h-auto hover:scale-110 active:scale-100 transition-all duration-100" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}