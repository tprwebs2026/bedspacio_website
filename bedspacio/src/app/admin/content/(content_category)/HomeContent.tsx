// TODO
/*
    Contents that needs to be dynamically changed

    1. Hero banner
    2. Youtube Demo/Showcase video
    3. Room Types image for Bedspace & Apartment
    4. Why Choose Us
*/

"use client"

// hooks
import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/config/config";

// icons
import Upload from '@/asset/icon/upload.svg';

// functions
import { uploadYoutubeUrl } from "../../../../../lib/content";

// imported types
import { BannerType } from "../ContentPageWrapper";


interface HomeContentProps {
    setSuccessMessage: React.Dispatch<React.SetStateAction<string>>;
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
    videoDemo: BannerType;
    homePageBanner: BannerType
}



export default function HomeContent ({ 
    setSuccessMessage, 
    setErrorMessage, 
    videoDemo, 
    homePageBanner }: HomeContentProps) 
{

    const [heroBannerBlob, setHeroBannerBlob] = useState<File | null>(null)
    const [heroBannerPreview, setHeroBannerPreview] = useState<string | undefined>(undefined);
    const [updatedHeroBanner, setUpdatedHeroBanner] = useState<string>(homePageBanner?.asset_url)

    const [updatedVideoDemo, setUpdatedVideoDemo] = useState<BannerType>(videoDemo)

    const [youtubeTitle, setYoutubeTitle] = useState<string>('');
    const [youtubeUrl, setYoutubeUrl] = useState<string>('');
    const [currentYoutubeUrlOpen, setCurrentYoutubeOpen] = useState<boolean>(false);

    const [loading, setLoading] = useState<boolean>(false);


    // ------------------------------- FUNCTIONS ------------------------------- //


    const handleHomeBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            if (heroBannerPreview) {
                URL.revokeObjectURL(heroBannerPreview)
            }

            setHeroBannerBlob(file);
            setHeroBannerPreview(URL.createObjectURL(file))
        };
    }

    const handleSubmitHomeBanner = async () => {

        if (!heroBannerBlob) {
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
            bannerForm.append('hero_banner', heroBannerBlob);

            const bannerImage = await axios.put(
                `${BASE_URL}/content/v1/home-banner`, 
                bannerForm ,
                { withCredentials: true }
            );

            console.log('[HERO BANNER] result: ', bannerImage);
            setUpdatedHeroBanner(bannerImage.data.banner.asset_url);
            setHeroBannerPreview(undefined);

            setSuccessMessage('Home page banner updated successfully!');
            setTimeout(() => setSuccessMessage(''), 3500);


        } catch (err) {
            console.error('Failed to upload home banner: ', err);
        } finally {
            setLoading(false);
        }
    }


    const homeBannerSrc =
        heroBannerPreview ??
        (updatedHeroBanner
            ? `${BASE_URL}/file/content/home/${updatedHeroBanner}`
            : undefined);

    console.log('Image source for homeBannerSrc: ', updatedHeroBanner);

    const handleUploadYoutubeUrl = async (title: string, url: string) => {

        setLoading(true);

        try {
            if (!title || !url) {
                // add error message here to trigger errorToast
                return;
            }

            await new Promise<void>((resolve) => {
                setTimeout(() => {
                    setLoading(true);
                    resolve();
                }, 1500);
            });

            const response = await uploadYoutubeUrl(title, url);
            console.log('Before update:', updatedVideoDemo);

            setUpdatedVideoDemo({
                asset_name: response.data.asset_name,
                asset_url: response.data.asset_url,
                created_at: response.data.created_at,
                updated_at: response.data.updated_at
            });

            setYoutubeTitle('');
            setYoutubeUrl('');

            setSuccessMessage('Video Demo successfully updated!')
            setTimeout(() => setSuccessMessage(''), 3500);

            setCurrentYoutubeOpen(false)

        } catch (err) { 
            console.error('Failed to upload Youtube url: ', err);
        } finally {
            setLoading(false);
        }
    }






    // ------------------------------- BREAK ------------------------------- //

    return (
        <div className="flex flex-col w-full h-screen items-center py-[1rem] pb-[2rem]">
            <span className="text-center text-[16px] text-[#1D242B]/80 py-[1rem]">
                Instruction here
            </span>

            <div className="flex flex-col items-center gap-[2rem] w-[700px]">
                <div className="relative flex w-full items-center justify-center h-[400px] bg-[#1D242B]/25 rounded-[10px] overflow-hidden">
                    <div className="absolute inset-0 bg-black/50"/>
                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-2xl text-[#FAFAFA] text-center">Hero Banner</span>


                    <div className="absolute bottom-3 right-3 flex items-center justify-center gap-1">
                        {heroBannerPreview ? (
                            <>
                                <button onClick={handleSubmitHomeBanner} className="px-3 py-1 rounded-full bg-[#FAFAFA] text-[#0077C0] text-[14px] font-bold cursor-pointer hover:bg-[#C7EEFF] active:bg-[#FAFAFA]">
                                    <span className="text-[#0077C0] text-[14px] font-bold">{loading ? 'Saving new image...' : 'Save new image'}</span>
                                </button>

                                <button onClick={() => setHeroBannerPreview(undefined)} className="px-3 py-1 rounded-full bg-[#FAFAFA] text-[#0077C0] text-[14px] font-bold cursor-pointer hover:bg-[#C7EEFF] active:bg-[#FAFAFA]">
                                    <span className="text-[#1D242B] text-[14px] font-bold">Cancel</span>
                                </button>
                            </>
                        ) : (
                            <label htmlFor="banner_image" className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAFAFA] cursor-pointer hover:bg-[#C7EEFF] active:bg-[#FAFAFA]">
                                <Upload className="w-[15px] h-[15px] fill-[#0077C0] stroke-2" />
                                <span className="text-[#0077C0] text-[14px] font-bold">Replace</span>
                                <input type="file" id="banner_image" accept="image/jpeg, image/png" hidden onChange={handleHomeBannerChange}/>
                            </label>
                        )}
                    </div>

                    

                    <img src={homeBannerSrc} alt="hero_banner_image" className="w-full h-full object-cover"/>
                </div>


                <div className="flex flex-col w-full items-center justify-center gap-2">
                    <div className="flex flex-col gap-1 items-center">
                        <span className="font-bold text-[18px]">Demo Video</span>
                    </div>

                    {/* Show this when viewing the current content */}

                    {currentYoutubeUrlOpen ? (
                        <div className="flex flex-col items-center w-full gap-2">
                            <span className="text-[14px] opacity-75 italic">Paste a new title of the YouTube video and the URL</span>
                            
                            <div className="flex flex-col w-full gap-2 border-2 border-[#1D242B]/30 p-4 rounded-[10px] focus-within:border-[#0077C0]">
                                <input type="text" id="youtube_title" placeholder="Ex. Male Capsule Room for rent!"
                                value={youtubeTitle} onChange={(e) => setYoutubeTitle(e.target.value)}
                                className="focus:outline-none"/>
                            </div>

                            <div className="flex flex-col w-full gap-2 border-2 border-[#1D242B]/30 p-4 rounded-[10px] focus-within:border-[#0077C0]">
                                <input type="text" id="youtube_url" placeholder="Ex. https://www.youtube.com/watch?v=tTx9-kGmGUI" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)}
                                className="focus:outline-none"/>
                            </div>

                            <div className="flex justify-end w-full gap-1">
                                <button onClick={() => handleUploadYoutubeUrl(youtubeTitle, youtubeUrl)}
                                className="cursor-pointer py-3 px-4 rounded-[10px] bg-[#0077C0] hover:bg-[#005D97] text-[#FAFAFA] font-bold">{loading ? 'Saving...' : 'Save'}</button>
                                <button onClick={() => setCurrentYoutubeOpen(false)}
                                className="cursor-pointer py-3 px-4 rounded-[10px] bg-[#1D242B]/10 text-[#1D242B] font-bold hover:bg-[#1D242B]/25 active:bg-[#1D242B]/10">Cancel</button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center w-full h-auto gap-2">
                            <div className="w-full h-[400px] bg-[#1D242B]/15 rounded-[10px] overflow-hidden">
                                {/* iframe here */}
                                <section  className={`flex w-full h-full bg-[#FAFAFA] items-center justify-center `}>
                                    <div className="w-full max-w-5xl mx-auto rounded-[10px] overflow-hidden">
                                        <div className="aspect-video">
                                            <iframe
                                            className="w-full h-full"
                                            src={updatedVideoDemo?.asset_url}
                                            title={updatedVideoDemo?.asset_name}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                            referrerPolicy="strict-origin-when-cross-origin"
                                            allowFullScreen
                                            />
                                        </div>
                                    </div>
                                </section>  
                            </div>

                            <div className="flex justify-end w-full gap-1">
                                <button onClick={() => setCurrentYoutubeOpen(true)} 
                                className="cursor-pointer py-3 px-4 rounded-[10px] bg-[#1D242B]/10 hover:bg-[#1D242B]/25 active:bg-[#1D242B]/10 text-[#1D242B]">Change Video</button>
                            </div>
                        </div>
                    )}
                </div>


                <div className="flex flex-col w-full items-center justify-center gap-2">
                    <div className="flex flex-col gap-1 items-center">
                        <span className="font-bold text-[18px]">Room Type Images</span>
                    </div>

                    {/* Show this when viewing the current content */}
                    <div className="flex flex-col items-center justify-center w-full h-[300px] rounded-[10px]">
                        <div className="relative flex items-center w-full h-[400px] bg-[#1D242B]/25 rounded-[10px] overflow-hidden">
                            <label htmlFor="bedspace_image" className="absolute bottom-4 right-5 bg-[#FAFAFA] rounded-full p-1 px-3 cursor-pointer hover:bg-[#C7EEFF] active:bg-[#FAFAFA]">
                                <span className="text-[14px] text-[#0077C0] font-bold">Replace BedSpace Image</span>
                                <input type="file" id="bedspace_image" hidden/>
                            </label>

                            {/* Add the image here */}
                        </div>
                    </div> 

                    <div className="flex flex-col items-center justify-center w-full h-[300px] rounded-[10px]">
                        <div className="relative flex items-center w-full h-[400px] bg-[#1D242B]/25 rounded-[10px] overflow-hidden">
                            <label htmlFor="bedspace_image" className="absolute bottom-4 right-5 bg-[#FAFAFA] rounded-full p-1 px-3 cursor-pointer hover:bg-[#C7EEFF] active:bg-[#FAFAFA]">
                                <span className="text-[14px] text-[#0077C0] font-bold">Replace Apartment Image</span>
                                <input type="file" id="bedspace_image" hidden/>
                            </label>

                            {/* Add the image here */}
                        </div>
                    </div> 

                    <div className="flex w-full justify-end">
                        <button className="px-4 py-3 bg-[#1D242B]/10 hover:bg-[#1D242B]/25 active:bg-[#1D242B]/10 rounded-[10px] cursor-pointer">Save Changes</button>
                    </div>
                </div>


                <div className="flex flex-col w-full items-center justify-center gap-2">
                    <div className="flex flex-col gap-1 items-center">
                        <span className="font-bold text-[18px]">Why Choose Us Images</span>
                    </div>

                    {/* Show this when viewing the current content */}
                    <div className="flex flex-col items-center justify-center w-full h-[600px] rounded-[10px] gap-2">
                        <div className="relative flex items-center w-full h-full bg-[#1D242B]/25 rounded-[10px] overflow-hidden">
                            <label htmlFor="bedspace_image" className="absolute bottom-4 right-5 bg-[#FAFAFA] rounded-full p-1 px-3 cursor-pointer hover:bg-[#C7EEFF] active:bg-[#FAFAFA]">
                                <span className="text-[14px] text-[#0077C0] font-bold">Replace Image</span>
                                <input type="file" id="bedspace_image" hidden/>
                            </label>

                            {/* Add the image here */}
                        </div>

                        <div className="flex items-center w-full h-full gap-2">
                            <div className="relative flex items-center w-full h-full bg-[#1D242B]/25 rounded-[10px] overflow-hidden">
                                <label htmlFor="bedspace_image" className="absolute bottom-4 right-5 bg-[#FAFAFA] rounded-full p-1 px-3 cursor-pointer hover:bg-[#C7EEFF] active:bg-[#FAFAFA]">
                                    <span className="text-[14px] text-[#0077C0] font-bold">Replace Image</span>
                                    <input type="file" id="bedspace_image" hidden/>
                                </label>

                                {/* Add the image here */}
                            </div>

                            <div className="relative flex items-center w-full h-full bg-[#1D242B]/25 rounded-[10px] overflow-hidden">
                                <label htmlFor="bedspace_image" className="absolute bottom-4 right-5 bg-[#FAFAFA] rounded-full p-1 px-3 cursor-pointer hover:bg-[#C7EEFF] active:bg-[#FAFAFA]">
                                    <span className="text-[14px] text-[#0077C0] font-bold">Replace Image</span>
                                    <input type="file" id="bedspace_image" hidden/>
                                </label>

                                {/* Add the image here */}
                            </div> 
                        </div>
                    </div> 

                    <div className="flex w-full justify-end">
                        <button className="px-4 py-3 bg-[#1D242B]/10 hover:bg-[#1D242B]/25 active:bg-[#1D242B]/10 rounded-[10px] cursor-pointer">Save Changes</button>
                    </div>
                </div>
            </div>
        </div>
    )
}