
import Warning from '@/asset/icon/404-notfound.svg'
import Arrow from '@/asset/icon/arrow-long.svg'

import Link from "next/link"

export default function NotFound () {

    return (
        <div className="relative flex flex-col w-full min-h-screen items-center justify-center gap-10">
            <div className='flex flex-col items-center justify-center gap-3'>
                <Warning className="w-[75px] h-[75px]" />
                <span className='font-bold text-[28px] text-[#1D242B]'>Unauthorized</span>
            </div>

            <span>It seems like you are trying to access a page that is not in the scope of your authorization!</span>

            <Link href={"/admin"} className='flex items-center gap-2 border-2 border-[#1D242B] rounded-full px-[1rem] py-[0.2rem] hover:bg-[#1D242B]/10 active:bg-[#FAFAFA] transition-all duration-100'>
                <Arrow className="w-[25px] h-[25px] -rotate-180 stroke-[#1D242B] stroke-2" />
                Go back to dashboard page
            </Link>
        </div>
    )
}