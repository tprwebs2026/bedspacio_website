
// ICONS
import Search from '@/asset/icon/search.svg'
import { getBranches } from '../../lib/branch'
import SearchFilterClient from './SearchFilterClient';

export default async function SearchFilter() {
    const branches = await getBranches();
    

    return (
        <div className="relative flex flex-col items-center justify-center w-fit rounded-[5px] gap-2 p-3 border border-[#FAFAFA] bg-[#1D242B]/25">
            <SearchFilterClient branchData={branches}/>
        </div>
    )
}