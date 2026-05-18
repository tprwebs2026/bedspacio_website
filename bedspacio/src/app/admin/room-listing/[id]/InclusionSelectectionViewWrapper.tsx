// "use client"

// import { useState } from "react"
// import { InclusionViewType, BranchViewType } from "./page"

// interface InclusionProp {
//     inclusions: InclusionViewType[];
//     selectedInclusions: number[]
//     setSelectedInclusions: React.Dispatch<React.SetStateAction<number[]>>;
// }

// export default function InclusionSelectionViewWrapper ({ inclusions, selectedInclusions, setSelectedInclusions }: InclusionProp) {

//     const [isSelected, setIsSelected] = useState<number[]>(selectedInclusions);

//     console.log('The selection: ', isSelected);
    
//     const handleInclusionChange = (id: number) => {
//         setIsSelected(prev => {
//             const updated = prev.includes(id)
//                 ? prev.filter(item => item !== id)
//                 : [...prev, id]

//             setSelectedInclusions(updated);
//             return updated;
//         });
//     };



//     return (
//         <div className="flex items-center gap-1 w-full">

//             {inclusions.map(inc => (
//                 <label key={inc.id} htmlFor={`inc_${inc.id}`} className={`px-3 py-2 rounded-[10px] border-2  ${isSelected.includes(inc.id) ? 'bg-[#1D242B] text-[#FAFAFA]' : 'border-[#1D242B] hover:bg-[#1D242B]/10 active:bg-[#FAFAFA]'} cursor-pointer `}>
//                     <span className="font-bold cursor-pointer">{inc.inclusion}</span> 
//                     <input type="checkbox" name="inc" id={`inc_${inc.id}`} value={inc.inclusion} checked={isSelected.includes(inc.id)} onChange={() => handleInclusionChange(inc.id)} hidden className="cursor-pointer"/>
//                 </label>
//             ))}
//         </div>
//     )
// }



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