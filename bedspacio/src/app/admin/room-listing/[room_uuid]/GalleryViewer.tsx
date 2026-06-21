"use client"

import { useState } from "react";
import Remove from '@/asset/icon/delete.svg'
import UploadImage from '@/asset/icon/upload-image.svg'


const MAX_IMAGES = 6;


type RoomImage = {
    preview: string;
    public_id?: string,
    file?: File;
    existing: boolean;
};

type GalleryViewerProps = {
    images: RoomImage[];
    setImages: React.Dispatch<React.SetStateAction<RoomImage[]>>;
};

export default function GalleryViewer ({ images, setImages }: GalleryViewerProps) {

    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {

        const files = e.target.files;
        if (!files || files.length === 0) return;

        const remainingSlots = MAX_IMAGES - images.length;

        if (remainingSlots <= 0) {
            alert("Maximum of 6 images reached");
            return;
        }

        const newImages = Array.from(files)
            .slice(0, remainingSlots)
            .map(file => ({
                preview: URL.createObjectURL(file),
                file,
                existing: false
            }));

        setImages(prev => [...prev, ...newImages]);
        e.target.value = "";
    }

    const handleDeleteImage = (index: number) => {
        setImages(prev =>
            prev.filter((_, i) => i !== index)
        );
    }

    return (
        <div className="flex w-full h-fit">
            <div className="flex flex-col bg-[#1D242B]/10 rounded-[10px] p-[1rem] gap-[1rem] w-full">
                <div className="flex flex-col items-center justify-center w-full rounded-[10px] gap-2">
                    <label htmlFor="add_image" className={`flex items-center justify-center rounded-[10px] w-full py-[2rem] border-2 border-dashed border-[#1D242B]/25  bg-[#C7EEFF]/50 
                        ${images.length >= 6 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#0077C0]/30 active:bg-[#C7EEFF]/50 cursor-pointer'}`}>
                        <UploadImage className="w-[40px] h-[40px] stroke-[#0077C0] opacity-75" />
                        <input
                            type="file"
                            name="image"
                            id="add_image"
                            accept="image/jpeg, image/png"
                            multiple
                            hidden
                            disabled={images.length >= 6}
                            onChange={handleImage}
                        />
                    </label>
                    <span className="text-[14px] italic">(Upload up to 6 Images)</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                        {images.map((img, index) => (
                            <div key={index} className="relative flex items-center justify-center w-full bg-[#1D242B]/25 h-[200px] rounded-[5px] overflow-hidden">
                                <button onClick={() => handleDeleteImage(index)} className="absolute top-2 right-2 cursor-pointer rounded-[10px] bg-[#FAFAFA] hover:bg-[#1D242B]/25 active:bg-[#FAFAFA] p-1">
                                    <Remove className="w-[25px] h-[25px] stroke-[#1D242B] stroke-2" />
                                </button>

                                <img
                                    src={
                                        img.existing
                                            ? img.preview
                                            : img.preview
                                    }
                                    alt=""
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        ))}
                </div>
            </div>
        </div>
    )
}



// "use client";

// import Remove from "@/asset/icon/delete.svg";
// import UploadImage from "@/asset/icon/upload-image.svg";

// const MAX_IMAGES = 6;

// type RoomImage = {
//     preview: string;
//     file?: File;
//     existing: boolean;
// };

// type GalleryViewerProps = {
//     images: RoomImage[];
//     setImages: React.Dispatch<React.SetStateAction<RoomImage[]>>;
// };

// export default function GalleryViewer({
//     images,
//     setImages
// }: GalleryViewerProps) {

//     const handleImage = (
//         e: React.ChangeEvent<HTMLInputElement>
//     ) => {
//         const files = e.target.files;
//         if (!files || files.length === 0) return;

//         const remainingSlots = MAX_IMAGES - images.length;

//         if (remainingSlots <= 0) {
//             alert("Maximum of 6 images reached");
//             return;
//         }

//         const newImages = Array.from(files)
//             .slice(0, remainingSlots)
//             .map(file => ({
//                 preview: URL.createObjectURL(file),
//                 file,
//                 existing: false
//             }));

//         setImages(prev => [...prev, ...newImages]);

//         e.target.value = "";
//     };

//     const handleDeleteImage = (index: number) => {
//         setImages(prev =>
//             prev.filter((_, i) => i !== index)
//         );
//     };

//     return (
//         <div className="flex w-full h-fit">
//             <div className="flex flex-col bg-[#1D242B]/10 rounded-[10px] p-[1rem] gap-[1rem] w-full">

//                 <div className="flex flex-col items-center justify-center w-full rounded-[10px] gap-2">
//                     <label
//                         htmlFor="add_image"
//                         className={`flex items-center justify-center rounded-[10px] w-full py-[2rem] border-2 border-dashed border-[#1D242B]/25 bg-[#C7EEFF]/50 ${
//                             images.length >= 6
//                                 ? "opacity-50 cursor-not-allowed"
//                                 : "hover:bg-[#0077C0]/30 active:bg-[#C7EEFF]/50 cursor-pointer"
//                         }`}
//                     >
//                         <UploadImage className="w-[40px] h-[40px] stroke-[#0077C0] opacity-75" />

//                         <input
//                             type="file"
//                             id="add_image"
//                             accept="image/jpeg,image/png"
//                             multiple
//                             hidden
//                             disabled={images.length >= 6}
//                             onChange={handleImage}
//                         />
//                     </label>

//                     <span className="text-[14px] italic">
//                         (Upload up to 6 Images)
//                     </span>
//                 </div>

//                 <div className="grid grid-cols-2 gap-2">
//                     {images.map((img, index) => (
//                         <div
//                             key={index}
//                             className="relative flex items-center justify-center w-full bg-[#1D242B]/25 h-[200px] rounded-[5px] overflow-hidden"
//                         >
//                             <button
//                                 onClick={() =>
//                                     handleDeleteImage(index)
//                                 }
//                                 className="absolute top-2 right-2 cursor-pointer rounded-[10px] bg-[#FAFAFA] hover:bg-[#1D242B]/25 p-1"
//                             >
//                                 <Remove className="w-[25px] h-[25px] stroke-[#1D242B] stroke-2" />
//                             </button>

//                             <img
//                                 src={
//                                     img.existing
//                                         ? `http://localhost:5000/file/room/image/${img.preview}`
//                                         : img.preview
//                                 }
//                                 alt=""
//                                 className="w-full h-full object-contain"
//                             />
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// }