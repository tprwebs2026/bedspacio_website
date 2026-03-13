"use client"

import Closefrom from '@/asset/icon/close_image.svg'

import { useState } from "react"
import { usePathname, useSearchParams, useRouter } from "next/navigation"

export type Inclusions = {
    id: number, 
    name: string
}

export type InclusionProps = {
    inclusionList: Inclusions[]
}

export default function InclusionSelection ({ inclusionList }: InclusionProps ) {
    
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    const incList = searchParams.getAll("inclusion").map(Number);


    const handleInclusionFilter = (e: React.ChangeEvent<HTMLInputElement>, id:number) => {
        const checked = e.target.checked;

        const updatedList = checked
            ? [...incList, id]
            : incList.filter((i) => i !== id);

        const params = new URLSearchParams(searchParams.toString());
        params.delete("inclusion");
        updatedList.forEach((value) => params.append("inclusion", String(value)))

        params.set("page", "1");
        router.push(`${pathname}?${params.toString()}`); 
    }

    const handleInclusionFilterReset = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("inclusion")

        router.push(`${pathname}?${params.toString()}`); 
    }


    return (
        <div className="flex flex-wrap items-center justify-center w-full gap-2">
            {inclusionList.map(inc => (
                <label key={inc.id} htmlFor={`inclusion_${inc.id}`} className={`flex items-center justify-center px-4 py-2 rounded-full cursor-pointer hover:-translate-y-1 active:bg-[#1D242B] xl:active:translate-y-1 lg:active:translate-y-1 ${incList.includes(inc.id) ? 'bg-[#0077C0] text-[#FAFAFA] font-bold' : 'bg-[#1D242B] text-[#FAFAFA]'} transition-all duration-100`}>
                    <input type="checkbox" onChange={(e) => handleInclusionFilter(e, inc.id)} name="inclusion" id={`inclusion_${inc.id}`} hidden
                    checked={incList.includes(inc.id)}/>
                    <span>{inc.name}</span>
                </label>
            ))}
            {incList.length > 0 && (
                <button onClick={handleInclusionFilterReset}
                className="flex items-center gap-1 bg-[#FAFAFA] rounded-full font-bold text-[#1D242B] px-4 py-2 cursor-pointer active:bg-[#1D242B]/25">
                    <Closefrom className="w-[20px] h-[20px]" />
                    clear filter
                </button>
            )}
        </div>
    )
}