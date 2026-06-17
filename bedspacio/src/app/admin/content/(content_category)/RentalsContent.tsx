"use client"

// hooks
import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/config/config";

// icon
import Upload from '@/asset/icon/upload.svg'


// type imports
import { BannerType } from "../ContentPageWrapper";

interface RentalsContenProp {
    setSuccessMessage: React.Dispatch<React.SetStateAction<string>>;
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
    rentalsPageBanner: BannerType
}

export default function RentalsContent ({
    setSuccessMessage,
    setErrorMessage,
    rentalsPageBanner
} : RentalsContenProp) {

    const [bannerPreview, setBannerPreview] = useState<string | undefined>(undefined);
    const [bannerBlob, setBannerBlob] = useState<File | null>(null);
    const [updatedBanner, setUpdatedBanner] = useState<string>(rentalsPageBanner?.asset_url);

    const [loading, setLoading] = useState<boolean>(false);

    const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            if (bannerPreview) {
                URL.revokeObjectURL(bannerPreview)
            }

            setBannerBlob(file);
            setBannerPreview(URL.createObjectURL(file))
        };
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
            bannerForm.append('rental_hero_banner', bannerBlob);

            const rentalBannerImage = await axios.put(
                `${BASE_URL}/content/v1/rentals-banner`,
                bannerForm,
                { withCredentials: true }
            )

            console.log('[RENTAL HERO BANNER] result: ', rentalBannerImage);
            setUpdatedBanner(rentalBannerImage.data.banner.asset_url);
            setBannerPreview(undefined);

            setSuccessMessage('Rentals page banner updated successfully!');
            setTimeout(() => setSuccessMessage(''), 3500);
        } catch (err) {

        } finally {
            setLoading(false)
        }
    }

    const rentalBannerSrc =
        bannerPreview ??
        (updatedBanner
            ? `${BASE_URL}/file/content/rentals/${updatedBanner}`
            : undefined);

    return (
        <div className="flex flex-col w-full h-full items-center justify-start p-[2rem]">
            <div className="flex flex-col items-center gap-[2rem] w-full">
                <span className="font-bold">Banner Image</span>

                <div className="relative flex w-full items-center justify-center h-[300px] bg-[#1D242B]/25 rounded-[10px] overflow-hidden">
                    <div className="absolute inset-0 bg-black/50"/>

                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-2xl text-[#FAFAFA] text-center">Rentals Banner</span>

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
                                <input type="file" id="banner_image" hidden onChange={handleBannerChange}/>
                            </label>
                        )}
                    </div>

                    <img src={rentalBannerSrc} alt="hero_banner_image" className="w-full h-full object-cover"/>
                </div>
            </div>
        </div>
    )
}