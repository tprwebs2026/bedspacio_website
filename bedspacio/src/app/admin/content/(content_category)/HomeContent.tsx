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
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/config/config";

// icons
import Upload from '@/asset/icon/upload.svg';

// functions
import { uploadYoutubeUrl } from "../../../../../lib/content";

// imported types
import { BannerType, WhyChooseUsAssetType } from "../ContentPageWrapper";


interface HomeContentProps {
    setSuccessMessage: React.Dispatch<React.SetStateAction<string>>;
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
    videoDemo: BannerType;
    homePageBanner: BannerType,
    bedspaceImage: BannerType,
    apartmentImage: BannerType
    whyChooseUsImage: WhyChooseUsAssetType[]
}



export default function HomeContent ({ 
    setSuccessMessage, 
    setErrorMessage, 
    homePageBanner, 
    videoDemo, 
    bedspaceImage,
    apartmentImage,
    whyChooseUsImage
}: HomeContentProps) {

    const [heroBannerBlob, setHeroBannerBlob] = useState<File | null>(null)
    const [heroBannerPreview, setHeroBannerPreview] = useState<string | undefined>(undefined);
    const [updatedHeroBanner, setUpdatedHeroBanner] = useState<string>(homePageBanner?.asset_url)

    const [updatedVideoDemo, setUpdatedVideoDemo] = useState<BannerType>(videoDemo)
    const [youtubeTitle, setYoutubeTitle] = useState<string>('');
    const [youtubeUrl, setYoutubeUrl] = useState<string>('');
    const [currentYoutubeUrlOpen, setCurrentYoutubeOpen] = useState<boolean>(false);
    
    const [bedspaceImagePreview, setBedspaceImagePreview] = useState<string | undefined>(undefined);
    const [bedspaceImageBlob, setBedspaceBlob] = useState<File|null>(null);
    const [updatedBedspaceImage, setUpdatedBedspaceImage] = useState<string>(bedspaceImage?.asset_url)

    const [apartmentImagePreview, setApartmentImagePreview] = useState<string|undefined>(undefined);
    const [apartmentImageBlob, setApartmentImageBlob] = useState<File|null>(null);
    const [updatedApartmentImage, setUpdatedApartmentImage] = useState<string>(apartmentImage?.asset_url);



    console.log('Why Choose Us Images: ', whyChooseUsImage);

    const topImage = whyChooseUsImage?.find(
        item => item.asset_key === 'why_choose_us_top'
    )?.asset_url;

    const bottomLeftImage = whyChooseUsImage?.find(
        item => item.asset_key === 'why_choose_us_bottom_left'
    )?.asset_url;

    const bottomRightImage = whyChooseUsImage?.find(
        item => item.asset_key === 'why_choose_us_bottom_right'
    )?.asset_url;

    const [topPreview, setTopPreview] = useState<string|undefined>(undefined);
    const [topBlob, setTopBlob] = useState<File|null>(null);
    const [updatedTopImage, setUpdatedTopImage] = useState<string|undefined>(topImage);

    const [bottomLeftPreview, setBottomLeftPreview] = useState<string|undefined>(undefined);
    const [bottomLeftBlob, setBottomLeftBlob] = useState<File|null>(null);
    const [updatedBottomLeftImage, setUpdatedBottomLeftImage] = useState<string|undefined>(bottomLeftImage);

    const [bottomRightPreview, setBottomRightPreview] = useState<string|undefined>(undefined);
    const [bottomRightBlob, setBottomRightBlob] = useState<File|null>(null);
    const [updatedBottomRightImage, setUpdatedBottomRightImage] = useState<string|undefined>(bottomRightImage);


    const [loading, setLoading] = useState<boolean>(false);


    // ------------------------------- HOME BANNER ------------------------------- //
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


    const homeBannerSrc = heroBannerPreview ?? updatedHeroBanner
            

    // ------------------ VIDEO DEMO ------------------ // 

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

    // ------------------ ROOM TYPE ------------------ // 

    const handleBedspaceImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            if (bedspaceImagePreview) {
                URL.revokeObjectURL(bedspaceImagePreview);
            }

            setBedspaceBlob(file);
            setBedspaceImagePreview(URL.createObjectURL(file));
        }
    }

    const handleSubmitBedspaceImage = async () => {

        if (!bedspaceImageBlob) {
            setErrorMessage('Please select an image.');
            setTimeout(() => setErrorMessage(''), 3500);
            return;
        }
        setLoading(true);

        try {
            const bannerForm = new FormData();
            bannerForm.append('bedspace_image', bedspaceImageBlob);

            const bedspaceImage = await axios.put(
                `${BASE_URL}/content/v1/room-type`, 
                bannerForm ,
                { withCredentials: true }
            );

            setUpdatedBedspaceImage(bedspaceImage.data.data.bedspaceImage);
            setBedspaceImagePreview(undefined);

            setSuccessMessage('Bedspace Image upload successfully!');
            setTimeout(() => setSuccessMessage(''), 3500);


        } catch (err) {
            console.error('Failed to upload home banner: ', err);
        } finally {
            setLoading(false);
        }
    }

    const handleApartmentImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            if (apartmentImagePreview) {
                URL.revokeObjectURL(apartmentImagePreview);
            }

            setApartmentImageBlob(file);
            setApartmentImagePreview(URL.createObjectURL(file));
        }
    }

    const handleSubmitApartmentImage = async () => {

        if (!apartmentImageBlob) {
            setErrorMessage('Please select an image.');
            setTimeout(() => setErrorMessage(''), 3500);
            return;
        }
        setLoading(true);

        try {
            const bannerForm = new FormData();
            bannerForm.append('apartment_image', apartmentImageBlob);

            const apartmentImage = await axios.put(
                `${BASE_URL}/content/v1/room-type`, 
                bannerForm ,
                { withCredentials: true }
            );

            setUpdatedApartmentImage(apartmentImage.data.data.apartmentImage);
            setApartmentImagePreview(undefined);

            setSuccessMessage('Apartment Image upload successfully!');
            setTimeout(() => setSuccessMessage(''), 3500);


        } catch (err) {
            console.error('Failed to upload home banner: ', err);
        } finally {
            setLoading(false);
        }
    }

    const bedspaceImageSrc = bedspaceImagePreview ?? updatedBedspaceImage;
    const apartmentImageSrc = apartmentImagePreview ?? updatedApartmentImage;

    // ------------------ WHY CHOOSE US ------------------ //

    const handleTopChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if(topPreview) {
                URL.revokeObjectURL(topPreview)
            }
            setTopBlob(file);
            setTopPreview(URL.createObjectURL(file));
        }
    }

    const handleSubmitTopImage = async () => {
        if (!topBlob) {
            setErrorMessage('Please select an image.');
            setTimeout(() => setErrorMessage(''), 3500);
            return;
        }
        setLoading(true);
        try {
            const imageForm = new FormData();
            imageForm.append('top_image', topBlob);

            const image = await axios.put(
                `${BASE_URL}/content/v1/why-choose-us`, 
                imageForm ,
                { withCredentials: true }
            );

            setUpdatedTopImage(image.data.data.topImage);
            setTopPreview(undefined);

            setSuccessMessage('Why Choose us Image 1 upload successfully!');
            setTimeout(() => setSuccessMessage(''), 3500);
        } catch (err) {
            // add error handling later
            console.error('Error uploading top image of Why Choose Us section: ', err);
        } finally {
            setLoading(false);
        }
    } 

    const topImageSrc =
        topPreview ??
        (updatedTopImage
            ? updatedTopImage
            : undefined);

    const handleBottomLeftChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if(bottomLeftPreview) {
                URL.revokeObjectURL(bottomLeftPreview)
            }
            setBottomLeftBlob(file);
            setBottomLeftPreview(URL.createObjectURL(file));
        }
    }

    const handleSubmitBottomLeftImage = async () => {
        if (!bottomLeftBlob) {
            setErrorMessage('Please select an image.');
            setTimeout(() => setErrorMessage(''), 3500);
            return;
        }
        setLoading(true);
        try {
            const imageForm = new FormData();
            imageForm.append('bottom_left', bottomLeftBlob);

            const image = await axios.put(
                `${BASE_URL}/content/v1/why-choose-us`, 
                imageForm ,
                { withCredentials: true }
            );

            setUpdatedBottomLeftImage(image.data.data.bottomLeft);
            setBottomLeftPreview(undefined);

            setSuccessMessage('Why Choose us Image 2 upload successfully!');
            setTimeout(() => setSuccessMessage(''), 3500);
        } catch (err) {
            // add error handling later
        } finally {
            setLoading(false);
        }
    }

    const bottomLeftImageSrc =
        bottomLeftPreview ??
        (updatedBottomLeftImage
            ? updatedBottomLeftImage
            : undefined);


    const handleBottomRightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if(bottomRightPreview) {
                URL.revokeObjectURL(bottomRightPreview)
            }
            setBottomRightBlob(file);
            setBottomRightPreview(URL.createObjectURL(file));
        }
    }
    const handleSubmitBottomRightImage = async () => {
        if (!bottomRightBlob) {
            setErrorMessage('Please select an image.');
            setTimeout(() => setErrorMessage(''), 3500);
            return;
        }
        setLoading(true);
        try {
            const imageForm = new FormData();
            imageForm.append('bottom_right', bottomRightBlob);

            const image = await axios.put(
                `${BASE_URL}/content/v1/why-choose-us`, 
                imageForm ,
                { withCredentials: true }
            );

            setUpdatedBottomRightImage(image.data.data.bottomRight);
            setBottomRightPreview(undefined);

            setSuccessMessage('Why Choose us Image 3 upload successfully!');
            setTimeout(() => setSuccessMessage(''), 3500);
        } catch (err) {
            // add error handling later
        } finally {
            setLoading(false);
        }
    }

    const bottomRightImageSrc =
        bottomRightPreview ??
        (updatedBottomRightImage
            ? updatedBottomRightImage
            : undefined);

    // ------------------ BREAK ------------------ //

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
                                <input type="file" id="banner_image" accept=".jpg,.jpeg,.png,image/jpeg,image/png" hidden onChange={handleHomeBannerChange}/>
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

                            <div className="absolute inset-0 bg-black/50"/>
                            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-2xl text-[#FAFAFA] text-center">Bedspace Image</span>

                            <div className="absolute bottom-3 right-3 flex items-center justify-center gap-1">
                                {bedspaceImagePreview ? (
                                    <>
                                        <button onClick={handleSubmitBedspaceImage} className="bg-[#FAFAFA] rounded-full p-1 px-3 cursor-pointer hover:bg-[#C7EEFF] active:bg-[#FAFAFA]">
                                            <span className="text-[14px] text-[#0077C0] font-bold">{loading ? 'Saving...' : 'Save'}</span>
                                        </button>
                                        <button onClick={() => setBedspaceImagePreview(undefined)}
                                        className="bg-[#FAFAFA] rounded-full p-1 px-3 cursor-pointer hover:bg-[#C7EEFF] active:bg-[#FAFAFA]">
                                            <span className="text-[14px] text-[#0077C0] font-bold">Cancel</span>
                                        </button>
                                    </>
                                ):(
                                    <label htmlFor="bedspace_image" className="bg-[#FAFAFA] rounded-full p-1 px-3 cursor-pointer hover:bg-[#C7EEFF] active:bg-[#FAFAFA]">
                                        <span className="text-[14px] text-[#0077C0] font-bold">Replace BedSpace Image</span>
                                        <input type="file" id="bedspace_image" hidden accept=".jpg,.jpeg,.png,image/jpeg,image/png" onChange={handleBedspaceImageChange}/>
                                    </label>
                                )}
                            </div>
                            
                            {/* Add the image here */}
                            <img src={bedspaceImageSrc} alt="bedpsace_type_image" className="w-full h-full object-cover"/>
                        </div>
                    </div> 

                    <div className="flex flex-col items-center justify-center w-full h-[300px] rounded-[10px]">
                        <div className="relative flex items-center w-full h-[400px] bg-[#1D242B]/25 rounded-[10px] overflow-hidden">

                            <div className="absolute inset-0 bg-black/50"/>
                            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-2xl text-[#FAFAFA] text-center">Apartment Image</span>

                            <div className="absolute bottom-3 right-3 flex items-center justify-center gap-1">
                                {apartmentImagePreview ? (
                                    <>
                                        <button onClick={handleSubmitApartmentImage} className="bg-[#FAFAFA] rounded-full p-1 px-3 cursor-pointer hover:bg-[#C7EEFF] active:bg-[#FAFAFA]">
                                            <span className="text-[14px] text-[#0077C0] font-bold">{loading ? 'Saving...' : 'Save'}</span>
                                        </button>
                                        <button onClick={() => setApartmentImagePreview(undefined)}
                                        className="bg-[#FAFAFA] rounded-full p-1 px-3 cursor-pointer hover:bg-[#C7EEFF] active:bg-[#FAFAFA]">
                                            <span className="text-[14px] text-[#0077C0] font-bold">Cancel</span>
                                        </button>
                                    </>
                                ):(
                                    <label htmlFor="apartment_image" className="bg-[#FAFAFA] rounded-full p-1 px-3 cursor-pointer hover:bg-[#C7EEFF] active:bg-[#FAFAFA]">
                                        <span className="text-[14px] text-[#0077C0] font-bold">Replace Apartment Image</span>
                                        <input type="file" id="apartment_image" accept=".jpg,.jpeg,.png,image/jpeg,image/png" hidden onChange={handleApartmentImageChange}/>
                                    </label>
                                )}
                            </div>

                            {/* Add the image here */}
                            <img src={apartmentImageSrc} alt="apartment_type_image" className="w-full h-full object-cover"/>
                        </div>
                    </div> 

                    {/* <div className="flex w-full justify-end">
                        <button className="px-4 py-3 bg-[#1D242B]/10 hover:bg-[#1D242B]/25 active:bg-[#1D242B]/10 rounded-[10px] cursor-pointer">Save Changes</button>
                    </div> */}
                </div>


                <div className="flex flex-col w-full items-center justify-center gap-2">
                    <div className="flex flex-col gap-1 items-center">
                        <span className="font-bold text-[18px]">Why Choose Us Images</span>
                    </div>

                    {/* Show this when viewing the current content */}
                    <div className="flex flex-col items-center justify-center w-full h-[600px] rounded-[10px] gap-2">
                        <div className="relative flex items-center w-full h-full bg-[#1D242B]/25 rounded-[10px] overflow-hidden">
                            <div className="absolute inset-0 bg-black/50"/>
                            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-2xl text-[#FAFAFA] text-center">Image 1</span>
                    
                            <div className="absolute bottom-3 right-3 flex items-center justify-center gap-1">
                                {topPreview ? (
                                    <>
                                        <button onClick={handleSubmitTopImage} className="bg-[#FAFAFA] rounded-full p-1 px-3 cursor-pointer hover:bg-[#C7EEFF] active:bg-[#FAFAFA]">
                                            <span className="text-[14px] text-[#0077C0] font-bold">{loading ? 'Saving...' : 'Save'}</span>
                                        </button>
                                        <button onClick={() => setTopPreview(undefined)}
                                        className="bg-[#FAFAFA] rounded-full p-1 px-3 cursor-pointer hover:bg-[#C7EEFF] active:bg-[#FAFAFA]">
                                            <span className="text-[14px] text-[#0077C0] font-bold">Cancel</span>
                                        </button>
                                    </>
                                ) : (
                                    <label htmlFor="top_image" className="bg-[#FAFAFA] rounded-full p-1 px-3 cursor-pointer hover:bg-[#C7EEFF] active:bg-[#FAFAFA]">
                                        <span className="text-[14px] text-[#0077C0] font-bold">Replace Image</span>
                                        <input type="file" id="top_image" accept=".jpg,.jpeg,.png,image/jpeg,image/png" hidden onChange={handleTopChange}/>
                                    </label>
                                )}
                            </div>

                            {/* Add the image here */}
                            <img src={topImageSrc} alt="Why_Choose_us_image1" className="w-full h-full object-cover"/>
                        </div>

                        <div className="flex items-center w-full h-full gap-2">
                            <div className="relative flex items-center w-full h-full bg-[#1D242B]/25 rounded-[10px] overflow-hidden">
                                <div className="absolute inset-0 bg-black/50"/>
                                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-2xl text-[#FAFAFA] text-center">Image 2</span>

                                <div className="absolute bottom-3 right-3 flex items-center justify-center gap-1">
                                    {bottomLeftPreview ? (
                                        <>
                                            <button onClick={handleSubmitBottomLeftImage} className="bg-[#FAFAFA] rounded-full p-1 px-3 cursor-pointer hover:bg-[#C7EEFF] active:bg-[#FAFAFA]">
                                                <span className="text-[14px] text-[#0077C0] font-bold">{loading ? 'Saving...' : 'Save'}</span>
                                            </button>
                                            <button onClick={() => setBottomLeftPreview(undefined)}
                                            className="bg-[#FAFAFA] rounded-full p-1 px-3 cursor-pointer hover:bg-[#C7EEFF] active:bg-[#FAFAFA]">
                                                <span className="text-[14px] text-[#0077C0] font-bold">Cancel</span>
                                            </button>
                                        </>
                                    ) : (
                                        <label htmlFor="bottomLeft_image" className="bg-[#FAFAFA] rounded-full p-1 px-3 cursor-pointer hover:bg-[#C7EEFF] active:bg-[#FAFAFA]">
                                            <span className="text-[14px] text-[#0077C0] font-bold">Replace Image</span>
                                            <input type="file" id="bottomLeft_image" accept=".jpg,.jpeg,.png,image/jpeg,image/png" hidden onChange={handleBottomLeftChange}/>
                                        </label>
                                    )}
                                </div>

                                {/* Add the image here */}
                                <img src={bottomLeftImageSrc} alt="Why_Choose_us_image2" className="w-full h-full object-cover"/>
                            </div>

                            <div className="relative flex items-center w-full h-full bg-[#1D242B]/25 rounded-[10px] overflow-hidden">
                                <div className="absolute inset-0 bg-black/50"/>
                                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-2xl text-[#FAFAFA] text-center">Image 3</span>

                                <div className="absolute bottom-3 right-3 flex items-center justify-center gap-1">
                                    {bottomRightPreview ? (
                                        <>
                                            <button onClick={handleSubmitBottomRightImage} className="bg-[#FAFAFA] rounded-full p-1 px-3 cursor-pointer hover:bg-[#C7EEFF] active:bg-[#FAFAFA]">
                                                <span className="text-[14px] text-[#0077C0] font-bold">{loading ? 'Saving...' : 'Save'}</span>
                                            </button>
                                            <button onClick={() => setBottomRightPreview(undefined)}
                                            className="bg-[#FAFAFA] rounded-full p-1 px-3 cursor-pointer hover:bg-[#C7EEFF] active:bg-[#FAFAFA]">
                                                <span className="text-[14px] text-[#0077C0] font-bold">Cancel</span>
                                            </button>
                                        </>
                                    ) : (
                                        <label htmlFor="bottomRight_image" className="bg-[#FAFAFA] rounded-full p-1 px-3 cursor-pointer hover:bg-[#C7EEFF] active:bg-[#FAFAFA]">
                                            <span className="text-[14px] text-[#0077C0] font-bold">Replace Image</span>
                                            <input type="file" id="bottomRight_image" accept=".jpg,.jpeg,.png,image/jpeg,image/png" hidden onChange={handleBottomRightChange}/>
                                        </label>
                                    )}
                                </div>

                                {/* Add the image here */}
                                <img src={bottomRightImageSrc} alt="Why_Choose_us_image3" className="w-full h-full object-cover"/>
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