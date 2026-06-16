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

// icons
import Upload from '@/asset/icon/upload.svg';

// functions
import { uploadYoutubeUrl } from "../../../../../lib/content";

export default function HomeContent () {

    const [heroBannerBlob, setHeroBannerBlob] = useState(null);
    const [heroBannerPreview, setHeroBannerPreview] = useState(null);

    const [youtubeTitle, setYoutubeTitle] = useState<string>('');
    const [youtubeUrl, setYoutubeUrl] = useState<string>('');
    const [currentYoutubeUrlOpen, setCurrentYoutubeOpen] = useState<boolean>(false);


    // ------------------------------- FUNCTIONS ------------------------------- //

    const handleUploadYoutubeUrl = async (title: string, url: string) => {
        try {
            if (!title || !url) {
                // add error message here to trigger errorToast
                return;
            }

            const response = await uploadYoutubeUrl(title, url);
            // add success message to trigger successToast

        } catch (err) { 
            console.error('Failed to upload Youtube url: ', err);
        }
    }






    // ------------------------------- BREAK ------------------------------- //

    return (
        <div className="flex flex-col w-full h-full items-center justify-center py-[1rem] pb-[2rem]">
            <span className="text-center text-[16px] text-[#1D242B]/80 py-[1rem]">
                Instruction here
            </span>

            <div className="flex flex-col items-center gap-[2rem] w-[700px]">
                <div className="relative flex w-full items-center justify-center h-[400px] bg-[#1D242B]/25 rounded-[10px] overflow-hidden">
                    <span>Change Image</span>

                    <div className="absolute bottom-3 right-3 flex items-center justify-center gap-1">
                        <label htmlFor="banner_image" className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAFAFA] cursor-pointer hover:bg-[#C7EEFF] active:bg-[#FAFAFA]">
                            <Upload className="w-[15px] h-[15px] fill-[#0077C0] stroke-2" />
                            <span className="text-[#0077C0] text-[14px] font-bold">Replace</span>
                            <input type="file" id="banner_image" hidden/>
                        </label>

                        <button className="px-3 py-1 rounded-full bg-[#FAFAFA] text-[#0077C0] text-[14px] font-bold cursor-pointer hover:bg-[#C7EEFF] active:bg-[#FAFAFA]">
                            <span className="text-[#0077C0] text-[14px] font-bold">Save new image</span>
                        </button>

                        <button className="px-3 py-1 rounded-full bg-[#FAFAFA] text-[#0077C0] text-[14px] font-bold cursor-pointer hover:bg-[#C7EEFF] active:bg-[#FAFAFA]">
                            <span className="text-[#1D242B] text-[14px] font-bold">Cancel</span>
                        </button>
                    </div>
                </div>


                <div className="flex flex-col w-full items-center justify-center gap-2">
                    <div className="flex flex-col gap-1 items-center">
                        <span className="font-bold text-[18px]">Demo Video</span>
                    </div>

                    {/* Show this when viewing the current content */}
                    {currentYoutubeUrlOpen ? (
                        <div className="flex flex-col items-center w-full gap-2">
                            <span className="text-[14px] opacity-75 italic">Paste the Title of the YouTube video and the URL</span>
                            
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
                                className="cursor-pointer py-3 px-4 rounded-[10px] bg-[#0077C0] hover:bg-[#005D97] text-[#FAFAFA] font-bold">Save</button>
                                <button onClick={() => setCurrentYoutubeOpen(false)}
                                className="cursor-pointer py-3 px-4 rounded-[10px] bg-[#1D242B]/10 text-[#1D242B] font-bold hover:bg-[#1D242B]/25 active:bg-[#1D242B]/10">Cancel</button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center w-full h-auto gap-2">
                            <div className="w-full h-[400px] bg-[#1D242B]/15 rounded-[10px] overflow-hidden">
                                {/* iframe here */}
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