"use client"

// hooks
import { useState } from "react"

// components
import HomeContent from "./(content_category)/HomeContent";
import RentalsContent from "./(content_category)/RentalsContent";
import AboutUsContent from "./(content_category)/AboutUsContent";
import HowItWorksContent from "./(content_category)/HowItWorksContent";


// Toast
import SuccessToast from "@/components/admin/Toast/SuccessToast";
import ErrorToast from "@/components/admin/Toast/ErrorToast";
import ContactsContent from "./(content_category)/ContactsContent";



export type BannerType = {
    asset_key?: string,
    asset_name: string,
    asset_url: string,
    created_at: string,
    updated_at: string
}

export type WhyChooseUsAssetType = {
    asset_key: string;
    asset_url: string;
}

interface ContentPageWrapperProp {
    videoDemo: BannerType;
    homePageBanner: BannerType;
    bedspaceImage: BannerType;
    apartmentImage: BannerType;
    whyChooseUsImage: WhyChooseUsAssetType[];

    rentalsPageBanner: BannerType;
    aboutUsPageBanner: BannerType;

    howItWorksPageBanner: BannerType;
    whoWeAreImage: BannerType;
    historyImage: BannerType;
    contactImage: BannerType;

}

export default function ContentPageWrapper ({
    videoDemo,
    homePageBanner,
    bedspaceImage,
    apartmentImage,
    whyChooseUsImage,
    rentalsPageBanner,
    aboutUsPageBanner,
    howItWorksPageBanner,
    whoWeAreImage,
    historyImage,
    contactImage
}: ContentPageWrapperProp) {

    const [homeOpen, setHomeOpen] = useState<boolean>(true);
    const [rentalsOpen, setRentalsOpen] = useState<boolean>(false);
    const [aboutUsOpen, setAboutUsOpen] = useState<boolean>(false);
    const [howItWorksOpen, setHowItWorksOpen] = useState<boolean>(false);
    const [contactsOpen, setContactsOpen] = useState<boolean>(false);

    const [successMessage, setSuccessMessage] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    


    return ( 
        <div className="flex w-full overflow-y-hidden">
            <div className="relative grid grid-cols-[1fr_4fr] w-full px-[1rem] xl:px-[8rem] lg:px-[1rem] py-[1rem]">

                <div className="sticky top-22 flex flex-col w-full h-full bg-[#FFF] gap-[2rem]">
                    <span className="text-[28px] text-[#1D242B] font-bold">Content</span>

                    <div className="flex flex-col items-center justify-start gap-1 w-full">
                        <button onClick={() => {
                            setHomeOpen(true);
                            setRentalsOpen(false);
                            setAboutUsOpen(false);
                            setHowItWorksOpen(false);
                            setContactsOpen(false);
                        }}
                        className={`flex items-center w-full px-[1rem] py-2 cursor-pointer rounded-full border hover:bg-[#1D242B]/15 active:bg-[#FAFAFA] transition-all duration-100 ${homeOpen ? 'bg-[#1D242B]/15 border-[#1D242B]' : 'bg-[#FAFAFA] border-[#1D242B]/25'}`}>
                            <span className="font-bold text-[18px] text-[#1D242B]">Home</span>
                        </button>

                        <button onClick={() => {
                            setRentalsOpen(true);
                            setHomeOpen(false);
                            setAboutUsOpen(false);
                            setHowItWorksOpen(false);
                            setContactsOpen(false);
                        }}
                        className={`flex items-center w-full px-[1rem] py-2 cursor-pointer rounded-full border hover:bg-[#1D242B]/15 active:bg-[#FAFAFA] transition-all duration-100 ${rentalsOpen ? 'bg-[#1D242B]/15 border-[#1D242B]' : 'bg-[#FAFAFA] border-[#1D242B]/25'}`}>
                            <span className="font-bold text-[18px] text-[#1D242B]">Rentals</span>
                        </button>

                        <button onClick={() => {
                            setAboutUsOpen(true);
                            setRentalsOpen(false);
                            setHomeOpen(false);
                            setHowItWorksOpen(false);
                            setContactsOpen(false);
                        }}
                        className={`flex items-center w-full px-[1rem] py-2 cursor-pointer rounded-full border  hover:bg-[#1D242B]/15 active:bg-[#FAFAFA] transition-all duration-100 ${aboutUsOpen ? 'bg-[#1D242B]/15 border-[#1D242B]' : 'bg-[#FAFAFA] border-[#1D242B]/25'}`}>
                            <span className="font-bold text-[18px] text-[#1D242B]">About Us</span>
                        </button>

                        <button onClick={() => {
                            setHowItWorksOpen(true);
                            setAboutUsOpen(false);
                            setRentalsOpen(false);
                            setHomeOpen(false);
                            setContactsOpen(false);
                        }}
                        className={`flex items-center w-full px-[1rem] py-2 cursor-pointer rounded-full border hover:bg-[#1D242B]/15 active:bg-[#FAFAFA] transition-all duration-100 ${howItWorksOpen ? 'bg-[#1D242B]/15 border-[#1D242B]' : 'bg-[#FAFAFA] border-[#1D242B]/25'}`}>
                            <span className="font-bold text-[18px] text-[#1D242B]">How it Works</span>
                        </button>

                        <button onClick={() => {
                            setContactsOpen(true);
                            setHowItWorksOpen(false);
                            setAboutUsOpen(false);
                            setRentalsOpen(false);
                            setHomeOpen(false);
                        }}
                        className={`flex items-center w-full px-[1rem] py-2 cursor-pointer rounded-full border hover:bg-[#1D242B]/15 active:bg-[#FAFAFA] transition-all duration-100 ${contactsOpen ? 'bg-[#1D242B]/15 border-[#1D242B]' : 'bg-[#FAFAFA] border-[#1D242B]/25'}`}>
                            <span className="font-bold text-[18px] text-[#1D242B]">Contacts</span>
                        </button>
                    </div>
                </div>


                <div className="flex items-start justify-start h-[700px] overflow-y-auto thin-scrollbar">
                    {/* Show the blocks of window here depending on which tab is selected */}
                    {rentalsOpen ? (
                        <RentalsContent 
                            setSuccessMessage={setSuccessMessage}
                            setErrorMessage={setErrorMessage}
                            rentalsPageBanner={rentalsPageBanner}
                        />
                    ): aboutUsOpen ? (
                        <AboutUsContent 
                            setSuccessMessage={setSuccessMessage}
                            setErrorMessage={setErrorMessage}
                            aboutUsPageBanner={aboutUsPageBanner}
                            whoWeAreImage={whoWeAreImage}
                            historyImage={historyImage}
                        />
                    ): howItWorksOpen ? (
                        <HowItWorksContent 
                            setSuccessMessage={setSuccessMessage}
                            setErrorMessage={setErrorMessage}
                            howItWorksPageBanner={howItWorksPageBanner}
                        />
                    ): contactsOpen ? (
                        <ContactsContent 
                            setSuccessMessage={setSuccessMessage}
                            setErrorMessage={setErrorMessage}
                            contactImage={contactImage}
                        />
                    ): 
                        <HomeContent 
                            setSuccessMessage={setSuccessMessage}
                            setErrorMessage={setErrorMessage}
                            videoDemo={videoDemo}
                            homePageBanner={homePageBanner}
                            bedspaceImage={bedspaceImage}
                            apartmentImage={apartmentImage}
                            whyChooseUsImage={whyChooseUsImage}
                        />
                    }
                </div>

            </div>


            {successMessage && <SuccessToast message={successMessage} />}
            {errorMessage && <ErrorToast message={errorMessage} />}
        </div>
    )
} 