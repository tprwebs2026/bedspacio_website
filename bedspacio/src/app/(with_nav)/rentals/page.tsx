
import SearchFilter from "@/components/SearchFilter"
import ListingCard, { ListingDetail } from "./ListingCard"


import { getRoomListings, getInclusions } from "../../../../lib/room";
import InclusionSelection from "./InclusionFilter";
import Pagination from "./Pagination";


// MAKE THIS an "async" function later when fetching data

/*
    ----- THIS IS AN EXAMPLE ----- 

    export default async function ListingsPage() {
        const res = await fetch("http://localhost:5000/api/listings", {
            cache: "no-store",
        });

        const listings = await res.json();

        return (
            <div>
            {listings.map((listing: any) => (
                <Link
                key={listing.id}
                href={`/listings/${listing.id}`}
                >
                <div>{listing.name}</div>
                </Link>
            ))}
            </div>
        );
    }

    ----- THIS IS AN EXAMPLE ----- 
*/

type Pagination = {
    page: number,
    pageSize: number,
    totalItems: number,
    totalPages: number,
    hasNextPage: boolean,
    hasPrevPage: boolean,
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
    
    const params = await searchParams;
    const page = Math.max(Number(params.page ?? "1"), 1);
    const query = new URLSearchParams();

    const inclusion = params.inclusion
    ? Array.isArray(params.inclusion)
        ? params.inclusion
        : [params.inclusion]
    : undefined;

    const roomListings = await getRoomListings({
        page, // page number
        pageSize: 8, // limit
        room_type: params.room_type, // room type (choose only one)
        branch: params.branch ? Number(params.branch) : undefined, // branch
        minimumBudget: params.minimumBudget ? Number(params.minimumBudget) : undefined, 
        maximumBudget: params.minimumBudget ? Number(params.maximumBudget) : undefined,
        inclusion,
    });

    const inclusionList = await getInclusions();

    console.table({
        parameter: [
            params.branch,
            params.room_type,
            params.minimumBudget,
            params.maximumBudget,
            params.inclusion
        ]
    });
    
    query.set("page", String(page));


    return (
        <div className="flex flex-col items-center justify-start min-h-screen w-full bg-[#FAFAFA]">
            <section className="relative flex flex-col items-center justify-center w-full h-screen xl:h-[400px] lg:h-[400px] md:h-screen bg-[#C7EEFF]">
                <img src="/asset/rentas_bg_image.jpg" alt="rentals-header-image"  className="absolute inset-0 w-full h-full object-cover opacity-50"/>

                <div className="absolute flex flex-col w-full h-full items-center justify-center gap-[8rem] xl:gap-[2rem] lg:gap-[2rem] md:gap-[1rem] px-[1rem] xl:px-[8rem] lg:px-[8rem] md:px-[4rem]">
                    <span className="text-[32px] text-[#1D242B] text-center font-[900] leading-[1]">Explore all {roomListings.pagination.totalItems} of our listings</span>
                    <div className="flex flex-col items-center justify-center gap-[2rem] w-full">
                        <SearchFilter />
                        <InclusionSelection  inclusionList={inclusionList} />
                    </div>
                </div>

            </section>


            <section className="flex flex-col items-start justify-start w-full h-auto p-[1rem] xl:px-[8rem] lg:px-[4rem]">
                <div className="flex items-center justify-start py-[0.5rem] w-full border-b border-b-[#0077C0]/50">
                    <span className="text-[#1D242B] text-[24px] font-bold">Explore Listings</span>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 w-full gap-[0.5rem] py-[1rem]">
                    {roomListings.items.map((room: ListingDetail) => (
                        <ListingCard key={room.id} detail={room} />
                    ))}
                </div>

            </section>

            {roomListings.pagination && (
                <Pagination 
                    pageDetails={roomListings.pagination}
                    currentPage = {page}
                />
            )}
        </div>
    )
}