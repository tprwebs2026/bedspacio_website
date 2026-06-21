"use client"

// hooks
import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/config/config";

// icon
import Upload from '@/asset/icon/upload.svg'

// type imports
import { BannerType } from "../ContentPageWrapper";

interface ContactsContentProp {
    setSuccessMessage: React.Dispatch<React.SetStateAction<string>>
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>
    contactImage: BannerType
}

export default function ContactsContent ({
    setSuccessMessage,
    setErrorMessage,
    contactImage
}:ContactsContentProp ) {

    const [imagePreview, setImagePreview] = useState<string|undefined>(undefined);
    const [imageBlob, setImageBlob] = useState<File|null>(null);
    const [updatedImage, setUpdatedImage] = useState<string>(contactImage?.asset_url)

    const [loading, setLoading] = useState<boolean>(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            };

            setImageBlob(file);
            setImagePreview(URL.createObjectURL(file))
        }
    };

    const handleSubmitImage = async () => {
        if (!imageBlob) {
            setErrorMessage('Please select an image.');
            setTimeout(() => setErrorMessage(''), 3500);
            return;
        }
        setLoading(true);
        try {
            const imageForm = new FormData();
            imageForm.append('contacts_image', imageBlob);

            const contactsImage = await axios.put(
                `${BASE_URL}/content/v1/contacts`,
                imageForm,
                { withCredentials: true }
            )

            setUpdatedImage(contactsImage.data.image.asset_url);
            setImagePreview(undefined);

            setSuccessMessage('About Us page banner updated successfully!');
            setTimeout(() => setSuccessMessage(''), 3500);
        } catch (err) {

        } finally {
            setLoading(false);
        }
    } 

    const imageSrc = 
        imagePreview ??
        (
            updatedImage
            ? updatedImage
            : undefined
        )


    return (
        <div className="flex flex-col w-full h-full items-start justify-start p-[2rem]">
            <div className="flex flex-col items-center gap-[2rem] w-full">
                <div className="flex flex-col items-center gap-2 w-full">
                    <span className="font-bold">How It Works Banner</span>

                    <div className="relative flex w-[600px] items-center justify-center h-[600px] bg-[#1D242B]/25 rounded-[10px] overflow-hidden">
                        <div className="absolute inset-0 bg-black/50"/>

                        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-2xl text-[#FAFAFA] text-center">Banner Image</span>

                        <div className="absolute bottom-3 right-3 flex items-center justify-center gap-1">
                            {imagePreview ? (
                                <>
                                    <button onClick={handleSubmitImage} className="px-3 py-1 rounded-full bg-[#FAFAFA] text-[#0077C0] text-[14px] font-bold cursor-pointer hover:bg-[#C7EEFF] active:bg-[#FAFAFA]">
                                        <span className="text-[#0077C0] text-[14px] font-bold">{loading ? 'Saving new image...' : 'Save new image'}</span>
                                    </button>

                                    <button onClick={() => setImagePreview(undefined)} className="px-3 py-1 rounded-full bg-[#FAFAFA] text-[#0077C0] text-[14px] font-bold cursor-pointer hover:bg-[#C7EEFF] active:bg-[#FAFAFA]">
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

                        <img src={imageSrc} alt="hero_banner_image" className="w-full h-full object-cover" />
                    </div>
                </div>
            </div>
        </div>
    )
}