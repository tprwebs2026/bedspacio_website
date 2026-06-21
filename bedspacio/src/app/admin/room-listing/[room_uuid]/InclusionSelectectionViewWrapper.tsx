"use client"

import { InclusionViewType } from "./page";

interface InclusionProp {
    inclusions: InclusionViewType[];
    selectedInclusions: number[];
    setSelectedInclusions: React.Dispatch<
        React.SetStateAction<number[]>
    >;
}

export default function InclusionSelectionViewWrapper({
    inclusions,
    selectedInclusions,
    setSelectedInclusions
}: InclusionProp) {

    const handleInclusionChange = (id: number) => {
        setSelectedInclusions((prev) =>
            prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id]
        );
    };

    return (
        <div className="flex items-center gap-1 w-full flex-wrap">
            {inclusions.map((inc) => (
                <label
                    key={inc.id}
                    htmlFor={`inc_${inc.id}`}
                    className={`px-3 py-2 rounded-[10px] border-2 cursor-pointer
                        ${
                            selectedInclusions.includes(inc.id)
                                ? "bg-[#1D242B] text-[#FAFAFA] border-[#1D242B]"
                                : "border-[#1D242B] hover:bg-[#1D242B]/10 active:bg-[#FAFAFA]"
                        }`}
                >
                    <span className="font-bold">
                        {inc.inclusion}
                    </span>

                    <input
                        type="checkbox"
                        id={`inc_${inc.id}`}
                        checked={selectedInclusions.includes(
                            inc.id
                        )}
                        onChange={() =>
                            handleInclusionChange(inc.id)
                        }
                        hidden
                    />
                </label>
            ))}
        </div>
    );
}