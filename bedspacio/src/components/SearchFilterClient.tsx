"use client"

import { useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import Search from '@/asset/icon/search.svg'

// COMPONENT
import BranchSelection from "@/app/(with_nav)/rentals/BranchesSelection";
import RoomTypeSelection from "@/app/(with_nav)/rentals/RoomTypeSelection";
import BudgetInput from "@/app/(with_nav)/rentals/BudgetInput";

type Branches = {
    id: number,
    name: string
}

type BranchProp = {
    branchData: Branches[]
}

export default function SearchFilterClient ({ branchData }: BranchProp) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const [selectedBranch, setSelectedBranch] = useState(searchParams.get("branch") || "")
    const [selectedRoomType, setSelectedRoomType] = useState(searchParams.get("room_type") || "")

    const [minBudget, setMinBudget] = useState(searchParams.get("minimumBudget") || "")
    const [maxBudget, setMaxBudget] = useState(searchParams.get("maximumBudget") || "")

    const handleSearch = () => {
        const params = new URLSearchParams(searchParams.toString())

        if (selectedBranch) params.set("branch", selectedBranch)
        if (selectedRoomType) params.set("room_type", selectedRoomType)
        if (minBudget) params.set("minimumBudget", minBudget);
        if (maxBudget) params.set("maximumBudget", maxBudget)


        console.log("Parameters: ", params.toString());
        params.set("page", "1");
        router.push(`/rentals?${params.toString()}`)
    }

    const handleFitlerReset = () => {
        const params = new URLSearchParams(searchParams.toString())

        setSelectedBranch("");
        setSelectedRoomType("");
        setMinBudget("");
        setMaxBudget("");

        params.delete("branch");
        params.delete("room_type")
        params.delete("minimumBudget");
        params.delete("maximumBudget");

        router.push(`${pathname}?${params.toString()}`);
    }

    const hasAnyFilter =
        selectedBranch !== "" ||
        selectedRoomType !== "" ||
        minBudget !== "" ||
        maxBudget !== "";

    return (
        <div className="relative flex flex-col xl:flex-row lg:flex-row md:flex-col items-center justify-center rounded-[10px] w-fit gap-1">

            <BranchSelection 
                branchData={branchData}
                selectedBranch={selectedBranch}
                setSelectedBranch={setSelectedBranch}
            />
            <RoomTypeSelection 
                selectedRoomType={selectedRoomType}
                setSelectedRoomType={setSelectedRoomType}
            />
            <BudgetInput 
                minBudget={minBudget}
                maxBudget={maxBudget}
                setMinBudget={setMinBudget}
                setMaxBudget={setMaxBudget}
            />

            {hasAnyFilter && (
                <button onClick={handleFitlerReset} className="absolute -top-10 right-2 flex items-center gap-1 font-bold text-[#FAFAFA] hover:opacity-75 active:text-[#FAFAFA] cursor-pointer active:text-[#FF0000] transition-all duration-100">
                    Clear Filter
                </button>
            )}

            <button
                type="button"
                onClick={handleSearch}
                className="flex items-center gap-2 w-full xl:w-auto lg:w-auto rounded-[15px] bg-[#1D242B] cursor-pointer hover:bg-[#0077C0] active:bg-[#0077C0] xl:active:bg-[#1D242B] lg:active:bg-[#1D242B] text-[#FAFAFA] h-full px-3 py-3 text-[16px] font-bold border-2 border-[#FAFAFA] transition-all duration-100"
                >
                    <Search className="stroke-[#FAFAFA] h-[20px] w-[20px] fill-[#FAFAFA]" />
                    <span className="text-[18px] whitespace-nowrap">Find a Room</span>
            </button>
        </div>
    )
}