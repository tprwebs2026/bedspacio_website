
import SearchFilter from '@/components/SearchFilter'
import FrequentlyAskedQuestions from '@/components/FrequentlyAskedQuestion'
import HomeInquiry from '@/components/HomeInquiry'

import ArrowRight from '@/asset/icon/arrow-right.svg'
import ArrowLong from '@/asset/icon/arrow-long.svg'

import Quote from '@/asset/icon/quote.svg'
import Star from '@/asset/icon/star.svg'

import Link from 'next/link'
// import { useSearchParams } from "next/navigation";
// import { useState, useMemo } from 'react'

import BranchCard from '@/components/BranchCard'
import RoomType from '@/components/RoomType'

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen items-start justify-start ">
            
            <section className="relative flex flex-col w-full min-h-[800px] xl:h-screen items-center justify-center bg-[#0077C0] xl:items-start xl:justify-center lg:items-start lg:justify-center lg:h-[800px]">
                <img src="/image/bedspaco-hero-x-large-example.jpg" alt="bedspacio-header-image" className='h-full w-full object-cover absolute inset-0 opacity-25'/>

                <div className="absolute flex flex-col items-center justify-center xl:justify-center lg:justify-center md:justify-center w-full h-auto xl:gap-[5rem] lg:gap-[5rem] gap-[5rem] p-[1rem] border-box xl:p-0 lg:p-[1rem] md:p-[2rem]">
                    <div className="flex flex-col items-center justify-center gap-[1rem] xl:gap-[2rem] lg:gap-[2rem] md:gap-[1rem] xl:w-[800px] lg:w-[800px] md:w-[800px]">
                        <span className="text-[#FAFAFA] text-[55px] xl:text-[84px] lg:text-[84px] md:text-[72px] font-[900] leading-[1] text-center">Where Every Bed Feels Like Home</span>

                        <span className="flex justify-center text-[#1D242B] text-[20px] md:text-[24px] text-center font-bold w-full">Made for students, workers, and everyday city living.</span>
                    </div>

                    {/* <div className='flex flex-col items-center justify-center gap-2 bg-[#1D242B]/50 rounded-[10px]  h-full p-4'>
                        <span className='text-[#FAFAFA] text-[18px]'>Tell us your preferrence</span>

                        <SearchFilter/>
                    </div> */}

                    <SearchFilter />

                </div>
            </section>

            <section className='flex w-full p-[1rem] py-[4rem] xl:h-[800px] lg:h-[800px] md:h-[800px] bg-[#FAFAFA] items-center justify-center'>
                <div className="w-full max-w-5xl mx-auto rounded-[10px] overflow-hidden">
                    <div className="aspect-video">
                        <iframe
                        className="w-full h-full"
                        src="https://www.youtube.com/embed/tTx9-kGmGUI"
                        title="Male Capsule Room for rent!"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                        />
                    </div>
                </div>
            </section>  


            <section className='flex flex-col w-full min-h-[800px] bg-[#FAFAFA] items-center justify-start px-[1rem] xl:px-[8rem] lg:px-[4rem] md:px-[1rem] py-[3rem] gap-[3rem]'>
                <div className='flex flex-col items-center justify-center gap-[2rem] w-full'>
                    <span className='text-[42px] font-[900] text-[#1D242B] leading-[0.5]'>Our Branches</span>
                    <BranchCard />
                </div>

                <div className='flex flex-col items-center justify-center gap-[2rem] w-full'>
                    <span className='text-[42px] font-[900] text-[#1D242B] leading-[1] text-center'>Explore Room Types</span>
                    <RoomType />
                </div>
            </section>


            <section className='flex xl:grid lg:grid xl:grid-cols-2 lg:grid-cols-2 md:grid md:grid-cols-2 w-full xl:min-h-[800px] lg:min-h-[800px] bg-[#FAFAFA] xl:px-[8rem] lg:px-[6rem] py-[3rem] xl:py-[6rem] lg:py-[6rem] md:py-[3rem]  gap-[1rem]'>
                <div className='hidden xl:grid lg:grid md:grid sm:hidden xl:grid-rows-2 lg:grid-rows-2 md:grid-rows-2 w-full gap-2'>
                    <div className='flex items-center justify-center h-[325px] md:min-h-[325px] lg:min-h-[325px] sm:min-h-[325px] bg-[#C7EEFF] rounded-[15px] overflow-hidden'>
                        <img src="/asset/why_choose_us_1.jpg" alt="" className='w-full h-full object-cover'/>
                    </div>

                    <div className='grid grid-cols-2 w-full gap-2'>
                        <div className='flex items-center justify-center h-[325px] w-full bg-[#C7EEFF] rounded-[15px] overflow-hidden'>
                            <img src="/asset/why_choose_us_2.jpg" alt="" className='w-full h-full object-cover'/>
                        </div>
                        <div className='flex items-center justify-center h-[325px] w-full bg-[#C7EEFF] rounded-[15px] overflow-hidden'>
                            <img src="/asset/why_choose_us_3.jpg" alt="" className='w-full h-full object-cover'/>
                        </div>
                    </div>
                </div>

                <div className='flex flex-col w-full items-start justify-center xl:justify-end lg:justify-end md:justify-center px-[1rem] xl:px-[8rem] lg:px-[4rem] md:px-[1rem] gap-[1rem] xl:gap-[4rem] lg:gap-[1rem] md:gap-[1rem] sm:gap-[1rem]'>
                    <div className='flex flex-col gap-2'>
                        <span className='text-[36px] xl:text-[48px] lg:text-[42px] md:text-[38px] text-[#1D242B] font-[900] text-center xl:text-left lg:text-left md:text-left whitespace-nowrap'>WHY CHOOSE US</span>

                        <span className='text-[20px] text-[#0077C0] leading-[1.2] font-bold text-center xl:text-left lg:text-left md:text-left'>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.
                        </span>
                    </div>

                    <div className='flex flex-col items-center justify-center gap-[2rem] w-auto'>
                        <div className='flex items-center gap-[1rem] xl:gap-[2rem] lg:gap-[1rem] md:gap-[1rem]'>
                            <div className="flex items-center justify-center min-w-[70px] min-h-[70px] xl:min-w-[90px] xl:min-h-[90px] lg:min-w-[90px] lg:min-h-[90px] rounded-full bg-[#0077C0]">
                                {/* Add an Icon here */}
                            </div>
                            <div className='flex flex-col min-w-0 break-words'>
                                <span className='text-[36px] text-[#1D242B] font-[900]'>Bullet</span>
                                <span className='text-[18px] text-[#0077C0] leading-snug'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</span>
                            </div>
                        </div>

                        <div className='flex items-center gap-[1rem] xl:gap-[2rem] lg:gap-[1rem] md:gap-[1rem] w-auto'>
                            <div className="flex items-center justify-center min-w-[70px] min-h-[70px] xl:min-w-[90px] xl:min-h-[90px] lg:min-w-[90px] lg:min-h-[90px] rounded-full bg-[#0077C0]">
                                {/* Add an Icon here */}
                            </div>
                            <div className='flex flex-col min-w-0 break-words'>
                                <span className='text-[36px] text-[#1D242B] font-[900]'>Bullet</span>
                                <span className='text-[18px] text-[#0077C0] leading-snug'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</span>
                            </div>
                        </div>

                        <div className='flex items-center gap-[1rem] xl:gap-[2rem] lg:gap-[1rem] md:gap-[1rem] w-auto'>
                            <div className="flex items-center justify-center min-w-[70px] min-h-[70px] xl:min-w-[90px] xl:min-h-[90px] lg:min-w-[90px] lg:min-h-[90px] rounded-full bg-[#0077C0]">
                                {/* Add an Icon here */}
                            </div>
                            <div className='flex flex-col min-w-0 break-words'>
                                <span className='text-[36px] text-[#1D242B] font-[900]'>Bullet</span>
                                <span className='text-[18px] text-[#0077C0] leading-snug'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <section className="flex flex-col xl:items-center lg:items-center md:items-center w-full bg-[#C7EEFF] py-12 md:py-16 p-3">
                <div className="flex flex-col xl:items-center lg:items-center md:items-start md:overflow-x-auto  w-full px-[0.5rem] xl:px-[8rem] lg:px-[4rem] md:px-[1rem] py-4 gap-[2rem]">
                    <span className="flex text-center text-[32px] md:text-[46px] font-[900] text-[#0077C0] leading-[1]">
                        What Our Customers Say
                    </span>

                        {/* Mobile: horizontal scroll | Desktop: grid */}
                    <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory rounded-[10px] lg:grid lg:grid-cols-4 lg:overflow-visible">
                        {/* Card */}
                        <div className="snap-start shrink-0 w-[85%] sm:w-[420px] lg:w-auto flex flex-col items-center justify-between min-h-[320px] bg-[#FAFAFA] p-5 rounded-[10px] gap-4">
                            <div className="flex w-full items-center justify-between">
                                <Quote className="w-[28px] h-auto" />
                                <Quote className="w-[28px] h-auto -rotate-180" />
                            </div>

                            <p className="w-full px-2 leading-relaxed text-center text-[#1D242B] text-base italic">
                            One of the best accomodation I have been. Very clean space and friendly staffs. Place is also safe, near Baranggay Hall, wet market and just 5 mins away from BGC. Place is very convenient to live in specially if working near BGC.
                            </p>

                            <div className="flex flex-col items-center justify-center gap-2 w-full">
                                <span className="font-bold text-[#1D242B] text-lg">Ayen D.</span>
                                <div className="flex items-center justify-center gap-1">
                                    <Star className="w-[18px] h-auto" />
                                    <Star className="w-[18px] h-auto" />
                                    <Star className="w-[18px] h-auto" />
                                    <Star className="w-[18px] h-auto" />
                                    <Star className="w-[18px] h-auto" />
                                </div>
                            </div>
                        </div>

                        {/* Duplicate the same card structure for other reviews */}
                        <div className="snap-start shrink-0 w-[85%] sm:w-[420px] lg:w-auto flex flex-col items-center justify-between min-h-[320px] bg-[#FAFAFA] p-5 rounded-[10px] gap-4">
                            <div className="flex w-full items-center justify-between">
                                <Quote className="w-[28px] h-auto" />
                                <Quote className="w-[28px] h-auto -rotate-180" />
                            </div>
                            <p className="w-full px-2 leading-relaxed text-center text-[#1D242B] text-base italic">
                            Very worth it and not expensive 5 minutes walk in to market market and SM Aura especially to BGC ..every week to clean the house and all tenant is very friendly ..but one of my favorite to this bedspacio is free water and wifi...
                            </p>
                            <div className="flex flex-col items-center justify-center gap-2 w-full">
                                <span className="font-bold text-[#1D242B] text-lg">Ernesto P.</span>
                                <div className="flex items-center justify-center gap-1">
                                    <Star className="w-[18px] h-auto" />
                                    <Star className="w-[18px] h-auto" />
                                    <Star className="w-[18px] h-auto" />
                                    <Star className="w-[18px] h-auto" />
                                    <Star className="w-[18px] h-auto" />
                                </div>
                            </div>
                        </div>

                        <div className="snap-start shrink-0 w-[85%] sm:w-[420px] lg:w-auto flex flex-col items-center justify-between min-h-[320px] bg-[#FAFAFA] p-5 rounded-[10px] gap-4">
                            <div className="flex w-full items-center justify-between">
                                <Quote className="w-[28px] h-auto" />
                                <Quote className="w-[28px] h-auto -rotate-180" />
                            </div>
                            <p className="w-full px-2 leading-relaxed text-center text-[#1D242B] text-base italic">
                            The staffs are very accommodating and able to answer all of your questions or queries. The place is also near to bgc and malls which is convenient.
                            </p>
                            <div className="flex flex-col items-center justify-center gap-2 w-full">
                                <span className="font-bold text-[#1D242B] text-lg">Ray A.</span>
                                <div className="flex items-center justify-center gap-1">
                                    <Star className="w-[18px] h-auto" />
                                    <Star className="w-[18px] h-auto" />
                                    <Star className="w-[18px] h-auto" />
                                    <Star className="w-[18px] h-auto" />
                                    <Star className="w-[18px] h-auto" />
                                </div>
                            </div>
                        </div>

                        <div className="snap-start shrink-0 w-[85%] sm:w-[420px] lg:w-auto flex flex-col items-center justify-between min-h-[320px] bg-[#FAFAFA] p-5 rounded-[10px] gap-4">
                            <div className="flex w-full items-center justify-between">
                                <Quote className="w-[28px] h-auto" />
                                <Quote className="w-[28px] h-auto -rotate-180" />
                            </div>
                            <p className="w-full px-2 leading-relaxed text-center text-[#1D242B] italic">
                            Very helpful and accomodating staffs. The price is reasonable and affordable. Perfect place for young professionals around metro
                            </p>
                            <div className="flex flex-col items-center justify-center gap-2 w-full">
                                <span className="font-bold text-[#1D242B] text-lg">Eubert G.</span>
                                <div className="flex items-center justify-center gap-1">
                                    <Star className="w-[18px] h-auto" />
                                    <Star className="w-[18px] h-auto" />
                                    <Star className="w-[18px] h-auto" />
                                    <Star className="w-[18px] h-auto" />
                                    <Star className="w-[18px] h-auto" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <FrequentlyAskedQuestions />
            <HomeInquiry /> 
        </div>
    )
}