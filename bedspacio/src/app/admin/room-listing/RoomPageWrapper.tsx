// "use client"

// import Add from '@/asset/icon/add.svg';
// import axios from 'axios';
// import Link from 'next/link';

// import { useState } from 'react';
// import { useRouter, useSearchParams } from "next/navigation";

// import { BASE_URL } from '@/config/config';
// import { getRoomById } from '../../../../lib/room';
// import { AllRoomType, BranchesType } from './page';
// import DeleteToast from '@/components/admin/Toast/DeleteToast';

// interface RoomPageProp {
//     rooms: AllRoomType;
//     pageNumber: number;
//     branch: string;
//     type: string;
//     search: string;
//     branches: BranchesType[]
// }


// export default function RoomPageWrapper ({ 
//     rooms,
//     pageNumber,
//     branch,
//     type,
//     search,
//     branches
// }: RoomPageProp ) {

//     const router = useRouter();
//     const [deleteMessage, setDeleteMessage] = useState<string>('');

//     const handleNextPage = () => {
//         if (pageNumber < rooms?.totalPage) {
//             router.push(`/admin/room-listing?page=${pageNumber + 1}`);
//         }
//     }
    
//     const handlePrevPage = () => {
//         if (pageNumber > 1) {
//             router.push(`/admin/room-listing?page=${pageNumber - 1}`);
//             console.log('asdasd');
//         }
//     };

//     console.log(rooms)


//     const updateFilters = (updates: {
//         page?: number;
//         branch?: string;
//         type?: string;
//         search?: string;
//     }) => {
//         const params = new URLSearchParams();

//         params.set("page", String(updates.page ?? 1));

//         const nextBranch = updates.branch ?? branch;
//         const nextType = updates.type ?? type;
//         const nextSearch = updates.search ?? search;

//         if (nextBranch) params.set("branch", nextBranch);
//         if (nextType) params.set("type", nextType);
//         if (nextSearch) params.set("search", nextSearch);

//         router.push(`/admin/room-listing?${params.toString()}`);
//     };

    
//     return (
//         <>
//             <div className="flex w-full min-h-screen">
//                 <div className="flex flex-col w-full px-[1rem] xl:px-[8rem] lg:px-[1rem] py-[1rem] gap-[4rem]">
//                     <div className="flex items-center justify-between w-full">
//                         <div className='flex items-center gap-[2rem]'>
//                             <span className="text-[28px] text-[#1D242B] font-[900]">Room Listings</span>
//                         </div>

//                         <div className='flex items-center gap-[1rem] w-auto'>
//                             <input
//                                 type="search"
//                                 placeholder="Search for Room ID or Name of room"
//                                 className="min-w-[400px] flex w-full text-[16px] bg-[#1D242B]/10 p-2 border-2 border-[#1D242B]/10 rounded-[10px] focus:border-[#0077C0] focus:outline-none"
//                                 defaultValue={branch}
//                                 onChange={(e) =>
//                                     updateFilters({
//                                         search: e.target.value,
//                                         page: 1
//                                     })
//                                 }
//                             />

//                             <div className='flex items-center gap-1 w-full'>
//                                 <span className='text-[14px] font-bold'>Branch</span>
//                                 <select name="branch" id="branch_select" 
//                                     value={branch}
//                                     onChange={(e) =>
//                                         updateFilters({
//                                             branch: e.target.value,
//                                             page: 1
//                                         })
//                                     }
//                                 className='w-full text-[14px] bg-[#1D242B]/25 rounded-[5px] p-2 focus:outline-none focus:border-[#0077C0] cursor-pointer'>
//                                     <option hidden>Select branch</option>
//                                     {branches.map(branch => (
//                                         <option key={branch.id} value={branch.branch_name}>{branch.branch_name}</option>
//                                     ))}
//                                 </select>
//                             </div>

