"use client"

import { RoomImageProp } from "./RoomImage"
import { useState } from "react";

export default function ImageFullViewClient ({ images }: RoomImageProp) {

    const [displayImage, setDisplayImage] = useState<string>(images[0].image);
    
    const showImage = (image: string) => {
        setDisplayImage(prev => prev !== image ? image : prev)
    }

    return (
        <div className="flex flex-col justify-between items-center w-full h-auto">
            <div className="flex items-center justify-center w-[900px] min-h-[500px]">
                <img src={`data:image/webp;base64,${displayImage}`} alt="" className="w-full h-[500px] object-cover"/>
            </div>

            <div className="flex items-end justify-center w-full h-auto gap-2 p-2">
                {images.map(img => (
                    <button key={img.id} onClick={() => showImage(img.image)} className="flex items-center w-[100px] h-[100px] rounded-[10px] overflow-hidden">
                        <img src={`data:image/webp;base64,${img.image}`} alt="" className="object-cover w-full h-full"/>
                    </button>
                ))}
            </div>
        </div>
    )
}