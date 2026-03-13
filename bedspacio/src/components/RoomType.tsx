
import Link from "next/link"
import ArrowRight from '@/asset/icon/arrow-right.svg'


export default function RoomType () {

    return (
        <div className="flex flex-col xl:flex-row lg:flex-row md:flex-row items-center justify-center gap-[1rem] w-full p-3">
            <div className='group relative flex items-center justify-center w-full h-[200px] xl:h-[337.5px] lg:h-[337.5px] bg-[#1D242B] rounded-[10px] overflow-hidden'>
                <img src="/asset/bedspace_example.jpg" alt="bedspace" className='absolute inset-0 w-full h-full object-cover opacity-75 group-hover:scale-105 transition-all duration-200'/>
                <Link href="/rentals?room_type=Bedspace" className='absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center gap-2 bg-[#FAFAFA] rounded-full p-2 px-4 hover:bg-[#C7EEFF] active:bg-[#0077C0] transition-all duration-100 border-2 border-[#1D242B]'>
                    <span className='text-[#1D242B] text-[18px] font-bold'>Bedspace</span>
                    <ArrowRight className="w-[25px] h-auto stroke-[#1D242B]"/>
                </Link>

            </div>

            <div className='group relative flex items-center justify-center w-full h-[200px] xl:h-[337.5px] lg:h-[337.5px] bg-[#1D242B] rounded-[10px] overflow-hidden'>
                <img src="/asset/apartment_example.jpg" alt="bedspace" className='absolute inset-0 w-full h-full object-cover opacity-75 group-hover:scale-105 transition-all duration-200'/>
                <Link href="/rentals?room_type=Apartment" className='absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center gap-2 bg-[#FAFAFA] rounded-full p-2 px-4 hover:bg-[#C7EEFF] active:bg-[#0077C0] transition-all duration-100 border-2 border-[#1D242B]'>
                    <span className='text-[#1D242B] text-[18px] font-bold'>Apartment</span>
                    <ArrowRight className="w-[25px] h-auto stroke-[#1D242B]"/>
                </Link>
            </div>
        </div>
    )
}