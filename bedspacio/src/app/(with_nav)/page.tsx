import { Metadata } from 'next'

import SearchFilter from '@/components/SearchFilter'
import FrequentlyAskedQuestions from '@/components/FrequentlyAskedQuestion'
import HomeInquiry from '@/app/(with_nav)/(home-inquiry)/HomeInquiry'

import Bed from '@/asset/icon/bed.svg'
import Heart from '@/asset/icon/heart.svg'
import Community from '@/asset/icon/community.svg'

import Reviews from '@/components/Reviews'
import ReviewsMobile from '@/components/reviewsMobile'
import BranchRoomCard from '@/components/Branch&RoomCard'
import HomeInquiryRedirect from './(home-inquiry)/HomeInquiryRedirect'
import VideoDemo from '@/components/VideoDemo'
import { getHomePageBanner } from '../../../lib/content'
import { BASE_URL } from '@/config/config'

export const metadata: Metadata = {
    title: 'Home | BedSpacio',
    description: 'asdasdas'
}

export default async function Home() {

    const heroImage = await getHomePageBanner();
    
    return (
        <div className="flex flex-col min-h-screen items-start justify-start ">
            
            <section className="relative flex flex-col w-full min-h-[800px] xl:h-screen items-center justify-center bg-[#0077C0] xl:items-start xl:justify-center lg:items-start lg:justify-center lg:h-[800px]">
                <img src={`${BASE_URL}/file/content/home/${heroImage.asset_url}`} alt="bedspacio-header-image" className='h-full w-full object-cover absolute inset-0 opacity-10'/>

                <div className="absolute flex flex-col items-center justify-center xl:justify-center lg:justify-center md:justify-center w-full h-auto xl:gap-[5rem] lg:gap-[5rem] gap-[5rem] p-[1rem] border-box xl:p-0 lg:p-[1rem] md:p-[2rem]">
                    <div className="flex flex-col items-center justify-center gap-[1rem] xl:gap-[2rem] lg:gap-[2rem] md:gap-[1rem] xl:w-[800px] lg:w-[800px] md:w-[800px]">
                        <span className='text-[32px] text-[#1D242B] leading-[0] font-bold'>BedSpacio</span>
                        <span className="text-[#FAFAFA] text-[55px] xl:text-[84px] lg:text-[84px] md:text-[72px] font-[900] leading-[1] text-center">Where Every Bed Feels Like Home</span>

                        <span className="flex justify-center text-[#1D242B] text-[20px] md:text-[24px] text-center font-bold w-full">Made for students, workers, and everyday city living.</span>
                    </div>

                    <div className='flex items-center justify-center bg-[#1D242B]/25 rounded-[5px] border border-[#FAFAFA]'>
                        <SearchFilter />
                    </div>

                </div>
            </section>


            {/* TO CHANGE: Make the youtube link dynamically change to support future updates  */}
            {/* <section  className={`flex w-full p-[1rem] py-[4rem] xl:h-[800px] lg:h-[800px] md:h-[800px] bg-[#FAFAFA] items-center justify-center `}>
                <div className="w-full max-w-5xl mx-auto rounded-[10px] overflow-hidden">
                    <div className="aspect-video">
                        <iframe
                        className="w-full h-full"
                        src="https://www.youtube.com/embed/tTx9-kGmGUI"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                        />
                    </div>
                </div>
            </section>   */}

            <VideoDemo />


            <BranchRoomCard />


            <section className='flex xl:grid lg:grid xl:grid-cols-2 lg:grid-cols-2 md:grid md:grid-cols-2 w-full xl:min-h-[800px] lg:min-h-[800px] bg-[#FAFAFA] xl:px-[8rem] lg:px-[6rem] py-[3rem] xl:py-[6rem] lg:py-[6rem] md:py-[3rem]  gap-[1rem]'>
                <div className='hidden xl:flex lg:flex md:flex flex-col w-full h-auto gap-2'>
                    <div className='flex items-center justify-center h-[325px] md:min-h-[325px] lg:min-h-[325px] sm:min-h-[325px] bg-[#C7EEFF] rounded-[15px] overflow-hidden'>
                        <img src="/image/why_choose_us/image_1.jpg" alt="" className='w-full h-full object-cover'/>
                    </div>

                    <div className='grid grid-cols-2 w-full gap-2'>
                        <div className='flex items-center justify-center h-[325px] w-full bg-[#C7EEFF] rounded-[15px] overflow-hidden'>
                            <img src="/image/why_choose_us/image_2.jpg" alt="" className='w-full h-full object-cover'/>
                        </div>
                        <div className='flex items-center justify-center h-[325px] w-full bg-[#C7EEFF] rounded-[15px] overflow-hidden'>
                            <img src="/image/why_choose_us/image_4.jpg" alt="" className='w-full h-full object-cover'/>
                        </div>
                    </div>
                </div>

                <div className='flex flex-col w-full items-start justify-center xl:justify-end lg:justify-end md:justify-center px-[1rem] xl:px-[4rem] lg:px-[2rem] md:px-[1rem] gap-[1rem] xl:gap-[2rem] lg:gap-[1rem] md:gap-[1rem] sm:gap-0'>
                    <div className='flex flex-col gap-2'>
                        <span className='text-[20px] text-[#0077C0] font-[900] text-center xl:text-left lg:text-left md:text-left'>Why Choose Us</span>
                        <span className='text-[36px] xl:text-[48px] lg:text-[42px] md:text-[38px] text-[#1D242B] font-[900] text-center xl:text-left lg:text-left md:text-left leading-[1]'>You don't just find a space, you find a place that feels like home</span>

                        <span className='text-[18px] text-[#0077C0] leading-[1.2] text-center xl:text-left lg:text-left md:text-left'>
                            You're not just choosing a place to stay, you're choosing where your story begins. Because the right space doesn't just shelter you, it welcomes you.
                        </span>
                    </div>

                    <div className='flex flex-col items-center justify-center gap-[2rem] w-auto'>
                        <div className='flex items-center gap-[1rem] xl:gap-[2rem] lg:gap-[1rem] md:gap-[1rem]'>
                            <div className="flex items-center justify-center min-w-[70px] min-h-[70px] xl:min-w-[90px] xl:min-h-[90px] lg:min-w-[90px] lg:min-h-[90px] rounded-full bg-[#0077C0]">
                                {/* Add an Icon here */}
                                <Bed className="w-[35px] h-[35px]" />
                            </div>
                            <div className='flex flex-col min-w-0 break-words'>
                                <span className='text-[30px] text-[#1D242B] font-[900]'>Comfort you can feel</span>
                                <span className='text-[16px] text-[#1D242B] leading-snug'>Thoughtfully designed spaces that make every day feel warm and welcoming.</span>
                            </div>
                        </div>

                        <div className='flex items-center gap-[1rem] xl:gap-[2rem] lg:gap-[1rem] md:gap-[1rem] w-auto'>
                            <div className="flex items-center justify-center min-w-[70px] min-h-[70px] xl:min-w-[90px] xl:min-h-[90px] lg:min-w-[90px] lg:min-h-[90px] rounded-full bg-[#0077C0]">
                                {/* Add an Icon here */}
                                <Heart className="w-[35px] h-[35px]" />
                            </div>
                            <div className='flex flex-col min-w-0 break-words'>
                                <span className='text-[30px] text-[#1D242B] font-[900]'>Convenience That Fits Your Life</span>
                                <span className='text-[16px] text-[#1D242B] leading-snug'>Prime locations and essentials that keep everything you need within reach.</span>
                            </div>
                        </div>

                        <div className='flex items-center gap-[1rem] xl:gap-[2rem] lg:gap-[1rem] md:gap-[1rem] w-auto'>
                            <div className="flex items-center justify-center min-w-[70px] min-h-[70px] xl:min-w-[90px] xl:min-h-[90px] lg:min-w-[90px] lg:min-h-[90px] rounded-full bg-[#0077C0]">
                                {/* Add an Icon here */}
                                <Community className="w-[35px] h-[35px]" />
                            </div>
                            <div className='flex flex-col min-w-0 break-words'>
                                <span className='text-[30px] text-[#1D242B] font-[900]'>Community That Connects</span>
                                <span className='text-[16px] text-[#1D242B] leading-snug'>A place where you're not just staying, you are part of something meaningful.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className='hidden xl:flex lg:flex md:flex sm:hidden w-full overflow-hidden rounded-[10px]'>
                <Reviews />
            </div>

            <section className="flex flex-col xl:hidden lg:hidden md:hidden sm:flex w-full bg-[#C7EEFF] py-12 md:py-16 p-3">
                <ReviewsMobile />
            </section>



            <FrequentlyAskedQuestions />
            <HomeInquiryRedirect />
        </div>
    )
}