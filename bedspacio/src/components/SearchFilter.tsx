
// ICONS
import Search from '@/asset/icon/search.svg'
import { getBranchNameAddress } from '../../lib/branch'
import SearchFilterClient from './SearchFilterClient';

export default async function SearchFilter() {
    const branches = await getBranchNameAddress();
    

    return (
        <div className="relative flex flex-col items-center justify-center w-full gap-2 p-3 z-20">
            <SearchFilterClient branches={branches}/>
        </div>
    )
}