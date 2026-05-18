"use client"

import Link from "next/link"
import BranchIcon from '@/asset/icon/location.svg'
import { useState } from "react"
import { getBranch, deleteBranch } from "../../../../lib/branch"
import BranchViewModal from "./BranchViewModal"
import { getPropertyManagers } from '../../../../lib/user'


type Landmark = {
    id: number,
    landmark: string
}


type PropertyManagersType = {
    id: number,
    fullname: string
}

export type branchType = {
    id: number,
    branch_name: string,
    address: string,
    property_manager: string
    landmarks: Landmark[],
    image: string
}

interface CardWrapperProps {
    viewModal: () => void;
    branchData: branchType;
}


export default function BranchCardWrapper ({ viewModal, branchData }: CardWrapperProps) {

    return (
        <button key={branchData.id} onClick={viewModal} className='grid grid-rows-[4fr_1fr] h-[400px] bg-[#1D242B]/15 rounded-[10px] overflow-hidden hover:-translate-y-1 active:translate-y-1 border-b-4 border-b-[#FAFAFA] hover:border-b-[#0077C0] transition-all duration-100'>
            <div className='flex items-center justify-center bg-[#1D242B]/50 cursor-pointer overflow-hidden'>
                <img src={`http://localhost:5000/file/branch/image/${branchData.image}`} alt="bedspacio-branch" className='w-full h-full object-cover' />
            </div>

            <div className='flex flex-col items-start justify-between gap-2 p-[1rem]'>
                <div className='flex items-center justify-start gap-1'>
                    <BranchIcon className="w-[25px] h-[25px] stroke-[#1D242B] fill-[#1D242B]" />
                    <span className='font-bold text-[18px] text-left text-[#1D242B] w-[200px] truncate'>{branchData.branch_name}</span>
                </div>
                <span className='text-[#1D242B]/75 text-[14px] text-left w-[250px] truncate'>{branchData.address}</span>

                <div className='flex flex-wrap items-center justify-end gap-2 w-full'>
                    <div className='w-[25px] h-[25px] bg-[#1D242B] rounded-full overflow-hidden'>
                        <img src="/image/BedSpacio.png" alt="bedspacio-branch" />
                    </div>
                    <span className='text-[#1D242B]/75 text-[14px]'>{branchData.property_manager}</span>
                </div>
            </div>
        </button>
    )
}