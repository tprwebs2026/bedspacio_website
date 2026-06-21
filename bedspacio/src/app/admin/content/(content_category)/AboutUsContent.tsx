// TODO
/*
    Contents that needs to be dynamically changed

    1. Hero banner
    2. Image for Who are we section
    3. Image for History section
    3. Image for Step 3
    4. Image for Step 4
*/

"use client"

// hooks
import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/config/config";

// icon
import Upload from '@/asset/icon/upload.svg'

// type imports
import { BannerType } from "../ContentPageWrapper";

interface AboutUssContenProp {
    setSuccessMessage: React.Dispatch<React.SetStateAction<string>>;
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
    aboutUsPageBanner: BannerType
    whoWeAreImage: BannerType;
    historyImage: BannerType
}

export default function AboutUsContent ({
    setSuccessMessage,
    setErrorMessage,
    aboutUsPageBanner,
    whoWeAreImage,
    historyImage
} : AboutUssContenProp) {

    const [bannerPreview, setBannerPreview] = useState<string | undefined>(undefined);
    const [bannerBlob, setBannerBlob] = useState<File | null>(null);
    const [updatedBanner, setUpdatedBanner] = useState<string>(aboutUsPageBanner?.asset_url);

    const [whoWeAreImagePreview, setWhoWeAreImagePreview] = useState<string|undefined>(undefined);
    const [whoWeAreImageBlob, setWhoWeAreImageBlob] = useState<File|null>(null);
    const [updatedWhoWeAreImage, setUpdatedWhoWeAreImage] = useState<string>(whoWeAreImage?.asset_url);

    const [historyImagePreview, setHistoryImagePreview] = useState<string|undefined>(undefined);
    const [historyImageBlob, setHistoryImageblob] = useState<File|null>(null);
    const [updatedHistoryImage, setUpdatedHistoryImage] = useState<string>(historyImage?.asset_url); 

    const [loading, setLoading] = useState<boolean>(false);


    // --------------------- FUNCTIONS --------------------- //

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            if (bannerPreview) {
                URL.revokeObjectURL(bannerPreview);
            }

            setBannerBlob(file);
            setBannerPreview(URL.createObjectURL(file));
        }
    }

    const handleSubmitBanner = async () => {
        if (!bannerBlob) {
            setErrorMessage('Please select an image.');
            setTimeout(() => setErrorMessage(''), 3500);
            return;
        }
        setLoading(true);

        try {
            await new Promise<void>((resolve) => {
                setTimeout(() => {
                    setLoading(true);
                    resolve();
                }, 1500);
            });

            const bannerForm = new FormData();
            bannerForm.append('about_us_hero_banner', bannerBlob);

            const aboutUsBannerImage = await axios.put(
                `${BASE_URL}/content/v1/about-us-banner`,
                bannerForm,
                { withCredentials: true }
            )

            console.log('[ABOUT US HERO BANNER] result: ', aboutUsBannerImage);
            setUpdatedBanner(aboutUsBannerImage.data.banner.asset_url);
            setBannerPreview(undefined);

            setSuccessMessage('About Us page banner updated successfully!');
            setTimeout(() => setSuccessMessage(''), 3500);
        } catch (err) {
            // error handling error later 
        } finally {
            setLoading(false)
        }
    }

    const aboutUsBannerSrc = bannerPreview ?? updatedBanner;

    // ------------------ WHO WE ARE IMAGE ------------------ //
    const handleWhoWeAreImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            if (whoWeAreImagePreview) {
                URL.revokeObjectURL(whoWeAreImagePreview)
            }
            setWhoWeAreImageBlob(file);
            setWhoWeAreImagePreview(URL.createObjectURL(file));
        }
    }

    const handleSubmitWhoWeAreImage = async () => {
        if (!whoWeAreImageBlob) {
            setErrorMessage('Please select an image.');
            setTimeout(() => setErrorMessage(''), 3500);
            return;
        }
        setLoading(true);

        try {
            const imageForm = new FormData();
            imageForm.append('who_we_are_image', whoWeAreImageBlob);

            const whoWeAreImage = await axios.put(
                `${BASE_URL}/content/v1/about-us/who-we-are`,
                imageForm,
                { withCredentials: true }
            )

            setUpdatedWhoWeAreImage(whoWeAreImage.data.image.asset_url);
            setWhoWeAreImagePreview(undefined);

            setSuccessMessage('About Us page banner updated successfully!');
            setTimeout(() => setSuccessMessage(''), 3500);

        } catch (err) {
            console.log('Failed to upload who we are image: ', err);
        } finally {
            setLoading(false);
        }
    }


    const whoWeAreImageSrc = whoWeAreImagePreview ?? updatedWhoWeAreImage;

    // ------------------ HISTORY IMAGE ------------------ //

    const handleHistoryImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if(historyImagePreview) {
                URL.revokeObjectURL(historyImagePreview)
            };
            setHistoryImageblob(file);
            setHistoryImagePreview(URL.createObjectURL(file));
        }
    }

    const handleSubmitHistoryImage = async () => {
        if (!historyImageBlob) {
            setErrorMessage('Please select an image.');
            setTimeout(() => setErrorMessage(''), 3500);
            return;
        }
        setLoading(true);
        try {
            const imageForm = new FormData();
            imageForm.append('history_image', historyImageBlob);

            const historyImage = await axios.put(
                `${BASE_URL}/content/v1/about-us/history`,
                imageForm,
                { withCredentials: true }
            )

            setUpdatedHistoryImage(historyImage.data.image.asset_url);
            setHistoryImagePreview(undefined);

            setSuccessMessage('About Us page banner updated successfully!');
            setTimeout(() => setSuccessMessage(''), 3500);
        } catch (err) {
            console.error('Failed to upload history image: ', err);
        } finally {
            setLoading(false);
        }
    }

    const historyImageSrc = historyImagePreview ?? updatedHistoryImage;


    // --------------------- BREAK --------------------- //


    return (
        <div className="flex flex-col w-full h-full items-center justify-start p-[2rem]">
            <div className="flex flex-col items-center gap-[2rem] w-full">
                <div className="flex flex-col items-center gap-2 w-full">
                    <span className="font-bold">Banner</span>

                    <div className="relative flex w-full items-center justify-center h-[300px] bg-[#1D242B]/25 rounded-[10px] overflow-hidden">
                        <div className="absolute inset-0 bg-black/50"/>

                        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-2xl text-[#FAFAFA] text-center">About Us Banner</span>

                        <div className="absolute bottom-3 right-3 flex items-center justify-center gap-1">
                            {bannerPreview ? (
                                <>
                                    <button onClick={handleSubmitBanner} className="px-3 py-1 rounded-full bg-[#FAFAFA] text-[#0077C0] text-[14px] font-bold cursor-pointer hover:bg-[#C7EEFF] active:bg-[#FAFAFA]">
                                        <span className="text-[#0077C0] text-[14px] font-bold">{loading ? 'Saving new image...' : 'Save new image'}</span>
                                    </button>

                                    <button onClick={() => setBannerPreview(undefined)} className="px-3 py-1 rounded-full bg-[#FAFAFA] text-[#0077C0] text-[14px] font-bold cursor-pointer hover:bg-[#C7EEFF] active:bg-[#FAFAFA]">
                                        <span className="text-[#1D242B] text-[14px] font-bold">Cancel</span>
                                    </button>
                                </>
                            ) : (
                                <label htmlFor="banner_image" className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAFAFA] cursor-pointer hover:bg-[#C7EEFF] active:bg-[#FAFAFA]">
                                    <Upload className="w-[15px] h-[15px] fill-[#0077C0] stroke-2" />
                                    <span className="text-[#0077C0] text-[14px] font-bold">Replace</span>
                                    <input type="file" id="banner_image" accept=".jpg,.jpeg,.png,image/jpeg,image/png" hidden onChange={handleImageChange}/>
                                </label>
                            )}

                        </div>

                        <img src={aboutUsBannerSrc} alt="hero_banner_image" className="w-full h-full object-cover" />
                    </div>
                </div>


                <div className="flex flex-col place-items-center justify-items-center gap-[2rem] w-full">
                    <div className="flex flex-col items-center gap-2 w-[600px]">
                        <span className="font-bold">Who We are</span>

                        <div className="relative flex w-full items-center justify-center h-[300px] bg-[#1D242B]/25 rounded-[10px] overflow-hidden">

                            <div className="absolute inset-0 bg-black/50"/>

                            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-2xl text-[#FAFAFA] text-center">Who We Are Image</span>

                            <div className="absolute bottom-3 right-3 flex items-center justify-center gap-1">
                                {whoWeAreImagePreview ? (
                                    <>
                                        <button onClick={handleSubmitWhoWeAreImage} className="px-3 py-1 rounded-full bg-[#FAFAFA] text-[#0077C0] text-[14px] font-bold cursor-pointer hover:bg-[#C7EEFF] active:bg-[#FAFAFA]">
                                            <span className="text-[#0077C0] text-[14px] font-bold">{loading ? 'Saving new image...' : 'Save new image'}</span>
                                        </button>

                                        <button onClick={() => setWhoWeAreImagePreview(undefined)} className="px-3 py-1 rounded-full bg-[#FAFAFA] text-[#0077C0] text-[14px] font-bold cursor-pointer hover:bg-[#C7EEFF] active:bg-[#FAFAFA]">
                                            <span className="text-[#1D242B] text-[14px] font-bold">Cancel</span>
                                        </button>
                                    </>
                                ) : (
                                    <label htmlFor="who_we_are_image" className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAFAFA] cursor-pointer hover:bg-[#C7EEFF] active:bg-[#FAFAFA]"> 
                                        <Upload className="w-[15px] h-[15px] fill-[#0077C0] stroke-2" /> 
                                        <span className="text-[#0077C0] text-[14px] font-bold">Replace</span> 
                                        <input type="file" id="who_we_are_image" accept=".jpg,.jpeg,.png,image/jpeg,image/png" hidden onChange={handleWhoWeAreImageChange}/>
                                    </label>
                                )}
                            </div>

                            <img src={whoWeAreImageSrc} alt="who_we_are_image" className="w-full h-full object-cover"/>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-2 w-full">
                        <span className="font-bold">History</span>

                        <div className="relative flex w-full items-center justify-center h-[300px] bg-[#1D242B]/25 rounded-[10px] overflow-hidden">

                            <div className="absolute inset-0 bg-black/50"/>

                            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-2xl text-[#FAFAFA] text-center">History Image</span>

                            <div className="absolute bottom-3 right-3 flex items-center justify-center gap-1">
                                {historyImagePreview ? (
                                    <>
                                        <button onClick={handleSubmitHistoryImage} className="px-3 py-1 rounded-full bg-[#FAFAFA] text-[#0077C0] text-[14px] font-bold cursor-pointer hover:bg-[#C7EEFF] active:bg-[#FAFAFA]">
                                            <span className="text-[#0077C0] text-[14px] font-bold">{loading ? 'Saving new image...' : 'Save new image'}</span>
                                        </button>

                                        <button onClick={() => setHistoryImagePreview(undefined)} className="px-3 py-1 rounded-full bg-[#FAFAFA] text-[#0077C0] text-[14px] font-bold cursor-pointer hover:bg-[#C7EEFF] active:bg-[#FAFAFA]">
                                            <span className="text-[#1D242B] text-[14px] font-bold">Cancel</span>
                                        </button>
                                    </>
                                ) : (
                                    <label htmlFor="history_image" className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAFAFA] cursor-pointer hover:bg-[#C7EEFF] active:bg-[#FAFAFA]">
                                        <Upload className="w-[15px] h-[15px] fill-[#0077C0] stroke-2" />
                                        <span className="text-[#0077C0] text-[14px] font-bold">Replace</span>
                                        <input type="file" id="history_image" accept=".jpg,.jpeg,.png,image/jpeg,image/png" hidden onChange={handleHistoryImageChange}/>
                                    </label>
                                )}
                            </div>

                            <img src={historyImageSrc} alt="history_image" className="w-full h-full object-cover"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}