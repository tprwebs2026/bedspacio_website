"use client"

import { useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import Search from '@/asset/icon/search.svg'
import Clear from '@/asset/icon/close_image.svg'

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

    const [selectedBranch, setSelectedBranch] = useState(searchParams.get("branch") || "All")
    const [selectedRoomType, setSelectedRoomType] = useState(searchParams.get("room_type") || "All")

    const [minBudget, setMinBudget] = useState(searchParams.get("minimumBudget") || "")
    const [maxBudget, setMaxBudget] = useState(searchParams.get("maximumBudget") || "")


    

    const handleSearch = () => {
        const params = new URLSearchParams(searchParams.toString())
        const selectedBranchObj = branchData.find(
            b => b.id.toString() === selectedBranch
            );

        const slug = selectedBranchObj?.name
            ?.toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-");

        if (selectedBranch && selectedBranch !== "All") {
            params.set("branch", selectedBranch); // ID
            if (slug) params.set("branchName", slug); // NAME
        } else {
            params.delete("branch");
            params.delete("branchName");
        }

        if (selectedRoomType && selectedRoomType !== "All") {
            params.set("room_type", selectedRoomType);
        } else {
            params.delete("room_type");
        }
        if (minBudget) params.set("minimumBudget", minBudget);
        if (maxBudget) params.set("maximumBudget", maxBudget)


        console.log("Parameters: ", params.toString());
        params.set("page", "1");
        router.push(`/rentals?${params.toString()}`)
    }

    const handleFitlerReset = () => {
        const params = new URLSearchParams(searchParams.toString())

        setSelectedBranch("All");
        setSelectedRoomType("All");
        setMinBudget("");
        setMaxBudget("");

        params.delete("branch");
        params.delete("room_type")
        params.delete("minimumBudget");
        params.delete("maximumBudget");

        router.push(`${pathname}?${params.toString()}`);
    }

    const hasAnyFilter =
        selectedBranch !== "All" ||
        selectedRoomType !== "All" ||
        minBudget !== "" ||
        maxBudget !== "";

    return (
        <div className="relative flex flex-col xl:flex-row lg:flex-row  items-end justify-center rounded-[10px] w-fit gap-4 xl:gap-2 lg:gap-1">

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

            <div className="flex flex-col xl:flex-row lg:flex-row gap-1 w-full xl:w-auto lg:w-auto ">
                <button
                    type="button"
                    onClick={handleSearch}
                    className="flex items-center gap-2 w-full rounded-[5px] bg-[#1D242B] cursor-pointer hover:bg-[#1D242B]/75 active:bg-[#1D242B] xl:active:bg-[#1D242B] lg:active:bg-[#1D242B] text-[#FAFAFA] h-[50px] px-4 pr-6 py-4 font-bold transition-all duration-100"
                    >
                        <Search className="stroke-[#FAFAFA] h-[20px] w-[20px] fill-[#FAFAFA]" />
                        <span className="text-[18px] whitespace-nowrap">Search</span>
                </button>

                {hasAnyFilter  && (
                    <button onClick={handleFitlerReset} className="flex items-center gap-2 w-full rounded-[5px] bg-[#1D242B] cursor-pointer hover:bg-[#1D242B]/80 active:bg-[#1D242B] xl:active:bg-[#1D242B] lg:active:bg-[#1D242B] text-[#FAFAFA] h-[50px] px-3 py-4 font-bold transition-all duration-100">
                        <Clear className="w-[20px] h-[20px]" />
                        Clear
                    </button>
                )}
            </div>


        </div>
    )
}