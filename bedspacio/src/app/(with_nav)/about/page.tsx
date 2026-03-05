
import Inquire from '@/asset/icon/inquire.svg'

import Link from "next/link"

export default function About() {
    return (
        <div className="flex flex-col items-center justify-start min-h-screen w-auto">

            <section className="relative flex items-center justify-center w-full h-screen xl:h-[300px] lg:h-[300px] bg-[#1D242B] overflow-hidden">
                <div className="absolute flex items-center w-full inset-0 opacity-25">
                    <img src="/asset/Aboutus_header_bg_image.jpg" alt="about-us-header" className='w-full h-full object-cover' />
                </div>

                <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-[24px] text-[#FAFAFA]">About</span>
                    <span className="text-[60px] xl:text-[82px] lg:text-[82px] text-[#FAFAFA] font-[900] leading-[1]">BedSpacio</span>
                </div>
            </section>

            <div className="flex flex-col w-full pt-[2rem] px-[1rem] xl:px-[8rem] lg:px-[8rem] md:px-[2rem] gap-[2rem]">
                <section className="grid grid-rows-1 xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 w-full py-[2rem] gap-[1rem]">
                    <div className="flex flex-col gap-[1rem] w-full items-center justify-center p-[1rem] xl:p-[2rem] lg:p-[2rem]">
                        <span className="text-[32px] text-[#1D242B] text-center font-bold">Who are we</span>
                        <span className="text-[24px] text-[#1D242B] text-center">
                            BedSpacio is known for it's accomodation services. BedSpacio offers comfortable bedspace and apartment rentals.
                        </span>
                    </div>

                    <div className="flex items-center justify-center bg-[#C7EEFF] rounded-[10px] min-h-[400px]">

                    </div>
                </section>

                <section className="flex flex-col w-full items-center py-[2rem] gap-[2rem] overflow-x-auto">
                    <span className="text-[28px] text-[#1D242B] font-bold">History</span>
                    <span className="text-[30px] xl:text-[42px] lg:text-[42px] text-[#0077C0] font-bold text-center w-auto leading-tight">Our journey began with helping renters find safe, affordable bedspace and grew into offering apartments designed for modern living.</span>

                    <div className="flex items-center gap-[1rem] h-[350px] w-full rounded-[15px] overflow-x-auto">
                        <div className="bg-[#C7EEFF] min-w-[350px] xl:w-full lg:w-full h-full rounded-[15px]">

                        </div>

                        <div className="bg-[#C7EEFF] min-w-[350px] xl:w-full lg:w-full h-full rounded-[15px]">

                        </div>

                        <div className="bg-[#C7EEFF] min-w-[350px] xl:w-full lg:w-full h-full rounded-[15px]">

                        </div>
                    </div>
                </section>

                <section className="grid grid-rows-1 xl:grid-cols-2 lg:grid-cols-2 md:grid-rows-1 w-full py-[2rem] gap-[2rem] place-items-start">
                    <div className="flex flex-col items-center justify-center w-full gap-[2rem]">
                        <span className="text-[28px] xl:text-[36px] lg:text-[36px] text-[#1D242B] text-center font-[900]">Our Mission</span>
                        <div className="flex items-center justify-center w-[150px] h-[150px] xl:w-[300px] xl:h-[300px] rounded-full bg-[#C7EEFF]">
                            {/* Image here */}
                        </div>

                        <span className="text-[20px] xl:text-[24px] lg:text-[24px] text-[#0077C0] text-center w-auto">
                            To provide safe, comfortable, and affordable bedspace and apartment rentals while making the renting experience simple, transparent, and stress-free for every tenant.
                        </span>
                    </div>

                    <div className="flex flex-col items-center justify-center w-full gap-[2rem]">
                        <span className="text-[28px] xl:text-[36px] lg:text-[36px] text-[#1D242B] font-[900]">Our Vision</span>
                        <div className="flex items-center justify-center w-[150px] h-[150px] xl:w-[300px] xl:h-[300px] rounded-full bg-[#C7EEFF]">
                            {/* Image here */}
                        </div>

                        <span className="text-[20px] xl:text-[24px] lg:text-[24px] text-[#0077C0] text-center w-auto">
                            To become a trusted rental platform where people can easily find a place that feels like home—no matter their budget or stage in life.
                        </span>
                    </div>
                </section>   

                <section className="flex flex-col items-center justify-center gap-[2rem] py-[4rem]">
                    <span className="text-[28px] xl:text-[36px] lg:text-[36px] text-[#1D242B] text-center font-bold">Our Property Managers</span>

                    <div className="grid grid-rows-1 xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 gap-[4rem] w-full">
                        <div className="flex flex-col gap-[1rem] items-center justify-center">
                            <div className="w-[150px] h-[150px] xl:w-[300px] xl:h-[300px] rounded-full bg-[#C7EEFF]">
                                {/* Image here */}
                            </div>
                            <div className="flex flex-col items-center justify-center">
                                <span className="text-[28px] text-[#0077C0] font-bold">Juan dela Cruz</span>
                                <span className="text-[20px] text-[#1D242B]">Branch Name Here</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-[1rem] items-center justify-center">
                            <div className="w-[150px] h-[150px] xl:w-[300px] xl:h-[300px] rounded-full bg-[#C7EEFF]">
                                {/* Image here */}
                            </div>
                            <div className="flex flex-col items-center justify-center">
                                <span className="text-[28px] text-[#0077C0] font-bold">Juan dela Cruz also</span>
                                <span className="text-[20px] text-[#1D242B]">Branch Name Here</span>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="flex flex-col justify-center items-center py-[8rem] gap-[1rem]">
                    <span className="text-[36px] xl:text-[48px] lg:text-[48px] md:text-[48px] text-[#1D242B] text-center font-[900] leading-[1]">Want to know more?</span>
                    <span className="text-[28px] text-[#1D242B] text-center  font-bold leading-[1]">You can always ask</span>

                    <Link href="/contact-us" className="group flex items-center gap-[1rem] px-[4rem] p-[1rem] bg-[#0077C0] rounded-full hover:scale-104 hover:bg-[#1D242B] active:scale-100 active:bg-[#0077C0] transition-all duration-100">
                        <Inquire className="group-hover:-rotate-25 fill-[#FAFAFA] w-[35px] h-auto transition-all duration-100"/>
                        <span className="text-[24px] text-[#FAFAFA] font-bold">INQUIRE HERE</span>
                    </Link>
                </section>
            </div>
        </div>
    )
}