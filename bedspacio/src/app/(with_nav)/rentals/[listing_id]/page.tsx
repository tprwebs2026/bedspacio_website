
import Link from "next/link";

import InquiryForm from "./InquiryForm";
import ArrowLong from '@/asset/icon/arrow-long.svg'
import Arrow from '@/asset/icon/arrow-right.svg'


type Props = { params: { listing_id: string } };

export default async function ListingInfoPage ({ params }: Props ) {


    // FETCH THE DATA LIKE THIS LATER ON
    /*
        const res = await fetch(
            `http://localhost:5000/api/listings/${params.listingId}`,
            { cache: "no-store" }
        );
    */

    

    return (
        <div className="relative flex flex-col items-start w-full min-h-screen">
            <div className="flex items-center w-full px-[1rem] xl:px-[8rem] lg:px-[6rem] py-[1rem]">
                <span>{`Rentals > Listings >`}</span>
            </div>

            
            
            <section className="flex flex-col items-start justify-start w-full min-h-[800px] px-[1rem] xl:px-[8rem] lg:px-[2rem] gap-[2rem] box-border">
                <div className="relative flex w-full h-[400px] gap-[1rem] rounded-[10px]">
                    <div className="absolute top-3 left-3 rounded-[10px] p-2 flex items-center gap-2 bg-[#0077C0]">
                        <span className="text-[#FAFAFA] text-[16px]">Bedspace</span>
                        <span className="text-[#FAFAFA] text-[16px]">|</span>
                        <span className="text-[#FAFAFA] text-[16px]">Male Only</span>
                    </div>

                    <div className="flex flex-col items-center justify-center xl:flex-row lg:flex-row md:flex-col w-full h-full gap-2">
                        <div className="relative flex items-center justify-center w-full h-full">
                            <div className="xl:hidden lg:hidden absolute flex items-center justify-between w-full h-full px-2">
                                <button className="bg-[#FAFAFA] rounded-full cursor-pointer active:bg-[#0077C0] active:scale-95 transition-all duration-100">
                                    <Arrow className="w-[50px] h-[50px] -rotate-180"/>
                                </button>

                                <button className="bg-[#FAFAFA] rounded-full cursor-pointer active:bg-[#0077C0] active:scale-95 transition-all duration-100">
                                    <Arrow className="w-[50px] h-[50px]"/>
                                </button>
                            </div>
                            <img src="/asset/bedspace_example.jpg" alt="sample" className="w-full h-full object-cover rounded-[10px]"/>
                        </div>

                        <div className="hidden xl:grid lg:grid grid-cols-2 grid-rows-2 gap-2 w-full h-full">
                            <img src="/asset/bedspace_example.jpg" alt="sample" className="w-full h-[25%] xl:h-full lg:h-full object-cover rounded-[10px]"/>
                            <img src="/asset/bedspace_example.jpg" alt="sample" className="w-full h-[25%] xl:h-full lg:h-full object-cover rounded-[10px]"/>
                            <img src="/asset/bedspace_example.jpg" alt="sample" className="w-full h-[25%] xl:h-full lg:h-full object-cover rounded-[10px]"/>
                            <img src="/asset/bedspace_example.jpg" alt="sample" className="w-full h-[25%] xl:h-full lg:h-full object-cover rounded-[10px]"/>
                        </div>
                    </div>
                </div>

                <div className="relative flex flex-col xl:grid lg:grid md:flex xl:grid-cols-[60%_40%] lg:grid-cols-[60%_40%] md:flex-col pb-[4rem] box-border gap-[2rem] xl:gap-0 lg:gap-0 md:gap-[2rem]">
                    <div className="flex flex-col items-start justify-start w-full gap-[1.5rem] pr-4">
                        <div className="flex flex-col items-start justify-start w-full gap-[1rem] pb-[1rem]">
                            <span className="text-[28px] text-[#1D242B] font-[900]">ROOM NAME</span>
                            <div className="flex flex-col items-start gap-1">
                                <span className="text-[#0077C0] text-[20px] leading-[1]">Starts at</span>
                                <div className="flex items-center gap-1">
                                    <span className="text-[#0077C0] text-[28px] font-[900] leading-[1]">PHP 1000.00</span>
                                    <span className="text-[#0077C0] text-[28px] font-bold leading-[1] opacity-35">/monthly</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-[14px] xl:text-[16px] lg:text-[16px] text-[#FAFAFA] font-[900] leading-[1] bg-[#0077C0] p-2 rounded-full px-4">MAXIMUM PAX: 8</span>
                                <span className="text-[14px] xl:text-[16px] lg:text-[16px] text-[#FAFAFA] font-[900] leading-[1] bg-[#0077C0] p-2 rounded-full px-4">AVAILABLE SLOTS: 2</span>
                            </div>
                        </div>

                        <div className="flex flex-col items-start gap-[1rem] w-auto pt-[1rem] border-t border-t-[#1D242B]/50">
                            <span className="text-[20px] text-[#1D242B] font-[900]">Description</span>
                            <p className="text-[18px] text-[#1D242B]">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                        </div>

                        <div className="flex flex-col items-start gap-2 w-auto">
                            <span className="text-[20px] text-[#1D242B] font-[900]">Inclusion/s</span>
                            <div className="flex flex-col gap-[1rem] items-start">
                                <div className="flex items-center gap-2">
                                    <ArrowLong className="w-[25px] h-auto" />
                                    <span className="text-[18px] text-[#1D242B] leading-[1]">Aircon</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <ArrowLong className="w-[25px] h-auto" />
                                    <span className="text-[18px] text-[#1D242B] leading-[1]">Bed & Mattress</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <ArrowLong className="w-[25px] h-auto" />
                                    <span className="text-[18px] text-[#1D242B] leading-[1]">Steel Locker</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <ArrowLong className="w-[25px] h-auto" />
                                    <span className="text-[18px] text-[#1D242B] leading-[1]">Wi-Fi</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-start gap-[1rem] w-auto">
                            <span className="text-[20px] text-[#1D242B] font-[900]">Payment Term/s</span>
                            <div className="flex flex-col gap-[1rem] items-start">
                                <div className="flex items-center gap-2">
                                    <ArrowLong className="w-[25px] h-auto" />
                                    <span className="text-[18px] text-[#1D242B] leading-[1]">2 Months deposit</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <ArrowLong className="w-[25px] h-auto" />
                                    <span className="text-[18px] text-[#1D242B] leading-[1]">Additional Php 1000.00 for utility deposit</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <ArrowLong className="w-[25px] h-auto" />
                                    <span className="text-[18px] text-[#1D242B] leading-[1]">No Advanced Payment</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-start gap-[1rem] w-full">
                            <span className="text-[20px] text-[#1D242B] font-[900]">Location</span>
                            <div className="flex flex-col gap-[1rem] items-start w-full">
                                <span className="text-[20px] text-[#1D242B]">Lirio St Pembo , Makati, Philippines, 1218</span>
                                <div className="flex w-full aspect-[16/9] rounded-[10px] overflow-hidden border-2 border-[#1D242B]/50">
                                    <iframe className="w-full h-full border-0" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4314.530524048516!2d121.05546727557147!3d14.544422785935382!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c9166b115a33%3A0xfba6d8b32dd2f720!2sBedSpacio!5e1!3m2!1sen!2sph!4v1771987409424!5m2!1sen!2sph"  loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="scroll-mt-24 flex w-full h-full items-start" id="form">
                        <InquiryForm />
                    </div>
                </div>
            </section>
        </div>
    )
}