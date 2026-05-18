import Link from "next/link";
import { getBranches } from "../../lib/branch";
import { ODOO_BASE_URL } from "@/config/config";


export default async function BranchCard () {
    const branches = await getBranches();
    console.log('branch data: ', branches)

    // branch has any type coz i too laze to type a TYPE

    return (
        <div className="flex items-center gap-[1rem]flex flex-col xl:flex-row lg:flex-row md:flex-row items-center justify-center gap-[1rem] p-3 w-full">
            {branches.map((branch: any) => (
                <Link key={branch.id} href={`/rentals?page=1&branch=${branch.id}&branchName=${branch.name}`} className='relative flex items-end justify-start w-full h-[200px] xl:h-[337.5px] lg:h-[337.5px] bg-[#1D242B] border-2 border-[#1D242B]/80 rounded-[10px] transition-transform duration-200 hover:-translate-y-1 active:translate-y-1 overflow-hidden'>

                    <img src={`${ODOO_BASE_URL}${branch.branch_image}`} alt="" className="w-full h-full object-cover absolute inset-0"/>
                    <div className="absolute inset-0 bg-gradient-to-t via-[#FAFAFAFA]/0 from-[#0077C0]/100 to-transparent rounded-[10px]" />

                    <div className='absolute flex items-center justify-center w-full gap-2 pb-8 px-4 cursor-pointer transition-all duration-100'>
                        <div className='flex flex-col items-center gap-2'>
                            <span className='font-bold text-[20px] leading-[1] text-[#FAFAFA]'>{branch.name}</span>
                            <span className='text-[16px] leading-[1] text-[#FAFAFA]'>{branch.address}</span>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    )
}