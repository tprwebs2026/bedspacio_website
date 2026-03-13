
// ICONS
import Search from '@/asset/icon/search.svg'
import { getBranches } from '../../lib/branch'
import SearchFilterClient from './SearchFilterClient';

export default async function SearchFilter() {
    const branches = await getBranches();
    

    return (
        <div className="relative flex flex-col items-center justify-center w-fit rounded-[10px] gap-2 p-3 bg-[#1D242B]/50 ">
            <span className='text-[#FAFAFA] text-[20px]'>Tell us your preferrence</span>
            <SearchFilterClient branchData={branches}/>
        </div>
    )
}