"use client"

// hooks
import { useState } from "react"

// components
import HomeContent from "./(content_category)/HomeContent";
import RentalsContent from "./(content_category)/RentalsContent";
import AboutUsContent from "./(content_category)/AboutUsContent";
import HowItWorksContent from "./(content_category)/HowItWorksContent";



export default function ContentPageWrapper () {

    const [homeOpen, setHomeOpen] = useState<boolean>(false);
    const [rentalsOpen, setRentalsOpen] = useState<boolean>(false);
    const [aboutUsOpen, setAboutUsOpen] = useState<boolean>(false);
    const [howItWorksOpen, setHowItWorksOpen] = useState<boolean>(false);

    return (
        <div className="flex w-full h-auto">
            <div className="relative flex flex-col w-full h-full px-[1rem] xl:px-[8rem] lg:px-[1rem] py-[1rem]">

                <div className="flex flex-col w-full h-auto bg-[#FFF]">
                    <span className="text-[28px] text-[#1D242B] font-bold">Content</span>

                    <div className="flex flex-wrap items-center justify-center gap-1 w-full  border-b border-[#1D242B]/25">
                        <button onClick={() => {
                            setHomeOpen(true);
                            setRentalsOpen(false);
                            setAboutUsOpen(false);
                            setHowItWorksOpen(false);
                        }}
                        className={`flex px-[1rem] pb-3 cursor-pointer border-b-2 hover:border-[#1D242B]/80 active:border-[#FAFAFA] transition-all duration-100 ${homeOpen ? 'border-[#1D242B]' : 'border-[#FAFAFA]'}`}>
                            <span className="font-bold text-[18px] text-[#1D242B]">Home</span>
                        </button>
                        <button onClick={() => {
                            setRentalsOpen(true);
                            setHomeOpen(false);
                            setAboutUsOpen(false);
                            setHowItWorksOpen(false);
                        }}
                        className={`flex px-[1rem] pb-3 cursor-pointer border-b-2 hover:border-[#1D242B]/80 active:border-[#FAFAFA] transition-all duration-100 ${rentalsOpen ? 'border-[#1D242B]' : 'border-[#FAFAFA]'}`}>
                            <span className="font-bold text-[18px] text-[#1D242B]">Rentals</span>
                        </button>
                        <button onClick={() => {
                            setAboutUsOpen(true);
                            setRentalsOpen(false);
                            setHomeOpen(false);
                            setHowItWorksOpen(false);
                        }}
                        className={`flex px-[1rem] pb-3 cursor-pointer border-b-2 hover:border-[#1D242B]/80 active:border-[#FAFAFA] transition-all duration-100 ${aboutUsOpen ? 'border-[#1D242B]' : 'border-[#FAFAFA]'}`}>
                            <span className="font-bold text-[18px] text-[#1D242B]">About Us</span>
                        </button>
                        <button onClick={() => {
                            setHowItWorksOpen(true);
                            setAboutUsOpen(false);
                            setRentalsOpen(false);
                            setHomeOpen(false);
                        }}
                        className={`flex px-[1rem] pb-3 cursor-pointer border-b-2 hover:border-[#1D242B]/80 active:border-[#FAFAFA] transition-all duration-100 ${howItWorksOpen ? 'border-[#1D242B]' : 'border-[#FAFAFA]'}`}>
                            <span className="font-bold text-[18px] text-[#1D242B]">How it Works</span>
                        </button>
                    </div>
                </div>



                {/* Show the blocks of window here depending on which tab is selected */}
                { rentalsOpen ? (
                    <RentalsContent />
                ): aboutUsOpen ? (
                    <AboutUsContent />
                ): howItWorksOpen ? (
                    <HowItWorksContent />
                ): <HomeContent />
                }

            </div>
        </div>
    )
} 