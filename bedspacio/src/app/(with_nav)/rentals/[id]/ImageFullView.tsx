
// Both Odoo and Postgres can use this. No changes needed

"use client"

import CloseImage from '@/asset/icon/close_image.svg'
import Arrow from '@/asset/icon/arrow-right.svg'

type ViewImageProps = {
    selectedImage: string,
    totalImage: number,
    onClose: () => void,
    viewLeft: () => void,
    viewRight: () => void
}


export default function ImageFullView ({ selectedImage, totalImage, onClose, viewLeft, viewRight }: ViewImageProps) {
    
    return (
        <div className="fixed z-40 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center backdrop-blur-[5px] justify-center bg-[#1D242B]/75 w-full h-full">
            {totalImage > 1 && (
                <div className="absolute inset-0 flex items-center justify-between w-full">
                    <button onClick={viewLeft} className='bg-[#FAFAFA] rounded-full cursor-pointer active:bg-[#0077C0] active:scale-95 transition-all duration-100'><Arrow className="w-[40px] h-[40px] -rotate-180" /></button>
                    <button onClick={viewRight} className='bg-[#FAFAFA] rounded-full cursor-pointer active:bg-[#0077C0] active:scale-95 transition-all duration-100'><Arrow className="w-[40px] h-[40px]" /></button>
                </div>
            )}
            <div className="relative flex items-center justify-center w-[1000px] h-[700px]">

                <button onClick={onClose} className="absolute top-4 right-4 flex items-center gap-1 bg-[#FAFAFA] text-[#1D242B] text-[18px] font-bold px-3 py-1 rounded-full cursor-pointer opacity-50 hover:opacity-100 active:bg-[#1D242B] active:text-[#FAFAFA]">
                    <CloseImage className="w-[20px] h-[20px]"/>
                    close
                </button>
                <img src={`${selectedImage}`} alt="room image" className="w-full h-full object-cover rounded-[10px]"/>
            </div>
        </div>
    )
}