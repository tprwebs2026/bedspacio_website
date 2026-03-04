
import Link from "next/link"
import { styleText } from "util"

type Branch = {
    id: number,
    name: string
}

type Inclusions = {
    id: number,
    name: string
}

export type ListingDetail = {
    id: number,
    room_name: string,
    room_type: string,
    gender: string,
    price: string,
    branch_id: Branch,
    inclusions: Inclusions[],
    thumbnail: string,
    thumbnail_image_id: number
}

type ListingDetailProps = {
    detail: ListingDetail
}

export default function ListingCard ({ detail }: ListingDetailProps) {

    return (
        <Link key={detail.id} href={`/rentals/${detail.id}`} className="group flex flex-col items-center h-full bg-[#FAFAFA] rounded-[10px] p-3 gap-2 border-1 border-[#1D242B]/25 cursor-pointer hover:border-[#1D242B] transition-all duration-100">
            <div className="relative flex items-center justify-center w-full min-h-[300px] bg-[#C7EEFF] rounded-[5px]">
                <div className="absolute top-2 left-2 flex items-center px-2 py-1 rounded-[5px] bg-[#1D242B] gap-1 z-10">
                    <span className="text-[12px] text-[#FAFAFA]">{detail.room_type}</span>
                    <span className="text-[12px] text-[#FAFAFA]">|</span>
                    <span className="text-[12px] text-[#FAFAFA]">{detail.gender}</span>
                </div>

                <div className="flex w-full h-full text-[#FAFAFA] rounded-[5px] overflow-hidden">
                    <img loading="lazy" src={`data:image/webp;base64,${detail.thumbnail}`} alt="thumbnail" className="group-hover:scale-102 transition-all duration-100 w-full h-full object-cover"/>
                </div>
            </div>

            <div className="flex flex-col items-start justify-between h-full w-full gap-2">
                <span className="text-[20px] text-[#1D242B] font-bold leading-[1]">
                    {detail.room_name}
                </span>

                <div className="flex flex-col gap-2 w-full">
                    <div className="flex flex-col items-start">
                        <span className="text-[#0077C0] text-[16px]">Starts at</span>
                        <div className="flex items-center gap-2">
                            <span className="text-[#0077C0] text-[20px] font-[900] leading-[1]">{(new Intl.NumberFormat("en-PH", {
                                style: "currency",
                                currency: 'php'
                            }).format(Number(detail.price)))}</span>
                            <span className="text-[#0077C0]/40 text-[20px] font-[900] leading-[1]">/monthly</span>
                        </div>
                        <span className="text-[#1D242B] text-[16px] pt-2">{detail.branch_id.name}</span>
                    </div>

                    <div className="flex items-start justify-start w-full gap-1">
                        {detail.inclusions.slice(0, 3).map((inc) => (
                            <span key={inc.id} className="bg-[#0077C0] rounded-full text-[#FAFAFA] text-[12px] px-2 min-w-[50px] truncate">{inc.name}</span> 
                        ))}

                        {detail.inclusions.length > 3 && (
                            <span className="bg-[#0077C0] rounded-full text-[#FAFAFA] text-[12px] px-2 min-w-[50px] truncate">+ {detail.inclusions.length - 3} more</span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    )
}