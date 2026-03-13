"use client"

import { useState } from 'react'
import Arrow from '@/asset/icon/arrow-right.svg'
import FullScreen from '@/asset/icon/full-screen.svg'

import ImageFullView from './ImageFullView'

export type RoomImage = {
    id: number,
    image: string
}

export type RoomImageProp = {
    images: RoomImage[]
}

export default function RoomImages ({ images }: RoomImageProp) {
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const [fullViewOpen, setFullViewOpen] = useState<Boolean>(false);

    const imageArray = images.map((image) => { return image.image })
    const selectedImage = imageArray[selectedIndex];

    const displayImage = (image: string) => {
        const index = imageArray.indexOf(image);
        setSelectedIndex(index);
    }

    const imagesLength = images.length; 

    const toggleImageLeft = () => {
        setSelectedIndex((prev) => 
            prev === 0 ? imageArray.length - 1 : prev - 1
        );
    }
    const toggleImageRight = () => {
        setSelectedIndex((prev) => 
            (prev + 1) % imageArray.length
        );
    }


    return (
        <>
            <div className="grid grid-rows-[80%_20%] w-full h-[550px] gap-1">
                <div className="relative flex items-start justify-start w-full h-full overflow-hidden">
                    <button onClick={() => setFullViewOpen(prev => !prev)} title='Full Screen' className='hidden xl:flex lg:flex absolute bottom-2 right-2 cursor-pointer'>
                        <FullScreen className="w-[20px] h-[20px] hover:scale-110 active:scale-100 transition-all duration-100"/>
                    </button>
                    {images.length > 1 && (
                        <div className="xl:hidden lg:hidden absolute inset-0 flex items-center justify-between w-full h-full px-2">
                            <button onClick={toggleImageLeft} className="bg-[#FAFAFA] rounded-full cursor-pointer active:bg-[#0077C0] active:scale-95 transition-all duration-100">
                                <Arrow className="w-[40px] h-[40px] -rotate-180" />
                            </button>

                            <button onClick={toggleImageRight} className="bg-[#FAFAFA] rounded-full cursor-pointer active:bg-[#0077C0] active:scale-95 transition-all duration-100">
                                <Arrow className="w-[40px] h-[40px]" />
                            </button>
                        </div>
                    )}

                    <img 
                        src={`data:image/webp;base64,${selectedImage}`}
                        alt="sample"
                        className="w-full h-full object-cover rounded-[10px]"
                    />
                </div>

                <div className="flex items-center w-full gap-1 overflow-x-scroll xl:overflow-x-auto overflow-y-hidden">
                    {images.map((img) => (
                        <button
                            onClick={() => displayImage(img.image)}
                            key={img.id}
                            className={`relative shrink-0 w-20 h-20 cursor-pointer hover:border-2 hover:border-[#1D242B] active:border-[#0077C0] rounded-[10px] overflow-hidden ${selectedImage === img.image && 'opacity-100 border-2 border-[#0077C0]'}`}
                        >
                            <img
                                src={`data:image/webp;base64,${img.image}`}
                                alt="sample"
                                className={`w-full h-full object-cover opacity-50 active:opacity-100 ${selectedImage === img.image && 'opacity-100'}`}
                            />
                        </button>
                    ))}
                </div>
            </div>

            <div className='hidden xl:flex lg:flex'>
                {fullViewOpen && (
                    <ImageFullView 
                        selectedImage={selectedImage} 
                        totalImage = {imagesLength}
                        onClose={() => setFullViewOpen(prev => !prev)}
                        viewLeft={toggleImageLeft}
                        viewRight={toggleImageRight}
                    />
                )}
            </div>
        </>
    )
}