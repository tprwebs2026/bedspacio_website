"use client"

import { useState } from "react"
import { InclusionType } from "./CreateRoomPageWrapper"

interface InclusionProp {
    inclusions: InclusionType[];
    selectedInclusions: number[];
    setSelectedInclusions: React.Dispatch<React.SetStateAction<number[]>>;
    singleSelect?: boolean;
}

export default function InclusionSelectionWrapper({
    inclusions,
    selectedInclusions,
    setSelectedInclusions,
    singleSelect = false
}: InclusionProp) {

    const [isSelected, setIsSelected] = useState<number[]>([]);

    // const handleInclusionChange = (id: number) => {
    //     setIsSelected(prev => {
    //         let updated: number[];

    //         if (singleSelect) {
    //             updated = prev.includes(id) ? [] : [id];
    //         } else {
    //             updated = prev.includes(id)
    //                 ? prev.filter(item => item !== id)
    //                 : [...prev, id];
    //         }

    //         selectedInclusions(updated);
    //         return updated;
    //     });
    // };

    const handleInclusionChange = (id: number) => {
        if (singleSelect) {
            setSelectedInclusions(prev =>
                prev.includes(id) ? [] : [id]
            );
        } else {
            setSelectedInclusions(prev =>
                prev.includes(id)
                    ? prev.filter(item => item !== id)
                    : [...prev, id]
            );
        }
    };

    return (
        <div className="flex items-center gap-1 w-full">
            {inclusions.map(inc => (
                <label
                    key={inc.id}
                    htmlFor={`inc_${inc.id}`}
                    className={`px-3 py-2 rounded-[10px] border-2 ${
                        selectedInclusions.includes(inc.id)
                            ? 'bg-[#1D242B] text-[#FAFAFA]'
                            : 'border-[#1D242B] hover:bg-[#1D242B]/10 active:bg-[#FAFAFA]'
                    } cursor-pointer`}
                >
                    <span className="font-bold">{inc.inclusion}</span>

                    <input
                        type={singleSelect ? "radio" : "checkbox"}
                        name="inc"
                        id={`inc_${inc.id}`}
                        checked={selectedInclusions.includes(inc.id)}
                        onChange={() => handleInclusionChange(inc.id)}
                        hidden
                    />
                </label>
            ))}
        </div>
    );
}