//                             <div className='flex items-center gap-1 w-full'>
//                                 <span className='text-[14px] font-bold'>Type</span>
//                                 <select name="room_type" id="room_type_select" 
//                                     value={type}
//                                     onChange={(e) =>
//                                         updateFilters({
//                                             type: e.target.value,
//                                             page: 1
//                                         })
//                                     }
//                                 className=' w-[200px] text-[14px] bg-[#1D242B]/25 rounded-[5px] p-2 focus:outline-none focus:border-[#0077C0] cursor-pointer'>
//                                     <option hidden>Select room type</option>
//                                     <option value="bedspace">Bedspace</option>
//                                     <option value="apartment">Apartment</option>
//                                 </select>
//                             </div>

//                             <Link href="/admin/room-listing/create" className="flex items-center justify-center rounded-[10px] bg-[#0077C0] p-2 cursor-pointer hover:bg-[#1D242B] hover:border-[#1D242B] active:bg-[#1D242B] xl:active:bg-[#0077C0] transition-all duration-100">
//                                 <Add className="w-[22px] h-auto stroke-[#FAFAFA]" />
//                                 <span className="text-[#FAFAFA] text-[14px] px-2">Create</span>
//                             </Link>
//                         </div>
//                     </div>


//                     {/* 
//                         Display in a list view 
//                         > Room list (room_id, title, slot, branch, gender, price)
//                     */}
//                     <div className='flex flex-col w-full items-center'>

//                         {/* HEADER */}
//                         <div className='grid grid-cols-[5%_10%_25%_15%_15%_15%_15%] w-full justify-items-center border-b border-b-[#1D242B] opacity-50 xl:text-[16px] lg:text-[14px]'>
//                             <span></span>
//                             <span>Room ID</span>
//                             <span>Name</span>
//                             <span>Branch</span>
//                             <span>Type</span>
//                             <span>Slot</span>
//                             <span>Price</span>
//                         </div>
                        
//                         {/* TABLE CONTENT*/}
//                         <div className='flex flex-col w-full h-[450px]'>
//                             {rooms?.data?.length > 0 ? (
//                                 rooms?.data?.map((room, index) => (
//                                     <Link key={room.id} href={`/admin/room-listing/${room.id}`} className='grid grid-cols-[5%_10%_25%_15%_15%_15%_15%] w-full justify-items-center py-3 cursor-pointer border-b border-b-[#1D242B]/25 hover:bg-[#C7EEFF]/50 active:bg-[#FAFAFA] transition-all duration-100'>
//                                         <span className='text-[12px] opacity-50'>{(pageNumber - 1) * 10 + index + 1}</span>
//                                         <span className='text-[16px]'>{room.room_uuid}</span>
//                                         <span className='text-[16px] text-center w-[300px] truncate'>{room.title}</span>
//                                         <span className='text-[16px]'>{room.branch}</span>
//                                         <span 
//                                         className={`px-2 ${room.type === 'apartment' ? 'bg-[#0077C0]/25 text-[#0077C0]' : 'bg-[#007C00]/25 text-[#007C00]'} h-fit rounded-full text-[16px]`}>
//                                             {room.type}
//                                         </span>
//                                         <span className='text-[16px]'>{room.slot}</span>
//                                         <span className='text-[16px]'>Php {room.price}</span>
//                                     </Link>
//                                 ))
//                             ) : (
//                                 <div className='flex items-center justify-center w-full h-[400px]'>
//                                     <span className='text-[16px] font-bold'>Nothing to show yet...</span>
//                                 </div>
//                             )}
//                         </div>
//                     </div>

//                     <div className='flex items-center justify-center w-full gap-2'>
//                         <button onClick={handlePrevPage} disabled={pageNumber === 1} 
//                         className={`cursor-pointer bg-[#141414]/15 p-2 border-2 border-[#141414]/50 rounded-[10px] ${pageNumber === 1 && 'opacity-25'}`}>Prev</button>
//                         <span className='p-2 px-4 border-2 border-[#141414] rounded-[10px]'>{pageNumber}</span>
//                         <button onClick={handleNextPage} disabled={pageNumber >= rooms?.totalPage} 
//                         className={`cursor-pointer p-2 bg-[#141414]/15 border-2  border-[#141414]/50 rounded-[10px] ${pageNumber >= rooms?.totalPage && 'opacity-25'}`}>Next</button>
//                     </div>
//                 </div>
//             </div>

