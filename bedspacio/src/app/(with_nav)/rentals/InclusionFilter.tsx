// "use client"

// import Closefrom from '@/asset/icon/close_image.svg'

// import { useState } from "react"
// import { usePathname, useSearchParams, useRouter } from "next/navigation"

// export type Inclusions = {
//     id: number, 
//     name: string,
//     slug: string
// }

// export type InclusionProps = {
//     inclusionList: Inclusions[]
// }

// export default function InclusionSelection ({ inclusionList }: InclusionProps ) {
    
//     const searchParams = useSearchParams();
//     const pathname = usePathname();
//     const router = useRouter();

//     const incList = searchParams.getAll("inclusion")


//     const handleInclusionFilter = (e: React.ChangeEvent<HTMLInputElement>, slug:string) => {
//         const checked = e.target.checked;

//         const updatedList = checked
//             ? [...incList, slug]
//             : incList.filter((i) => i !== slug);


//         const params = new URLSearchParams(searchParams.toString());
//         params.delete("inclusion");
//         updatedList.forEach((value) => params.append("inclusion", String(value)))

//         params.set("page", "1");
//         router.push(`${pathname}?${params.toString()}`); 
//     }

//     const handleInclusionFilterReset = () => {
//         const params = new URLSearchParams(searchParams.toString());
//         params.delete("inclusion")

//         router.push(`${pathname}?${params.toString()}`); 
//     }


//     return (
//         <div className="flex flex-wrap items-center justify-start gap-2">
//             {inclusionList.map(inc => (
//                 <label key={inc.id} htmlFor={`inclusion_${inc.slug}`} className={`flex items-center justify-center px-3 py-1 rounded-full cursor-pointer text-[12px] xl:text-[16px] lg:text-[16px] hover:-translate-y-1 active:bg-[#1D242B] xl:active:translate-y-1 lg:active:translate-y-1 ${incList.includes(inc.slug) ? 'bg-[#0077C0] text-[#FAFAFA] border-2 border-[#0077C0] font-bold' : 'border-2 border-[#1D242B] text-[#1D242B] font-bold'} transition-all duration-100`}>
//                     <input type="checkbox" onChange={(e) => handleInclusionFilter(e, inc.slug)} name="inclusion" id={`inclusion_${inc.slug}`} hidden
//                     checked={incList.includes(inc.slug)}/>
//                     <span>{inc.name}</span>
//                 </label>
//             ))}
//             {incList.length > 0 && (
//                 <button onClick={handleInclusionFilterReset}
//                 className="flex items-center gap-1 rounded-full font-bold bg-[#1D242B] text-[#FAFAFA] font-bold px-3 py-1 cursor-pointer active:bg-[#1D242B]/25 border-2 border-[#1D242B]">
//                     <Closefrom className="w-[20px] h-[20px]" />
//                     clear filter
//                 </button>
//             )}
//         </div>
//     )
// }


// ------------------ POSTGRES ------------------ //


"use client"

import Closefrom from '@/asset/icon/close_image.svg'

import { useState } from "react"
import { usePathname, useSearchParams, useRouter } from "next/navigation"

export type Inclusions = {
    id: number, 
    inclusion: string,
    slug: string
}

export type InclusionProps = {
    inclusionList: Inclusions[]
}

export default function InclusionFilter ({ inclusionList }: InclusionProps ) {
    
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    const incList = searchParams.getAll("inclusion")


    const handleInclusionFilter = (e: React.ChangeEvent<HTMLInputElement>, slug:string) => {
        const checked = e.target.checked;

        const updatedList = checked
            ? [...incList, slug]
            : incList.filter((i) => i !== slug);


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
        <div className="flex flex-wrap items-center justify-start gap-2">
            {inclusionList.map(inc => (
                <label key={inc.id} htmlFor={`inclusion_${inc.slug}`} className={`flex items-center justify-center px-3 py-1 rounded-full cursor-pointer text-[12px] xl:text-[16px] lg:text-[16px] hover:-translate-y-1 active:bg-[#1D242B] xl:active:translate-y-1 lg:active:translate-y-1 ${incList.includes(inc.slug) ? 'bg-[#0077C0] text-[#FAFAFA] border-2 border-[#0077C0] font-bold' : 'border-2 border-[#1D242B] text-[#1D242B] font-bold'} transition-all duration-100`}>
                    <input type="checkbox" onChange={(e) => handleInclusionFilter(e, inc.slug)} name="inclusion" id={`inclusion_${inc.slug}`} hidden
                    checked={incList.includes(inc.slug)}/>
                    <span>{inc.inclusion}</span>
                </label>
            ))}
            {incList.length > 0 && (
                <button onClick={handleInclusionFilterReset}
                className="flex items-center gap-1 rounded-full font-bold bg-[#1D242B] text-[#FAFAFA] font-bold px-3 py-1 cursor-pointer active:bg-[#1D242B]/25 border-2 border-[#1D242B]">
                    <Closefrom className="w-[20px] h-[20px]" />
                    clear filter
                </button>
            )}
        </div>
    )
}