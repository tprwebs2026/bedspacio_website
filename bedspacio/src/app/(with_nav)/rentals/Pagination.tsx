// "use client"

// import Arrow from '@/asset/icon/arrow-down.svg'
// import Link from 'next/link'

// import { usePathname, useSearchParams } from "next/navigation";

// type PageType = {
//     page: number,
//     pageSize: number,
//     totalItems: number,
//     totalPages: number,
//     hasNextPage: boolean,
//     hasPrevPage: boolean,
// }

// type PageProp = {
//     pageDetails: PageType,
//     currentPage: number
// }

// export default function Pagination ({ pageDetails, currentPage }: PageProp) {

//     const pathname = usePathname();
//     const searchParams = useSearchParams();

//     const createPageURL = (pageNumber: number) => {
//         const params = new URLSearchParams(searchParams.toString());
//         params.set("page", String(pageNumber))

//         return `${pathname}?${params.toString()}`;
//     }

//     const prevPage = Math.max(1, currentPage - 1);
//     const nextPage = Math.min(pageDetails.totalPages, currentPage + 1);

//     if (pageDetails.totalItems <= 0) {
//         return null;
//     }

//     return (
//         <div className="flex items-center justify-center w-full px-[1rem] py-[2rem] gap-[1rem]">
//             <Link href={createPageURL(prevPage)} 
//                 className={`${currentPage <= 1 ? 'pointer-events-none opacity-25' : 'opacity-100 hover:bg-[#1D242B]/10 active:bg-[#0077C0]'} cursor-pointer p-1 rounded-[5px] border-2 border-[#1D242B]/25 `}>
//                 <Arrow className="rotate-90 w-[30px] h-[30px] fill-[#1D242B]" />
//             </Link>
//             <div className="flex items-center gap-[0.5rem]">
//                 {Array.from({length: pageDetails.totalPages}, (_, index) => index + 1 ).map((page) => (
//                     <Link href={`/rentals?page=${page}`} key={page} className={`flex items-center justify-center w-[42px] h-[42px] text-[#1D242B] font-bold cursor-pointer  rounded-[5px] border-2 border-[#1D242B]/25 hover:border-[#1D242B] active:bg-[#0077C0] ${page === currentPage ? 'border-[#0077C0] bg-[#0077C0]' : 'border-[#1D242B]/25'}`}>
//                     {page}
//                     </Link>
//                 ))}
//             </div>
//             <Link href={createPageURL(nextPage)}
//                 className={`cursor-pointer p-1 rounded-[5px] border-2 border-[#1D242B]/25 ${pageDetails.totalPages === currentPage ? 'pointer-events-none opacity-25' : 'hover:bg-[#1D242B]/10 active:bg-[#0077C0]'}`}>
//                 <Arrow className="-rotate-90 w-[30px] h-[30px] fill-[#1D242B]" />
//             </Link>
//         </div>
//     )
// }


// -------------- POSTGRES --------------- // 


"use client";

import Arrow from '@/asset/icon/arrow-down.svg';
import Link from 'next/link';
import { usePathname, useSearchParams } from "next/navigation";

type PageType = {
    page: number;
    pageSize: number;
    totalRecords: number;
    totalPage: number;     // ← should be totalPages
};

type PageProp = {
    pageDetails: PageType;
    currentPage: number;
};

export default function Pagination({ pageDetails, currentPage }: PageProp) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const createPageURL = (pageNumber: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", String(pageNumber));
        return `${pathname}?${params.toString()}`;
    };

    const prevPage = Math.max(1, currentPage - 1);
    const nextPage = Math.min(pageDetails.totalPage, currentPage + 1);

    // Don't render if no records
    if (pageDetails.totalRecords <= 0 || pageDetails.totalPage <= 0) {
        return null;
    }

    const isFirstPage = currentPage <= 1;
    const isLastPage = currentPage >= pageDetails.totalPage;

    return (
        <div className="flex items-center justify-center w-full px-[1rem] py-[2rem] gap-[1rem]">
            {/* Previous Button */}
            <Link
                href={createPageURL(prevPage)}
                className={`flex items-center justify-between gap-2 cursor-pointer p-1 min-w-[150px] rounded-[5px] border-2 border-[#1D242B]/25 transition-colors
                    ${isFirstPage 
                        ? 'pointer-events-none opacity-25' 
                        : 'hover:bg-[#1D242B]/10 active:bg-[#0077C0]'
                    }`}
            >
                <Arrow className="rotate-90 w-[30px] h-[30px] fill-[#1D242B]" />
                <span className="pr-2">Previous</span>
            </Link>

            {/* Page Info */}
            <div className="flex items-center gap-[0.5rem]">
                <div className="flex items-center justify-center px-[1rem] h-[42px] text-[#1D242B] font-medium rounded-[5px] border-2 border-[#1D242B]/25">
                    <strong>{currentPage}</strong>
                    <span className="mx-1.5 text-[#1D242B]/60">of</span>
                    <span>{pageDetails.totalPage}</span>
                </div>
            </div>

            {/* Next Button */}
            <Link
                href={createPageURL(nextPage)}
                className={`flex items-center justify-between gap-2 cursor-pointer p-1 min-w-[150px] rounded-[5px] border-2 border-[#1D242B]/25 transition-colors
                    ${isLastPage 
                        ? 'pointer-events-none opacity-25' 
                        : 'hover:bg-[#1D242B]/10 active:bg-[#0077C0]'
                    }`}
            >
                <span className="pl-2">Next</span>
                <Arrow className="-rotate-90 w-[30px] h-[30px] fill-[#1D242B]" />
            </Link>
        </div>
    );
}