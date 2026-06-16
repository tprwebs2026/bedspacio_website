"use client"

// hooks
import { useState } from "react";

// icon
import Upload from '@/asset/icon/upload.svg'

export default function RentalsContent () {

    return (
        <div className="flex flex-col w-full h-full items-center justify-center p-[2rem]">
            <div className="flex flex-col items-center gap-[2rem] w-full">
                <span className="font-bold">Banner Image</span>

                <div className="relative flex w-full items-center justify-center h-[300px] bg-[#1D242B]/25 rounded-[10px] overflow-hidden">
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
            </div>
        </div>
    )
}