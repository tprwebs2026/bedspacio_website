import Link from "next/link";
import { getBranches } from "../../lib/branch";
import ArrowRight from '@/asset/icon/arrow-right.svg'
import ArrowUpRight from '@/asset/icon/arrow-up-right.svg';

import { ODOO_BASE_URL } from "@/config/config"


export default async function BranchRoomCard () {
    const branches = await getBranches();
    console.log('branch&roomcard: ', branches);
    return (
        <section className='flex flex-col w-full min-h-[800px] bg-[#FAFAFA] items-center justify-start px-[1rem] xl:px-[8rem] lg:px-[4rem] md:px-[1rem] py-[3rem] gap-[3rem]'>
            <div className='flex flex-col items-center justify-center gap-[2rem] w-full'>
                <span className='text-[42px] font-[900] text-[#1D242B] leading-[0.5]'>Our Branches</span>

                <div className="flex items-center gap-[1rem]flex flex-col xl:flex-row lg:flex-row md:flex-row items-center justify-center gap-[1rem] p-3 w-full">
                    {branches.map(branch => (
                        <Link key={branch.id} href={`/rentals?page=1&branch=${branch.id}&branchName=${branch.name}`} className='relative flex items-end justify-start w-full h-[200px] xl:h-[337.5px] lg:h-[337.5px] bg-[#1D242B] rounded-[10px] transition-transform duration-200 hover:-translate-y-1 active:translate-y-1 overflow-hidden'>

                            {/* <img src={`data:image/webp;base64,${branch.branch_image}`} 
                            alt="" className="w-full h-full object-cover absolute inset-0"/> */}

                            <img src={`${ODOO_BASE_URL}/web/image/bedspacio.branch/${branch.id}/branch_image`} className="w-full h-full object-cover"/>
                            <div className="absolute inset-0 bg-gradient-to-t via-[#FAFAFAFA]/0 from-[#1D242B]/75 to-transparent" />

                            <div className="absolute top-4 right-4 bg-[#FAFAFA] rounded-full p-1">
                                <ArrowUpRight className="w-[30px] h-[30px]" />
                            </div>

                            <div className='absolute flex items-center justify-center w-full gap-2 pb-8 px-4 cursor-pointer transition-all duration-100'>
                                <div className='flex flex-col items-center gap-4'>
                                    <span className='font-bold text-[36px] leading-[1] text-[#FAFAFA]'>{branch.name}</span>
                                    <span className='text-[16px] leading-[1] text-[#FAFAFA]'>{branch.address}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            <div className='flex flex-col items-center justify-center gap-[2rem] w-full'>
                <span className='text-[42px] font-[900] text-[#1D242B] leading-[1] text-center'>Explore Room Types</span>

                <div className="flex flex-col xl:flex-row lg:flex-row md:flex-row items-center justify-center gap-[1rem] w-full p-3">
                    <div className='group relative flex items-center justify-center w-full h-[200px] xl:h-[337.5px] lg:h-[337.5px] bg-[#1D242B] rounded-[10px] overflow-hidden'>
                        <img src="/image/why_choose_us_1.jpg" alt="bedspace" className='absolute inset-0 w-full h-full object-cover opacity-75 group-hover:scale-102 transition-all duration-200'/>
                        <Link href="/rentals?room_type=bedspace&page=1" className='absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center gap-2 bg-[#FAFAFA] rounded-full p-2 px-4 hover:bg-[#C7EEFF] active:bg-[#0077C0] transition-all duration-100 border-2 border-[#1D242B]'>
                            <span className='text-[#1D242B] text-[18px] font-bold'>Bedspace</span>
                            <ArrowRight className="w-[25px] h-auto stroke-[#1D242B]"/>
                        </Link>

                    </div>

                    <div className='group relative flex items-center justify-center w-full h-[200px] xl:h-[337.5px] lg:h-[337.5px] bg-[#1D242B] rounded-[10px] overflow-hidden'>
                        <img src="/asset/apartment_example.jpg" alt="bedspace" className='absolute inset-0 w-full h-full object-cover opacity-75 group-hover:scale-102 transition-all duration-200'/>
                        <Link href="/rentals?room_type=apartment&page=1" className='absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center gap-2 bg-[#FAFAFA] rounded-full p-2 px-4 hover:bg-[#C7EEFF] active:bg-[#0077C0] transition-all duration-100 border-2 border-[#1D242B]'>
                            <span className='text-[#1D242B] text-[18px] font-bold'>Apartment</span>
                            <ArrowRight className="w-[25px] h-auto stroke-[#1D242B]"/>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}