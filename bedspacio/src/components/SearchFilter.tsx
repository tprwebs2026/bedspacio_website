"use client"

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

import FilterIcon from '@/asset/icon/filter.svg'
import Search from '@/asset/icon/search.svg'
import ArrowDown from '@/asset/icon/arrow-down.svg'


export default function SearchFilter() {
    const regex = /^\d*\.?\d*$/;

    const searchParams = useSearchParams();


    const [openBranch, setOpenBranch] = useState<boolean>(false);
    const [openRoomType, setOpenRoomType] = useState<boolean>(false);

    const [selectedBranch, setSelectedBranch] = useState<string>('');
    const [selectedRoomType, setSelectedRoomType] = useState<string>('');
    const [budget, setBudget] = useState<string>('')

    useEffect(() => {
        const branchParams = searchParams.get("branch") ?? "";
        const roomTypeParams = searchParams.get("room_type") ?? "";
        const budgetParams = searchParams.get("budget") ?? "";

        setSelectedBranch(branchParams);
        setSelectedRoomType(roomTypeParams);
        setBudget(budgetParams);
    }, [ searchParams ]);

    const branches = [{
        branch_1: 'Branch 1',
        branch_2: 'Branch 2',
        branch_3: 'Branch 3'
    }];

    const room_type = [ 'Bedspace', 'Apartment' ];
    
    const href = useMemo(() => {
        const params = new URLSearchParams();

        if (selectedBranch) params.set('branch', selectedBranch);
        if (selectedRoomType) params.set('room_type', selectedRoomType);
        if (budget) params.set('budget', budget);

        const parameters = params.toString();
        return parameters ? `/rentals?${parameters}` : '/rentals';
    }, [selectedBranch, selectedRoomType, budget])

    const getSearchDetail = () => {
        console.log('Filter: ',selectedBranch, selectedRoomType, budget)
    }


    return (
        <div className="relative flex flex-col xl:flex-row lg:flex-row md:flex-col items-center justify-center w-full gap-2">
            <div className="flex flex-col xl:flex-row lg:flex-row md:flex-col items-center rounded-[10px] xl:rounded-full lg:rounded-full w-full xl:w-auto lg:w-auto gap-1">

                {/* Choose a branch */}
                <div className='relative flex flex-col items-start justify-start w-full xl:min-w-[250px] lg:min-w-[250px] rounded-[10px]'>
                    <button onClick={() => setOpenBranch(prev => !prev)} className={`flex items-center justify-between text-[18px] font-bold p-3 cursor-pointer hover:bg-[#C7EEFF] active:bg-[#C7EEFF] rounded-[10px] w-full ${selectedBranch ? 'border-2 border-[#1D242B] bg-[#FAFAFA]' : 'border-2 border-[#FAFAFA] text-[#1D242B]  bg-[#FAFAFA]'}`}>
                        <span className='whitespace-nowrap'>{!selectedBranch ? 'Choose a branch' : selectedBranch}</span>
                        <ArrowDown className={`${openBranch && 'rotate-180'} w-[30px] h-auto transition-all duration-100`} />
                    </button>

                    {openBranch && (
                        <div className='absolute top-15 z-20 flex flex-col items-start justify-start w-full rounded-[10px] bg-[#FAFAFA] overflow-hidden'>
                            {branches.map((branch, index) => (
                                <div key={index} className='flex flex-col w-full'>
                                    <span onClick={() => {setSelectedBranch(branch.branch_1); setOpenBranch(false) }} className='p-3 text-[#0077C0] text-[16px] font-bold cursor-pointer hover:bg-[#C7EEFF] active:bg-[#C7EEFF] w-full'>{branch.branch_1}</span>
                                    <span onClick={() => {setSelectedBranch(branch.branch_2); setOpenBranch(false) }} className='p-3 text-[#0077C0] text-[16px] font-bold cursor-pointer hover:bg-[#C7EEFF] w-full'>{branch.branch_2}</span>
                                    <span onClick={() => {setSelectedBranch(branch.branch_3); setOpenBranch(false) }} className='p-3 text-[#0077C0] text-[16px] font-bold cursor-pointer hover:bg-[#C7EEFF] w-full'>{branch.branch_3}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Choose a branch */}
                <div className='relative flex flex-col items-start justify-between w-full xl:min-w-[300px] lg:min-w-[300px] lg:min-w-[250px] lg:min-w-[250px] rounded-[10px]'>
                    <button onClick={() => setOpenRoomType(prev => !prev)} className={`flex items-center justify-between text-[18px] font-bold p-3 cursor-pointer  hover:bg-[#C7EEFF] active:bg-[#C7EEFF] rounded-[10px] w-full ${selectedRoomType ? 'border-2 border-[#1D242B] bg-[#FAFAFA]' : 'border-2 border-[#FAFAFA] text-[#1D242B] bg-[#FAFAFA]'}`}>
                        <span>{!selectedRoomType ? 'Choose room type' : selectedRoomType}</span>
                        <ArrowDown className={`${openRoomType && 'rotate-180'} w-[30px] h-auto transition-all duration-100`} />
                    </button>

                    {openRoomType && (
                        <div className='absolute top-15 z-10 flex flex-col items-start justify-start bg-[#FAFAFA] w-full rounded-[10px] overflow-hidden'>
                            {room_type.map((type, index) => (
                                <div key={index} className='flex flex-col w-full'>
                                    <span onClick={() => {setSelectedRoomType(type); setOpenRoomType(false) }} className='p-3 text-[#0077C0] text-[16px] font-bold cursor-pointer hover:bg-[#C7EEFF] active:bg-[#C7EEFF] w-full'>{type}</span>
                                    
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Enter budget */}
                <div className={`relative flex flex-col items-start justify-between w-full xl:min-w-[250px] lg:min-w-[250px] lg:min-w-[250px] `}>
                    <input type="text" name="budget" id="budget" placeholder="Enter your Budget" value={budget} 
                    onChange={(e) => {
                        if (regex.test(e.target.value)) {
                            setBudget(e.target.value)
                        }
                    }}
                    className={`text-[#1D242B] p-3 rounded-[10px] text-[18px] font-bold w-full focus:outline-none ${budget ? 'border-2 border-[#1D242B] bg-[#FAFAFA]' : 'border-2 border-[#FAFAFA] text-[#1D242B] bg-[#FAFAFA]'}`}/>
                </div>
            </div>

            <Link href={href} onClick={getSearchDetail} className='flex items-center gap-2 w-full xl:w-auto lg:w-auto rounded-[15px] bg-[#1D242B] cursor-pointer hover:bg-[#0077C0] active:bg-[#0077C0] xl:active:bg-[#1D242B] lg:active:bg-[#1D242B] text-[#FAFAFA] h-full px-3 py-2 text-[16px] font-bold border-2 border-[#FAFAFA] transition-all duration-100'>
                <Search className="stroke-[#FAFAFA] h-[20px] w-[20px] fill-[#FAFAFA] color-[#FAFAFA]"/>
                <span className='text-[18px] whitespace-nowrap'>Find a Room</span>
            </Link>
        </div>
    )
}