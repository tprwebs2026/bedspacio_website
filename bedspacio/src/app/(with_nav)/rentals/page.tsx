// -------------- POSTGRES ---------------- //

import SearchFilter from "@/components/SearchFilter"
import ListingCard, { ListingDetail } from "./ListingCard"

import { getRoomPreviews } from "../../../../lib/room";
import { getRoomListings } from "../../../../lib/room";
import { getInclusions } from "../../../../lib/inclusion";
import InclusionFilter from "./InclusionFilter";
import Pagination from "./Pagination";
import Breadcrumbs from "@/components/BreadCrumb"

import { Metadata } from "next";
import { getRentalsPageBanner } from "../../../../lib/content";
import { BASE_URL } from "@/config/config";

export const metadata: Metadata = {
    title: "Rentals | BedSpacio",
    description: 'Add later'
}


export default async function Rentals({ searchParams }: { searchParams: Promise <{ 
    branch?: string, 
    room_type?: string, 
    minimumBudget?: string,
    maximumBudget?: string, 
    page?: string,
    inclusion?: string[]
}>
}) {

    const bannerImage = await getRentalsPageBanner();
    
    const params = await searchParams;
    const page = Math.max(Number(params.page ?? "1"), 1);
    const query = new URLSearchParams();

    const inclusion = params.inclusion
    ? Array.isArray(params.inclusion)
        ? params.inclusion
        : [params.inclusion]
    : undefined;

    const rooms = await getRoomPreviews({
        page, // page number
        pageSize: 16, // limit
        room_type: params.room_type, // room type (choose only one)
        branch: params.branch ? Number(params.branch) : undefined, // branch
        minimumBudget: params.minimumBudget ? Number(params.minimumBudget) : undefined, 
        maximumBudget: params.minimumBudget ? Number(params.maximumBudget) : undefined,
        inclusion,
    });

    const inclusionList = await getInclusions();

    
    query.set("page", String(page));

    return (
        <div className="flex flex-col items-center justify-start min-h-screen w-full bg-[#FAFAFA] px-0 xl:px-[8rem] lg:px-[4rem]">

            <div className="hidden xl:flex lg:flex items-center justify-start w-full py-[1rem]">
                <Breadcrumbs />
            </div>

            <section className="relative flex flex-col items-center justify-center w-full h-auto bg-[#1D242B] py-[2rem] px-[1rem] xl:px-0 lg:px-0 md:px-0 rounded-0 xl:rounded-[5px] lg:rounded-[5px]">
                <span className="text-[#0077C0] text-[32px] font-bold">Customise Filter</span>
                <img src={`${BASE_URL}/file/content/rentals/${bannerImage.asset_url}`} alt="rentals-header-image"  className="absolute inset-0 w-full h-full object-cover opacity-25"/>

                <SearchFilter />    
            </section>


            <section className="flex flex-col items-start justify-start w-full h-auto py-[1rem] px-[1rem] xl:px-0 lg:px-0">
                <div className="flex flex-col xl:flex-row lg:flex-row items-start justify-between py-[0.5rem] gap-2 w-full border-b border-b-[#0077C0]/50">
                    <div className="flex items-center gap-2">
                        <span className="text-[#1D242B] text-[24px] font-bold whitespace-nowrap">Explore Listings</span>
                        <div className="flex items-center justify-center leading-0 font-bold size-8 rounded-full bg-[#0077C0] text-[#FAFAFA]">
                            {rooms.pagination.totalRecords}
                        </div>
                    </div>
                    <InclusionFilter  inclusionList={inclusionList} />
                </div>

                    {rooms.pagination.totalItems === 0 ? (
                        <div className="flex items-center justify-center w-full py-[2rem]">
                            <span className="text-[#1D242B] text-[24px] font-bold text-center">No listings found that match your preferences. <br/> Try adjusting your filters.</span>
                        </div>
                    ) : (
                        rooms.data.length > 0 ? (
                            <div className="grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 w-full gap-[0.5rem] py-[1rem]">
                                {rooms.data.map((room: ListingDetail) => (
                                        <ListingCard key={room.id} detail={room} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center w-full h-[200px]">
                                <span className="text-[18px] text-[#1D242B] font-bold">No listings yet ...</span>
                            </div>
                        )
                    )}
            </section>

            {rooms.pagination && (
                <Pagination 
                    pageDetails={rooms.pagination}
                    currentPage = {page}
                />
            )}
        </div>
    )
}