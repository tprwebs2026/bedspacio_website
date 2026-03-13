"use client"

import { useState } from "react"

import ArrowDown from '@/asset/icon/arrow-down.svg'

type BranchInfo = {
    id: number,
    name: string
}

type BranchProps = {
    branchData: BranchInfo[],
    selectedBranch: string
    setSelectedBranch: React.Dispatch<React.SetStateAction<string>>
}

export default function BranchSelection ({ branchData, selectedBranch, setSelectedBranch }: BranchProps) {
    const [ openBranch, setOpenBranch ] = useState<Boolean>(false);
    
    return (
        <div className='relative flex flex-col items-start justify-start w-full xl:w-[350px] lg:w-[250px] rounded-[10px]'>
            <button onClick={() => setOpenBranch(prev => !prev)} className={`flex items-center justify-between text-[18px] font-bold p-3 cursor-pointer hover:bg-[#C7EEFF] active:bg-[#C7EEFF] rounded-[10px] w-full ${selectedBranch ? 'border-2 border-[#1D242B] bg-[#FAFAFA]' : 'border-2 border-[#FAFAFA] text-[#1D242B]  bg-[#FAFAFA]'}`}>
                <span className='text-left whitespace-nowrap w-[225px] truncate'>{!selectedBranch ? 'Choose a branch' : selectedBranch}</span>
                <ArrowDown className={`${openBranch && 'rotate-180'} w-[30px] h-auto transition-all duration-100`} />
            </button>

            {openBranch && (
                <div className='absolute top-15 z-20 flex flex-col items-start justify-start w-full rounded-[10px] bg-[#FAFAFA] overflow-hidden'>
                    <div className='flex flex-col w-full'>
                    {branchData.map((branch, index) => (
                            <span key={branch.id} onClick={() => {setSelectedBranch(branch.name); setOpenBranch(false) }} className='p-3 text-[#0077C0] text-[16px] font-bold cursor-pointer hover:bg-[#C7EEFF] active:bg-[#C7EEFF] w-full'>{branch.name}</span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}