//             {deleteMessage && <DeleteToast message={deleteMessage} />}
//         </>
//     )
// }


"use client"

import Add from '@/asset/icon/add.svg';
import Link from 'next/link';

import { useState } from 'react';
import { useRouter } from "next/navigation";

import { AllRoomType, BranchesType } from './page';
import DeleteToast from '@/components/admin/Toast/DeleteToast';

interface RoomPageProp {
    rooms: AllRoomType;
    pageNumber: number;
    branch: string;
    type: string;
    search: string;
    branches: BranchesType[];
}

export default function RoomPageWrapper ({
    rooms,
    pageNumber,
    branch,
    type,
    search,
    branches
}: RoomPageProp ) {

    const router = useRouter();
    const [deleteMessage, setDeleteMessage] = useState<string>('');

    const updateFilters = (updates: {
        page?: number;
        branch?: string;
        type?: string;
        search?: string;
    }) => {

        const params = new URLSearchParams();

        const nextPage = updates.page ?? pageNumber ?? 1;
        const nextBranch = updates.branch ?? branch;
        const nextType = updates.type ?? type;
        const nextSearch = updates.search ?? search;

        params.set("page", String(nextPage));

        if (nextBranch) params.set("branch", nextBranch);
        if (nextType) params.set("type", nextType);
        if (nextSearch) params.set("search", nextSearch);

        router.push(`/admin/room-listing?${params.toString()}`);
    };

    const handleNextPage = () => {
        if (pageNumber < rooms?.totalPage) {
            updateFilters({ page: pageNumber + 1 });
        }
    };

    const handlePrevPage = () => {
        if (pageNumber > 1) {
            updateFilters({ page: pageNumber - 1 });
        }
    };

    return (
        <>
            <div className="flex w-full h-auto overflow-y-auto">
                <div className="flex flex-col w-full px-[1rem] xl:px-[8rem] lg:px-[1rem] py-[1rem] gap-[4rem]">

                    <div className="flex items-center justify-between w-full">

                        <div className='flex items-center gap-[2rem]'>
                            <span className="text-[28px] text-[#1D242B] font-[900]">Room Listings</span>
                        </div>

                        <div className='flex items-center gap-[1rem] w-auto'>

                            <input
                                type="search"
                                placeholder='Search for Room ID or Name of room'
                                value={search}
                                className="flex min-w-[500px] text-[16px] bg-[#1D242B]/10 p-2 border-2 border-[#1D242B]/10 rounded-[10px] focus:border-[#0077C0] focus:outline-none"
                                onChange={(e) =>
                                    updateFilters({
                                        search: e.target.value,
                                        page: 1
                                    })
                                }
                            />

                            <div className='flex items-center gap-1 w-full'>
                                <span className='text-[14px] font-bold'>Branch</span>

                                <select
                                    name="branch"
                                    id="branch_select"
                                    value={branch}
                                    onChange={(e) =>
                                        updateFilters({
                                            branch: e.target.value,
                                            page: 1
                                        })
                                    }
                                    className='w-full text-[14px] bg-[#1D242B]/25 rounded-[5px] p-2 focus:outline-none focus:border-[#0077C0] cursor-pointer'
                                >
                                    <option value="">Select branch</option>
                                    {branches.map((b) => (
                                        <option key={b.id} value={b.branch_name}>
                                            {b.branch_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className='flex items-center gap-1 w-full'>
                                <span className='text-[14px] font-bold'>Type</span>

                                <select
                                    name="room_type"
                                    id="room_type_select"
                                    value={type}
                                    onChange={(e) =>
                                        updateFilters({
                                            type: e.target.value,
                                            page: 1
                                        })
                                    }
                                    className=' w-[200px] text-[14px] bg-[#1D242B]/25 rounded-[5px] p-2 focus:outline-none focus:border-[#0077C0] cursor-pointer'
                                >
                                    <option value="">Select room type</option>
                                    <option value="bedspace">Bedspace</option>
                                    <option value="apartment">Apartment</option>
                                </select>
                            </div>

                            <Link
                                href="/admin/room-listing/create"
                                className="flex items-center justify-center rounded-[10px] bg-[#0077C0] p-2 cursor-pointer hover:bg-[#1D242B] hover:border-[#1D242B] active:bg-[#1D242B] xl:active:bg-[#0077C0] transition-all duration-100"
                            >
                                <Add className="w-[22px] h-auto stroke-[#FAFAFA]" />
                                <span className="text-[#FAFAFA] text-[14px] px-2">Create</span>
                            </Link>

                        </div>
                    </div>

                    <div className='flex flex-col w-full items-center'>

                        <div className='grid grid-cols-[5%_10%_25%_15%_15%_15%_15%] w-full justify-items-center border-b border-b-[#1D242B] opacity-50 xl:text-[16px] lg:text-[14px]'>
                            <span></span>
                            <span>Room ID</span>
                            <span>Name</span>
                            <span>Branch</span>
                            <span>Type</span>
                            <span>Slot</span>
                            <span>Price</span>
                        </div>

                        <div className='flex flex-col w-full h-[450px] overflow-y-auto'>
                            {rooms?.data?.length > 0 ? (
                                rooms.data.map((room, index) => (
                                    <Link
                                        key={room.id}
                                        href={`/admin/room-listing/${Number(room.room_uuid)}`}
                                        className='grid grid-cols-[5%_10%_25%_15%_15%_15%_15%] w-full justify-items-center py-3 cursor-pointer border-b border-b-[#1D242B]/25 hover:bg-[#C7EEFF]/50 active:bg-[#FAFAFA] transition-all duration-100'
                                    >
                                        <span className='text-[12px] opacity-50'>
                                            {(pageNumber - 1) * 10 + index + 1}
                                        </span>
                                        <span className='text-[16px]'>{room.room_uuid}</span>
                                        <span className='text-[16px] text-center w-[300px] truncate'>
                                            {room.title}
                                        </span>
                                        <span className='text-[16px]'>{room.branch}</span>

                                        <span
                                            className={`px-2 ${
                                                room.type === 'apartment'
                                                    ? 'bg-[#0077C0]/25 text-[#0077C0]'
                                                    : 'bg-[#007C00]/25 text-[#007C00]'
                                            } h-fit rounded-full text-[16px]`}
                                        >
                                            {room.type}
                                        </span>

                                        <span className='text-[16px]'>{room.slot}</span>
                                        <span className='text-[16px]'>Php {room.price}</span>
                                    </Link>
                                ))
                            ) : (
                                <div className='flex items-center justify-center w-full h-[400px]'>
                                    <span className='text-[16px] font-bold'>
                                        Nothing to show yet...
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className='flex items-center justify-center w-full gap-2'>
                        <button
                            onClick={handlePrevPage}
                            disabled={pageNumber === 1}
                            className={`cursor-pointer bg-[#141414]/15 p-2 border-2 border-[#141414]/50 rounded-[10px] ${
                                pageNumber === 1 && 'opacity-25'
                            }`}
                        >
                            Prev
                        </button>

                        <span className='p-2 px-4 border-2 border-[#141414] rounded-[10px]'>
                            {pageNumber}
                        </span>

                        <button
                            onClick={handleNextPage}
                            disabled={pageNumber >= rooms?.totalPage}
                            className={`cursor-pointer p-2 bg-[#141414]/15 border-2 border-[#141414]/50 rounded-[10px] ${
                                pageNumber >= rooms?.totalPage && 'opacity-25'
                            }`}
                        >
                            Next
                        </button>
                    </div>

                </div>
            </div>

            {deleteMessage && <DeleteToast message={deleteMessage} />}
        </>
    );
}