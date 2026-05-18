"use client"

import { useState } from "react"
import { BranchType } from "./CreateRoomPageWrapper"

interface BranchSelectionProp {
    branches: BranchType[];
    selectedBranch: number | null;
    setSelectedBranch: React.Dispatch<React.SetStateAction<number | null>>;
}

export default function BranchSelectionWrapper ({ branches, selectedBranch, setSelectedBranch }: BranchSelectionProp) {
    const [branchSelected, setBranchSelected] = useState<number>(Number(selectedBranch))

    console.log('Branch: ', branches);

    const selectedBranchData = branches.find(
        branch => branch.branch_id === selectedBranch
    )

    return (
        <>
            <div className="flex items-center gap-1 w-full">
                <span>Branch</span>

                {/* Will map all branch later on */}
                <select name="branch" id="branch_selection" value={branchSelected}
                onChange={(e) => setSelectedBranch(Number(e.target.value))}
                className="w-full p-2 border border-[#1D242B]/50 bg-[#FAFAFA] rounded-[10px] focus:outline-[#0077C0] font-bold">
                    <option hidden>Select branch</option>
                    {branches.map(branch => (
                        <option key={branch?.branch_id} value={branch?.branch_id}>{branch?.branch_name}</option>
                    ))}
                </select>
            </div>

            {selectedBranchData && (
                <div className="flex items-center gap-1 w-full">
                    <span className="whitespace-nowrap">Assigned Property Manager</span>

                    {/* Will map all property managers later on */}
                    <div className="w-full p-2 border border-[#1D242B]/50 bg-[#FAFAFA] rounded-[10px] focus:outline-[#0077C0]">
                        <span className="font-bold">{selectedBranchData?.property_manager}</span>
                    </div>
                </div>
            )}
        </>
    )
}