// "use client"

// import { useEffect, useState, useRef } from "react";
// import { useRouter } from "next/navigation";

// // icons
// import Arrow from '@/asset/icon/arrow-right.svg'
// import Menu from '@/asset/icon/menu-three-dots.svg'
// import ArchiveIcon from '@/asset/icon/archive.svg'

// // toast
// import ErrorToast from "@/components/admin/Toast/ErrorToast";
// import SuccessToast from "@/components/admin/Toast/SuccessToast";

// import { InquiryPageType, InquiryModalType, Pagination } from "./page"
// import InquiryModalWrapper from "./InquiryModalWrapper";
// import { getAllInquiry, getInquiryById, deleteSingleInquiry, deleteMultipleInquiry, archiveInquirySingle, archiveInquiryMultiple } from "../../../../lib/inquiry";
// import WindowDeleteMultiple from "@/components/admin/WindowDeleteMultiple";
// import ConfirmWindow from "@/components/admin/Toast/ConfirmWindow";

// import Link from "next/link";
// import { usePathname, useSearchParams } from "next/navigation";
// import { timeAgo } from "../../../../helpers/timeFormat";

// interface InquiryPageProp {
//     inquiries: InquiryPageType[];
//     pagination: Pagination;
//     currentStatus: string
// }

// export default function InquiryPageWrapper ({ inquiries, pagination, currentStatus }: InquiryPageProp) {

//     console.log('inquiries in inquiry page: ', inquiries)

//     // const [inquiryList, setInquiryList] = useState<InquiryPageType[]>(inquiries)
//     const inquiryList = inquiries;
//     const [inquiry, setInquiry] = useState<InquiryModalType | null>(null);

//     const [selectedId, setSelectedId] = useState<number | null>(null);
//     const [sender, setSender] = useState<string>('');

//     const [modalOpen, setModalOpen] = useState<boolean>(false);
//     const [menuOpen, setMenuOpen] = useState<boolean>(false);

//     const [checkList, setCheckList] = useState<number[]>([]);
//     const [confirmOpen, setConfirmOpen] = useState<boolean>(false)
//     const [confirmType, setConfirmType] = useState<'single' | 'multiple' | 'archive' | 'archive_single' | null>(null);

//     const [errorMessage, setErrorMessage] = useState<string>('');
//     const [successMessage, setSuccessMessage] = useState<string>('');


//     const searchParams = useSearchParams();
//     const activeStatus = searchParams.get("status") || "";

//     const tabs = [
//         { label: "All", value: "" },
//         { label: "Pending", value: "pending" },
//         { label: "Contacted", value: "contacted" },
//         { label: "Converted", value: "converted" },
//         { label: "Closed", value: "closed" },
//     ];

//     const router = useRouter();
//     const debounceRef = useRef<NodeJS.Timeout | null>(null);



//     const viewModal = async (id: number) => {
//         const inquiry = await getInquiryById(id);

//         if (!inquiry) return null;

//         setModalOpen(true)
//         setInquiry(inquiry);
//     }



//     // const loadInquiries = async (status?: string) => {
//     //     const response = await getAllInquiry(status);
//     //     setInquiryList(response);
//     // }


//     const resetModal = () => {
//         setModalOpen(false);
//         setInquiry(null);
//         setSelectedId(null);
//         setSender('');
//     };


//     const handleDeleteSingle = async (id: number) => {
//         try {

//             const deleted = await deleteSingleInquiry(id);

//             if (deleted) {
//                 // await loadInquiries();

//                 setSuccessMessage('Delete successful');
//                 setTimeout(() => setSuccessMessage(''), 2500);

//                 setSelectedId(null);
//                 setConfirmType(null);
//             }

//             console.log('delete report: ', deleted);

//         } catch (err: any) {
//             setErrorMessage(
//                 err.response?.data?.message
//             );

//             setTimeout(() => setErrorMessage(''), 2500);
//             return;
//         }
//     }


//     const handleDeleteMultiple = async (ids: number[]) => {
//         try {

//             console.log('ids: ', ids);

//             const response = await deleteMultipleInquiry(ids);
//             const data = response.data;

//             // await loadInquiries();

//             if (data.deleted.length > 0) {
//                 setSuccessMessage(`Successfully deleted ${data.deleted.length} inquiries.`);
//                 setTimeout(() => setSuccessMessage(''), 2500);
//             }

//             if (data.not_closed.length > 0) {
//                 setErrorMessage(
//                     `Some inquiries were not deleted due to 'unclosed' status`
//                 );

//                 setTimeout(() => setErrorMessage(''), 5000);
//             }

//             if (data.not_found.length > 0) {
//                 const messages = data.not_found
//                     .map((n: any) => `ID ${n.id} not found`)
//                     .join(', ');

//                 setErrorMessage(`Not found: ${messages}`);

//                 setTimeout(() => setErrorMessage(''), 3500);
//             }

//             setCheckList([]);
//             setConfirmType(null);

//             console.log('Deleted: ', response.data.deleted);
//             console.log('Skipped: ', response.data.skipped);


//         } catch (err: any) {
//             setErrorMessage(
//                 err.response?.data?.message
//             );

//             setTimeout(() => setErrorMessage(''), 3500);
//             return;
//         }
//     };


//     const handleArchiveSingle = async (id: number) => {
//         try {
//             const archive = await archiveInquirySingle(id);

//             if (archive) {
//                 setSuccessMessage('Inquiry archived successfully!');
//                 setTimeout(() => setSuccessMessage(''), 3500);

//                 return;
//             }

//             console.log('Archived: ', archive);

//         } catch (err) {
//             console.error('Failed to archive inquiry: ', err);

//             setErrorMessage('Failed to archive inquiry');
//             setTimeout(() => setErrorMessage(''), 3500);
//         }
//     }


//     const handleArchiveMultiple = async (ids: number[]) => {
//         try {

//             console.log('Ids for archive multiple: ', ids);
            
//             if (!Array.isArray(ids)) {
//                 setErrorMessage('Ids must be an array of id');
//                 setTimeout(() => setErrorMessage(''), 3500);

//                 return;
//             }

//             const response = await archiveInquiryMultiple(ids);
//             const data = response.data;

//             // await loadInquiries();

//             if (data.archived.length > 0) {
//                 setSuccessMessage(`Successfully archived ${data.archived.length} inquiries.`);
//                 setTimeout(() => setSuccessMessage(''), 3500)

//                 return;
//             }

//             setCheckList([]);
//             setConfirmType(null);


//         } catch (err: any) {
            
//             setErrorMessage(
//                 err?.response?.data?.message
//             );

//             setTimeout(() => setErrorMessage(''), 3500);
//             return;
//         }
//     }



//     const updateURL = (search: string) => {
//         if (debounceRef.current) clearTimeout(debounceRef.current);

//         debounceRef.current = setTimeout(() => {
//             const params = new URLSearchParams(searchParams.toString());

//             params.set("page", "1");

//             if (currentStatus) {
//                 params.set("status", currentStatus);
//             }

//             if (search.trim()) {
//                 params.set("search", search.trim());
//             } else {
//                 params.delete("search");
//             }

//             router.push(`/admin/inquiry?${params.toString()}`);
//         }, 400);
//     };


//     const buildQuery = (page: number) => {
//         const params = new URLSearchParams(searchParams.toString());

//         params.set("page", String(page));

//         return `/admin/inquiry?${params.toString()}`;
//     };


//     const handleNextPage = () => {
//         if (pagination.page < pagination?.totalPages) {
//             router.push(buildQuery(pagination.page + 1));
//         }
//     };

//     const handlePrevPage = () => {
//         if (pagination.page > 1) {
//             router.push(buildQuery(pagination.page - 1));
//         }
//     };

    

//     useEffect(() => {
//         console.log('check list: ', checkList);
//         console.log('How many? ', checkList.length);
//     }, [checkList])

//     return (
//         <>
//             <div className="flex w-full h-full overflow-y-auto">
//                 <div className="flex flex-col w-full xl:px-[8rem] lg:px-[1rem] px-[1rem] py-[2rem] gap-[2rem]">

//                     <div className="flex items-center justify-between w-full">
//                         <span className="text-[28px] text-[#1D242B] font-bold leading-tight">Inquiry</span>


//                         <div className="flex items-center w-[600px] gap-1">
//                             Search
//                             <input
//                                 type="search"
//                                 placeholder="Search reference number"
//                                 className="flex w-full text-[16px] bg-[#1D242B]/10 p-2 border-2 border-[#1D242B]/10 rounded-[10px] focus:border-[#0077C0] focus:outline-none"
//                                 onChange={(e) => updateURL(e.target.value)}
//                             />
//                         </div>


//                         <div className="flex items-center gap-2">
//                             {tabs.map(tab => (
//                                 <Link
//                                     key={tab.value}
//                                     href={`/admin/inquiry${tab.value ? `?status=${tab.value}` : ""}`}
//                                     className={`px-3 py-1 rounded-full text-sm font-bold border
//                                         ${activeStatus === tab.value
//                                             ? "bg-[#0077C0] text-white hover:bg-[#0077C0]/80"
//                                             : "bg-transparent text-[#1D242B] border-[#1D242B]/30 hover:bg-[#1D242B]/10"
//                                         }
//                                     `}
//                                 >
//                                     {tab.label}
//                                 </Link>
//                             ))}
//                         </div>

//                         <div className="relative flex flex-col">
//                             <button onClick={() => setMenuOpen(prev => !prev)} className="flex item-center justify-center cursor-pointer bg-[#1D242B]/15 hover:bg-[#1D242B]/30 active:bg-[#1D242B]/15 rounded-full p-2 transitional-all duration-100">
//                                 <Menu className="w-[20px] h-[20px]" />
//                             </button>

//                             {menuOpen && (
//                                 <div className="absolute top-7 right-5 flex flex-col bg-[#FAFAFA] gap-1 p-1 rounded-[10px] border border-[#1D242B]/25">
//                                     <Link href={'/admin/inquiry/archives'} className="flex items-center p-1 cursor-pointer bg-[#0077C0]/25 hover:bg-[#0077C0]/40 active:bg-[#0077C0]/25 rounded-[8px] transition-all duration-100">
//                                         <ArchiveIcon className="w-[20px] h-[20px]" />
//                                         <span className="px-2 text font-bold bg-[#]">Archives</span>
//                                     </Link>
//                                 </div>
//                             )}
//                         </div>
//                     </div>

//                     <div className="flex flex-col w-full">

//                         <div className="grid grid-cols-[5%_10%_15%_15%_20%_10%_20%_5%] justify-items-center border-b border-b-[#1D242B]/45 px-[1rem] py-1">
//                             <span></span>
//                             <span className="text-[14px] text-[#1D242B]/75">Inqiury Type</span>
//                             <span className="text-[14px] text-[#1D242B]/75">Reference #</span>
//                             <span className="text-[14px] text-[#1D242B]/75">Name</span>
//                             <span className="text-[14px] text-[#1D242B]/75">Contact #</span>
//                             <span className="text-[14px] text-[#1D242B]/75">Status</span>
//                             <span className="text-[14px] text-[#1D242B]/75">Submitted at (yyy-mm-dd)</span>
//                         </div>

//                         <div className="flex flex-col w-full h-[500px] overflow-y-auto">
//                             {inquiryList.length > 0 ? (
//                                 inquiryList.map(inquiry => (
//                                     <div key={inquiry.id} 
//                                     className="group grid grid-cols-[5%_10%_15%_15%_20%_10%_20%_5%] border-b border-b-[#1D242B]/15 py-3 place-items-center justify-items-center hover:bg-[#C7EEFF]/25 px-[1rem] transition-all duration-100">
//                                         <input type="checkbox" name="inquiry_checker" id={`inquiry_${inquiry.id}`} 
//                                             checked={checkList.includes(inquiry.id)}
//                                             onChange={(e) => {
//                                                     if (e.target.checked) {
//                                                         setCheckList( prev => [inquiry.id, ...prev] )
//                                                     } else {
//                                                         setCheckList( prev => prev.filter(id => id !== inquiry.id))
//                                                     }
//                                                 }
//                                             }
//                                         />    
    
//                                         <span className={`px-2 rounded-full text-[14px] font-bold
//                                                 ${inquiry.type === 'room_inquiry' 
//                                                     ? 'bg-[#0077C0]/25 text-[#0077C0]' 
//                                                     : 'bg-[#1D242B]/25 text-[#1D242B]/75'}
//                                             `}>
//                                             {inquiry.type}
//                                         </span>
//                                         <span className="text-[14px] text-[#1D242B] font-bold">{inquiry.reference_number}</span>
//                                         <span className="text-[14px] text-[#1D242B] font-bold">{inquiry.fullname}</span>
//                                         <span className="text-[14px] text-[#1D242B] font-bold">{inquiry.contact_number}</span>
//                                         <span 
//                                             className={`px-2 py-1 text-[14px] font-bold w-fit rounded-full
                                            
//                                         `}>{inquiry.ghl_status}</span>

//                                         <div className="flex flex-col items-center justify-center">
//                                             <span className="leading-tight text-[14px] text-[#1D242B] font-bold">{inquiry.created_at.split("T")[0].split("-").join('-') }</span>
//                                             <span className="text-[12px] font-bold opacity-50 leading-tight">{timeAgo(inquiry.created_at) }</span>
//                                         </div>

//                                         <button onClick={() => {
//                                                 setSelectedId(inquiry.id);
//                                                 setSender(inquiry.fullname)
//                                                 viewModal(inquiry.id);
//                                             }} className="flex items-center cursor-pointer rounded-full opacity-0 bg-[#1D242B]/10 group-hover:opacity-100 hover:bg-[#0077C0]/25 active:bg-[#1D242B]/10 px-2">
//                                             <span className="px-2 text-[#1D242B] text-[14px] font-bold">View</span>
//                                             <Arrow className="w-[20px] h-[29px]" />
//                                         </button>
//                                     </div>
//                                 ))
//                             ) : (
//                                 <div className='flex items-center justify-center w-full h-[400px]'>
//                                     <span className='text-[16px] font-bold'>Nothing to show yet...</span>
//                                 </div>
//                             )}
//                         </div>

//                         <div className='flex items-center justify-center w-full gap-2 pt-[2rem]'>
//                             <button onClick={handlePrevPage} disabled={pagination.page === 1} 
//                             className={`cursor-pointer bg-[#141414]/15 p-2 border-2 border-[#141414]/50 rounded-[10px] ${pagination.page === 1 && 'opacity-25'}`}>
//                                 Prev
//                             </button>

//                             <span className='p-2 px-4 border-2 border-[#141414] rounded-[10px]'>{pagination.page}</span>

//                             <button onClick={handleNextPage} disabled={pagination.page >= pagination?.totalPages} 
//                             className={`cursor-pointer p-2 bg-[#141414]/15 border-2  border-[#141414]/50 rounded-[10px] ${pagination.page >= pagination?.totalPages && 'opacity-25'}`}>
//                                 Next
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {modalOpen && inquiry && (
//                 <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
//                     <InquiryModalWrapper 
//                         modalOpen={() => setModalOpen(false)}
//                         inquiry={inquiry}
//                         onSuccess={() => router.refresh()}
//                         onDelete={() => setConfirmType('single')}
//                         onArchiveSingle={() => setConfirmType('archive_single')}
//                         successMessage={(msg) => setSuccessMessage(msg)}
//                         errorMessage={(msg) => setErrorMessage(msg)}
//                     />
//                 </div>
//             )}

//             {checkList.length > 0 && (
//                 <div className="z-20">
//                     <WindowDeleteMultiple 
//                         count={checkList.length}
//                         ids={checkList}
//                         onCancel={() => setCheckList([])}
//                         onConfirm={() => setConfirmType('multiple')}
//                         onArchive={() => setConfirmType('archive')}   /// add the function here first 
//                     />
//                 </div>
//             )}

//             {confirmType === 'multiple' && checkList.length > 0 && selectedId === null &&  (
//                 <ConfirmWindow 
//                     title={`Delete Inquiries`}
//                     message={`You will be deleting ${checkList.length} inquiries. Do you want to proceed`}
//                     onCancel={() => {
//                         setConfirmType(null)
//                         // setCheckList([]);
//                     }}
//                     onConfirm={async () => {
//                         await handleDeleteMultiple(checkList);
//                         router.refresh();
//                         setConfirmType(null);
//                         resetModal();
//                     }}
//                 />
//             )}

//             {confirmType === 'single' && (
//                 <ConfirmWindow
//                     title={'Delete Inquiry'}
//                     message={`You are about to delete an inquiry from ${sender}. Do you want to proceed?`}
//                     onCancel={() => {
//                         setConfirmType(null);
//                         setSelectedId(null);
//                     }}
//                     onConfirm={async () => {
//                         await handleDeleteSingle(Number(selectedId));
//                         // await loadInquiries('');
//                         router.refresh(); // this instead of calling 'loadInquiries' function
//                         setConfirmType(null)
//                         resetModal();
//                     }}
//                 />
//             )}

//             {confirmType === 'archive' && (
//                 <ConfirmWindow
//                     title={'Archive Inquiries'}
//                     message={`You will be archiving ${checkList.length} inquiries. Do you want to proceed?`}
//                     onCancel={() => {
//                         setConfirmType(null);
//                         // setCheckList([]);
//                     }}
//                     onConfirm={async () => {
//                         await handleArchiveMultiple(checkList); 
//                         // await loadInquiries('');
//                         router.refresh(); // this instead of calling 'loadInquiries' function
//                         setConfirmType(null) 
//                         setCheckList([])
//                         resetModal(); 
//                     }}
//                 />
//             )}

//             {confirmType === 'archive_single' && (
//                 <ConfirmWindow
//                     title={'Archive Inquiry'}
//                     message={`You are about to archive an inquiry from ${sender}. Do you want to proceed?`}
//                     onCancel={() => {
//                         setConfirmType(null);
//                         setSelectedId(null);
//                     }}
//                     onConfirm={async () => {
//                         await handleArchiveSingle(Number(selectedId)); // change this to handleArchiveMultiple
//                         // await loadInquiries(''); 
//                         router.refresh(); // this instead of calling 'loadInquiries' function
//                         setConfirmType(null) 
//                         resetModal(); 
//                     }}
//                 />
//             )}


//             {errorMessage && <ErrorToast message={errorMessage} />}
//             {successMessage && <SuccessToast message={successMessage} />}
//         </>
//     )
// }


// ------------------- With GoHighLevel Integration  ---------------------//

"use client"

import { useEffect, useState, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { BASE_URL } from "@/config/config";
import axios from "axios";

// icons
import Arrow from '@/asset/icon/arrow-right.svg'
import Menu from '@/asset/icon/menu-three-dots.svg'
import ArchiveIcon from '@/asset/icon/archive.svg'

// toast
import ErrorToast from "@/components/admin/Toast/ErrorToast";
import SuccessToast from "@/components/admin/Toast/SuccessToast";

import { InquiryPageType, InquiryModalType, Pagination } from "./page"
import InquiryModalWrapper from "./InquiryModalWrapper";
import { getAllInquiry, getInquiryById, deleteSingleInquiry, deleteMultipleInquiry, archiveInquirySingle, archiveInquiryMultiple } from "../../../../lib/inquiry";
import WindowDeleteMultiple from "@/components/admin/WindowDeleteMultiple";
import ConfirmWindow from "@/components/admin/Toast/ConfirmWindow";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { timeAgo } from "../../../../helpers/timeFormat";
import InquiryCreateModalWrapper from "./InquiryCreateModalWrapper";

export type RoomUUIDType = {
    room_uuid: string,
    type: string
}

interface InquiryPageProp {
    inquiries: InquiryPageType[];
    pagination: Pagination;
    currentStatus: string,
    roomUUIDs: RoomUUIDType[]
}

export default function InquiryPageWrapper ({ inquiries, pagination, currentStatus, roomUUIDs }: InquiryPageProp) {
 

    // const [inquiryList, setInquiryList] = useState<InquiryPageType[]>(inquiries)
    const inquiryList = inquiries;
    const [inquiry, setInquiry] = useState<InquiryModalType | null>(null);

    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [sender, setSender] = useState<string>('');

    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
    const [menuOpen, setMenuOpen] = useState<boolean>(false);

    const [checkList, setCheckList] = useState<number[]>([]);
    const [confirmOpen, setConfirmOpen] = useState<boolean>(false)
    const [confirmType, setConfirmType] = useState<'single' | 'multiple' | 'archive' | 'archive_single' | null>(null);

    const [errorMessage, setErrorMessage] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');


    const searchParams = useSearchParams();
    const activeStatus = searchParams.get("inq_status") || "";

    const tabs = [
        { label: "All", value: "" },
        { label: "New lead", value: "New lead" },
        { label: "Contacted", value: "Contacted" },
        { label: "Qualified", value: "Qualified" },
        { label: "Closed - Won", value: "Closed - Won" },
        { label: "Closed - Lost", value: "Closed - Lost" }
    ];

    const router = useRouter();
    const debounceRef = useRef<NodeJS.Timeout | null>(null);



    const viewModal = async (id: number) => {
        const inquiry = await getInquiryById(id);

        if (!inquiry) return null;

        setModalOpen(true)
        setInquiry(inquiry);
    }



    // const loadInquiries = async (status?: string) => {
    //     const response = await getAllInquiry(status);
    //     setInquiryList(response);
    // }


    const resetModal = () => {
        setModalOpen(false);
        setInquiry(null);
        setSelectedId(null);
        setSender('');
    };


    const handleDeleteSingle = async (id: number) => {
        try {

            const deleted = await deleteSingleInquiry(id);

            if (deleted) {
                // await loadInquiries();

                setSuccessMessage('Delete successful');
                setTimeout(() => setSuccessMessage(''), 2500);

                setSelectedId(null);
                setConfirmType(null);
            }

            console.log('delete report: ', deleted);

        } catch (err: any) {
            setErrorMessage(
                err.response?.data?.message
            );

            setTimeout(() => setErrorMessage(''), 2500);
            return;
        }
    }


    const handleDeleteMultiple = async (ids: number[]) => {
        try {

            console.log('ids: ', ids);

            const response = await deleteMultipleInquiry(ids);
            const data = response.data;

            // await loadInquiries();

            if (data.deleted.length > 0) {
                setSuccessMessage(`Successfully deleted ${data.deleted.length} inquiries.`);
                setTimeout(() => setSuccessMessage(''), 2500);
            }

            if (data.not_closed.length > 0) {
                setErrorMessage(
                    `Some inquiries were not deleted due to 'unclosed' status`
                );

                setTimeout(() => setErrorMessage(''), 5000);
            }

            if (data.not_found.length > 0) {
                const messages = data.not_found
                    .map((n: any) => `ID ${n.id} not found`)
                    .join(', ');

                setErrorMessage(`Not found: ${messages}`);

                setTimeout(() => setErrorMessage(''), 3500);
            }

            setCheckList([]);
            setConfirmType(null);

        } catch (err: any) {
            setErrorMessage(
                err.response?.data?.message
            );

            setTimeout(() => setErrorMessage(''), 3500);
            return;
        }
    };


    const handleArchiveSingle = async (id: number) => {
        try {
            const archive = await archiveInquirySingle(id);

            if (archive) {
                setSuccessMessage('Inquiry archived successfully!');
                setTimeout(() => setSuccessMessage(''), 3500);

                return;
            }

            console.log('Archived: ', archive);

        } catch (err) {
            console.error('Failed to archive inquiry: ', err);

            setErrorMessage('Failed to archive inquiry');
            setTimeout(() => setErrorMessage(''), 3500);
        }
    }


    const handleArchiveMultiple = async (ids: number[]) => {
        try {
            if (!Array.isArray(ids)) {
                setErrorMessage('Ids must be an array of id');
                setTimeout(() => setErrorMessage(''), 3500);

                return;
            }

            const response = await archiveInquiryMultiple(ids);
            const data = response.data;

            // await loadInquiries();

            if (data.archived.length > 0) {
                setSuccessMessage(`Successfully archived ${data.archived.length} inquiries.`);
                setTimeout(() => setSuccessMessage(''), 3500)

                return;
            }

            setCheckList([]);
            setConfirmType(null);


        } catch (err: any) {
            
            setErrorMessage(
                err?.response?.data?.message
            );

            setTimeout(() => setErrorMessage(''), 3500);
            return;
        }
    }



    const updateURL = (search: string) => {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());

            params.set("page", "1");

            if (currentStatus) {
                params.set("status", currentStatus);
            }

            if (search.trim()) {
                params.set("search", search.trim());
            } else {
                params.delete("search");
            }

            router.push(`/admin/inquiry?${params.toString()}`);
        }, 400);
    };


    const buildQuery = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());

        params.set("page", String(page));

        return `/admin/inquiry?${params.toString()}`;
    };


    const handleNextPage = () => {
        if (pagination.page < pagination?.totalPages) {
            router.push(buildQuery(pagination.page + 1));
        }
    };

    const handlePrevPage = () => {
        if (pagination.page > 1) {
            router.push(buildQuery(pagination.page - 1));
        }
    };


    /*
        Everytime a lead/oppurtinity is updated (status or stage), this page will refresh after 3 seconds to reflect the latest Go High Level data
    */
    const [isPending, startTransition] = useTransition();
    const lastVersionRef = useRef<number | null>(null);

    useEffect(() => {
        const interval = setInterval(async () => {
            const response = await axios.get(`${BASE_URL}/inquiry/v1/version`);
            const version = response.data.version;

            if (
                lastVersionRef.current !== null &&
                version !== lastVersionRef.current
            ) {
                startTransition(() => {
                    router.refresh();
                });
            }

            lastVersionRef.current = version;
        }, 3000);

        return () => clearInterval(interval);
    }, [router, startTransition]);



    return (
        <>
            {isPending && (
                <div className="w-full h-[3px] z-50 overflow-hidden">
                    <div className="h-full bg-[#1D242B] animate-loading" />
                </div>
            )}

            <div className="flex w-full h-full overflow-y-auto">
                <div className="flex flex-col w-full xl:px-[8rem] lg:px-[1rem] px-[1rem] py-[2rem] gap-[2rem]">

                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-[1rem]">
                            <span className="text-[28px] text-[#1D242B] font-bold leading-tight">Inquiry</span>

                            <div className="flex items-center w-[600px] gap-1">
                                <input
                                    type="search"
                                    placeholder="Search for Reference #, Name or, Contact #"
                                    className="flex w-full text-[16px] bg-[#1D242B]/10 p-2 border-2 border-[#1D242B]/10 rounded-[10px] focus:border-[#0077C0] focus:outline-none"
                                    onChange={(e) => updateURL(e.target.value)}
                                />
                            </div>

                            <select
                                className="px-2 py-[0.6rem] rounded-[10px] min-w-[300px] border-2 border-[#1D242B]/30 text-[16px] font-bold cursor-pointer focus:border-[#0077C0] focus:outline-none"
                                value={activeStatus}
                                onChange={(e) => {
                                    const value = e.target.value;

                                    router.push(
                                        value
                                            ? `/admin/inquiry?inq_status=${value}`
                                            : "/admin/inquiry"
                                    );
                                }}
                            >
                                {tabs.map((tab) => (
                                    <option key={tab.value} value={tab.value}>
                                        {tab.label}
                                    </option>
                                ))}
                            </select>
                        </div>


                        {/* <div className="flex items-center gap-2">
                            {tabs.map(tab => (
                                <Link
                                    key={tab.value}
                                    href={`/admin/inquiry${tab.value ? `?inq_status=${tab.value}` : ""}`}
                                    className={`px-3 py-1 rounded-full text-sm font-bold border
                                        ${activeStatus === tab.value
                                            ? "bg-[#0077C0] text-white hover:bg-[#0077C0]/80"
                                            : "bg-transparent text-[#1D242B] border-[#1D242B]/30 hover:bg-[#1D242B]/10"
                                        }
                                    `}
                                >
                                    {tab.label}
                                </Link>
                            ))}
                        </div> */}
                        

                        <div className="relative flex items-center gap-2">
                            <button onClick={() => setCreateModalOpen(prev => !prev)} className="flex items-center p-1 cursor-pointer bg-[#0077C0] hover:bg-[#1D242B] text-[#FAFAFA] active:bg-[#0077C0] rounded-[8px] transition-all duration-100">
                                <span className="px-3 py-1 font-bold whitespace-nowrap">+ Create Inquiry</span>
                            </button>
                                
                            <button onClick={() => setMenuOpen(prev => !prev)} className="flex item-center justify-center cursor-pointer bg-[#1D242B]/15 hover:bg-[#1D242B]/30 active:bg-[#1D242B]/15 rounded-full p-2 transitional-all duration-100">
                                <Menu className="w-[20px] h-[20px]" />
                            </button>

                            {menuOpen && (
                                <div className="absolute top-7 right-5 flex flex-col bg-[#FAFAFA] gap-1 p-1 rounded-[10px] border border-[#1D242B]/25 z-20">
                                    <Link href={'/admin/inquiry/archives'} className="flex items-center justify-center p-1 cursor-pointer bg-[#1D242B]/25 hover:bg-[#0077C0]/40 active:bg-[#1D242B]/25 rounded-[8px] transition-all duration-100">
                                        <ArchiveIcon className="w-[20px] h-[20px]" />
                                        <span className="px-3 py-2 font-bold">Archives</span>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col w-full">

                        <div className="grid grid-cols-[10%_15%_15%_20%_10%_10%_20%] justify-items-center border-b border-b-[#1D242B]/45 px-[1rem] py-1">
                            <span className="text-[14px] text-[#1D242B]/75">Inqiury Type</span>
                            <span className="text-[14px] text-[#1D242B]/75">Reference #</span>
                            <span className="text-[14px] text-[#1D242B]/75">Name</span>
                            <span className="text-[14px] text-[#1D242B]/75">Contact #</span>
                            <span className="text-[14px] text-[#1D242B]/75">Stage</span>
                            <span className="text-[14px] text-[#1D242B]/75">Status</span>
                            <span className="text-[14px] text-[#1D242B]/75">Submitted at (yyy-mm-dd)</span>
                        </div>

                        <div className="flex flex-col w-full h-[500px] overflow-y-auto">
                            {inquiryList.length > 0 ? (
                                inquiryList.map(inquiry => (
                                    <div key={inquiry.id} 
                                        onClick={() => {
                                            setSelectedId(inquiry.id);
                                            setSender(inquiry.fullname)
                                            viewModal(inquiry.id);
                                        }}
                                    className="group grid grid-cols-[10%_15%_15%_20%_10%_10%_20%] border-b border-b-[#1D242B]/15 py-3 place-items-center justify-items-center hover:bg-[#C7EEFF]/25 active:bg-[#FAFAFA] cursor-pointer px-[1rem] transition-all duration-100">
                                        <span className={`px-2 rounded-full text-[14px] font-bold
                                                ${inquiry.type === 'room_inquiry' 
                                                    ? 'bg-[#0077C0]/25 text-[#0077C0]' 
                                                    : 'bg-[#1D242B]/25 text-[#1D242B]/75'}
                                            `}>
                                            {inquiry.type}
                                        </span>
                                        <span className="text-[14px] text-[#1D242B] font-bold">{inquiry.reference_number}</span>
                                        <span className="text-[14px] text-[#1D242B] font-bold">{inquiry.fullname}</span>
                                        <span className="text-[14px] text-[#1D242B] font-bold">{inquiry.contact_number.replace(/\s+/g, '')}</span>
                                        <span 
                                            className={`px-2 py-1 text-[14px] text-cetner font-bold w-fit rounded-full
                                            ${inquiry?.ghl_pipeline_stage === 'New Lead' ?'bg-[#F9A825]/10 text-[#F9A825]' 
                                                : inquiry?.ghl_pipeline_stage === 'Contacted' ? 'bg-[#303F9F]/25 text-[#303F9F]'
                                                : inquiry?.ghl_pipeline_stage === 'Qualified' ? 'bg-[#009688]/25 text-[#009688]'
                                                : inquiry?.ghl_pipeline_stage === 'Proposal Sent' ? 'bg-[#3A8E5C]/10 text-[#3A8E5C]'
                                                : inquiry?.ghl_pipeline_stage === 'Negotiation' ? 'bg-[#42325D]/25 text-[#42325D]'
                                                : 'bg-[#F44336]/25 text-[#F44336]'
                                            }
                                        `}>{inquiry.ghl_pipeline_stage}</span>
                                        <span 
                                            className={`px-2 py-1 text-[14px] font-bold w-fit rounded-full
                                                ${inquiry?.ghl_status === 'open' ?'bg-[#0077C0]/15 text-[#0077C0]' 
                                                : inquiry?.ghl_status === 'won' ? 'bg-[#57F000]/25 text-[#3A8E5C]'
                                                : inquiry?.ghl_status === 'lost' ? 'bg-[#009688]/25 text-[#009688]'
                                                : 'bg-[#F44336]/25 text-[#F44336]'
                                            }
                                        `}>{inquiry?.ghl_status.charAt(0).toUpperCase() + inquiry?.ghl_status.slice(1).toLowerCase()}</span>

                                        <div className="relative flex items-center gap-[1rem]">
                                            <div className="flex flex-col items-center justify-center group-hover:opacity-0">
                                                <span className="leading-tight text-[14px] text-[#1D242B] font-bold">
                                                    {inquiry.created_at.split("T")[0].split("-").join("-")}
                                                </span>
                                                <span className="text-[12px] font-bold opacity-50 leading-tight">
                                                    {timeAgo(inquiry.created_at)}
                                                </span>
                                            </div>

                                            <button
                                                onClick={() => {
                                                    setSelectedId(inquiry.id);
                                                setSender(inquiry.fullname);
                                                viewModal(inquiry.id);
                                            }}
                                                className="
                                                    absolute right-0 top-1/2 -translate-y-1/2
                                                    flex items-center gap-1
                                                    opacity-0 group-hover:opacity-100
                                                    cursor-pointer
                                                    bg-[#0077C0]/25
                                                    hover:bg-[#0077C0]/50
                                                    active:bg-[#0077C0]/25
                                                    px-3 py-1 rounded-full
                                                "
                                            >
                                                <span className="font-bold opacity-90">View</span>
                                                <Arrow className="w-[30px] h-[25px]" />
                                            </button>
                                        </div>


                                        {/* <button  className="flex items-center cursor-pointer rounded-full opacity-0 bg-[#1D242B]/10 group-hover:opacity-100 hover:bg-[#0077C0]/25 active:bg-[#1D242B]/10 px-2">
                                            <span className="px-2 text-[#1D242B] text-[14px] font-bold">View</span>
                                        </button> */}
                                    </div>
                                ))
                            ) : (
                                <div className='flex items-center justify-center w-full h-[400px]'>
                                    <span className='text-[16px] font-bold'>Nothing to show yet...</span>
                                </div>
                            )}
                        </div>

                        <div className='flex items-center justify-center w-full gap-2 pt-[2rem]'>
                            <button onClick={handlePrevPage} disabled={pagination.page === 1} 
                            className={`cursor-pointer bg-[#141414]/15 p-2 border-2 border-[#141414]/50 rounded-[10px] ${pagination.page === 1 && 'opacity-25'}`}>
                                Prev
                            </button>

                            <span className='p-2 px-4 border-2 border-[#141414] rounded-[10px]'>{pagination.page}</span>

                            <button onClick={handleNextPage} disabled={pagination.page >= pagination?.totalPages} 
                            className={`cursor-pointer p-2 bg-[#141414]/15 border-2  border-[#141414]/50 rounded-[10px] ${pagination.page >= pagination?.totalPages && 'opacity-25'}`}>
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {modalOpen && inquiry && (
                <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
                    <InquiryModalWrapper 
                        modalOpen={() => setModalOpen(false)}
                        inquiry={inquiry}
                        onSuccess={() => router.refresh()}
                        onDelete={() => setConfirmType('single')}
                        onArchiveSingle={() => setConfirmType('archive_single')}
                        successMessage={(msg) => setSuccessMessage(msg)}
                        errorMessage={(msg) => setErrorMessage(msg)}
                    />
                </div>
            )}


            {createModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <InquiryCreateModalWrapper 
                        setModalClose={setCreateModalOpen}
                        setErrorMessage={setErrorMessage}
                        setSuccessMessage={setSuccessMessage}
                        roomUUIDs={roomUUIDs}
                    />
                </div>
            )}

            {checkList.length > 0 && (
                <div className="z-20">
                    <WindowDeleteMultiple 
                        count={checkList.length}
                        ids={checkList}
                        onCancel={() => setCheckList([])}
                        onConfirm={() => setConfirmType('multiple')}
                        onArchive={() => setConfirmType('archive')}   /// add the function here first 
                    />
                </div>
            )}

            {confirmType === 'multiple' && checkList.length > 0 && selectedId === null &&  (
                <ConfirmWindow 
                    title={`Delete Inquiries`}
                    message={`You will be deleting ${checkList.length} inquiries. Do you want to proceed`}
                    onCancel={() => {
                        setConfirmType(null)
                        // setCheckList([]);
                    }}
                    onConfirm={async () => {
                        await handleDeleteMultiple(checkList);
                        router.refresh();
                        setConfirmType(null);
                        resetModal();
                    }}
                />
            )}

            {confirmType === 'single' && (
                <ConfirmWindow
                    title={'Delete Inquiry'}
                    message={`You are about to delete an inquiry from ${sender}. Do you want to proceed?`}
                    onCancel={() => {
                        setConfirmType(null);
                        setSelectedId(null);
                    }}
                    onConfirm={async () => {
                        await handleDeleteSingle(Number(selectedId));
                        // await loadInquiries('');
                        router.refresh(); // this instead of calling 'loadInquiries' function
                        setConfirmType(null)
                        resetModal();
                    }}
                />
            )}

            {confirmType === 'archive' && (
                <ConfirmWindow
                    title={'Archive Inquiries'}
                    message={`You will be archiving ${checkList.length} inquiries. Do you want to proceed?`}
                    onCancel={() => {
                        setConfirmType(null);
                        // setCheckList([]);
                    }}
                    onConfirm={async () => {
                        await handleArchiveMultiple(checkList); 
                        // await loadInquiries('');
                        router.refresh(); // this instead of calling 'loadInquiries' function
                        setConfirmType(null) 
                        setCheckList([])
                        resetModal(); 
                    }}
                />
            )}

            {confirmType === 'archive_single' && (
                <ConfirmWindow
                    title={'Archive Inquiry'}
                    message={`You are about to archive an inquiry from ${sender}. Do you want to proceed?`}
                    onCancel={() => {
                        setConfirmType(null);
                        setSelectedId(null);
                    }}
                    onConfirm={async () => {
                        await handleArchiveSingle(Number(selectedId)); // change this to handleArchiveMultiple
                        // await loadInquiries(''); 
                        router.refresh(); // this instead of calling 'loadInquiries' function
                        setConfirmType(null) 
                        resetModal(); 
                    }}
                />
            )}


            {errorMessage && <ErrorToast message={errorMessage} />}
            {successMessage && <SuccessToast message={successMessage} />}
        </>
    )
}


// --------------------- USE FOR FALLBACK - No INTEGRATION - PURE WEBSITE -------------------------- //


// "use client"

// import { useEffect, useState, useRef, useTransition } from "react";
// import { useRouter } from "next/navigation";
// import { BASE_URL } from "@/config/config";
// import axios from "axios";

// // icons
// import Arrow from '@/asset/icon/arrow-right.svg'
// import Menu from '@/asset/icon/menu-three-dots.svg'
// import ArchiveIcon from '@/asset/icon/archive.svg'

// // toast
// import ErrorToast from "@/components/admin/Toast/ErrorToast";
// import SuccessToast from "@/components/admin/Toast/SuccessToast";

// import { InquiryPageType, InquiryModalType, Pagination } from "./page"
// import InquiryModalWrapper from "./InquiryModalWrapper";
// import { getAllInquiry, getInquiryById, deleteSingleInquiry, deleteMultipleInquiry, archiveInquirySingle, archiveInquiryMultiple } from "../../../../lib/inquiry";
// import WindowDeleteMultiple from "@/components/admin/WindowDeleteMultiple";
// import ConfirmWindow from "@/components/admin/Toast/ConfirmWindow";

// import Link from "next/link";
// import { usePathname, useSearchParams } from "next/navigation";
// import { timeAgo } from "../../../../helpers/timeFormat";
// import InquiryCreateModalWrapper from "./InquiryCreateModalWrapper";

// export type RoomUUIDType = {
//     room_uuid: string,
//     type: string
// }

// interface InquiryPageProp {
//     inquiries: InquiryPageType[];
//     pagination: Pagination;
//     currentStatus: string,
//     roomUUIDs: RoomUUIDType[]
// }

// export default function InquiryPageWrapper ({ inquiries, pagination, currentStatus, roomUUIDs }: InquiryPageProp) {
 

//     // const [inquiryList, setInquiryList] = useState<InquiryPageType[]>(inquiries)
//     const inquiryList = inquiries;
//     const [inquiry, setInquiry] = useState<InquiryModalType | null>(null);

//     const [selectedId, setSelectedId] = useState<number | null>(null);
//     const [sender, setSender] = useState<string>('');

//     const [modalOpen, setModalOpen] = useState<boolean>(false);
//     const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
//     const [menuOpen, setMenuOpen] = useState<boolean>(false);

//     const [checkList, setCheckList] = useState<number[]>([]);
//     const [confirmOpen, setConfirmOpen] = useState<boolean>(false)
//     const [confirmType, setConfirmType] = useState<'single' | 'multiple' | 'archive' | 'archive_single' | null>(null);

//     const [errorMessage, setErrorMessage] = useState<string>('');
//     const [successMessage, setSuccessMessage] = useState<string>('');


//     const searchParams = useSearchParams();
//     const activeStatus = searchParams.get("inq_status") || "";

//     const tabs = [
//         { label: "All", value: "" },
//         { label: "New lead", value: "New lead" },
//         { label: "Contacted", value: "Contacted" },
//         { label: "Qualified", value: "Qualified" },
//         { label: "Closed - Won", value: "Closed - Won" },
//         { label: "Closed - Lost", value: "Closed - Lost" }
//     ];

//     const router = useRouter();
//     const debounceRef = useRef<NodeJS.Timeout | null>(null);



//     const viewModal = async (id: number) => {
//         const inquiry = await getInquiryById(id);

//         if (!inquiry) return null;

//         setModalOpen(true)
//         setInquiry(inquiry);
//     }



//     // const loadInquiries = async (status?: string) => {
//     //     const response = await getAllInquiry(status);
//     //     setInquiryList(response);
//     // }


//     const resetModal = () => {
//         setModalOpen(false);
//         setInquiry(null);
//         setSelectedId(null);
//         setSender('');
//     };


//     const handleDeleteSingle = async (id: number) => {
//         try {

//             const deleted = await deleteSingleInquiry(id);

//             if (deleted) {
//                 // await loadInquiries();

//                 setSuccessMessage('Delete successful');
//                 setTimeout(() => setSuccessMessage(''), 2500);

//                 setSelectedId(null);
//                 setConfirmType(null);
//             }

//             console.log('delete report: ', deleted);

//         } catch (err: any) {
//             setErrorMessage(
//                 err.response?.data?.message
//             );

//             setTimeout(() => setErrorMessage(''), 2500);
//             return;
//         }
//     }


//     const handleDeleteMultiple = async (ids: number[]) => {
//         try {

//             console.log('ids: ', ids);

//             const response = await deleteMultipleInquiry(ids);
//             const data = response.data;

//             // await loadInquiries();

//             if (data.deleted.length > 0) {
//                 setSuccessMessage(`Successfully deleted ${data.deleted.length} inquiries.`);
//                 setTimeout(() => setSuccessMessage(''), 2500);
//             }

//             if (data.not_closed.length > 0) {
//                 setErrorMessage(
//                     `Some inquiries were not deleted due to 'unclosed' status`
//                 );

//                 setTimeout(() => setErrorMessage(''), 5000);
//             }

//             if (data.not_found.length > 0) {
//                 const messages = data.not_found
//                     .map((n: any) => `ID ${n.id} not found`)
//                     .join(', ');

//                 setErrorMessage(`Not found: ${messages}`);

//                 setTimeout(() => setErrorMessage(''), 3500);
//             }

//             setCheckList([]);
//             setConfirmType(null);

//         } catch (err: any) {
//             setErrorMessage(
//                 err.response?.data?.message
//             );

//             setTimeout(() => setErrorMessage(''), 3500);
//             return;
//         }
//     };


//     const handleArchiveSingle = async (id: number) => {
//         try {
//             const archive = await archiveInquirySingle(id);

//             if (archive) {
//                 setSuccessMessage('Inquiry archived successfully!');
//                 setTimeout(() => setSuccessMessage(''), 3500);

//                 return;
//             }

//             console.log('Archived: ', archive);

//         } catch (err) {
//             console.error('Failed to archive inquiry: ', err);

//             setErrorMessage('Failed to archive inquiry');
//             setTimeout(() => setErrorMessage(''), 3500);
//         }
//     }


//     const handleArchiveMultiple = async (ids: number[]) => {
//         try {
//             if (!Array.isArray(ids)) {
//                 setErrorMessage('Ids must be an array of id');
//                 setTimeout(() => setErrorMessage(''), 3500);

//                 return;
//             }

//             const response = await archiveInquiryMultiple(ids);
//             const data = response.data;

//             // await loadInquiries();

//             if (data.archived.length > 0) {
//                 setSuccessMessage(`Successfully archived ${data.archived.length} inquiries.`);
//                 setTimeout(() => setSuccessMessage(''), 3500)

//                 return;
//             }

//             setCheckList([]);
//             setConfirmType(null);


//         } catch (err: any) {
            
//             setErrorMessage(
//                 err?.response?.data?.message
//             );

//             setTimeout(() => setErrorMessage(''), 3500);
//             return;
//         }
//     }



//     const updateURL = (search: string) => {
//         if (debounceRef.current) clearTimeout(debounceRef.current);

//         debounceRef.current = setTimeout(() => {
//             const params = new URLSearchParams(searchParams.toString());

//             params.set("page", "1");

//             if (currentStatus) {
//                 params.set("status", currentStatus);
//             }

//             if (search.trim()) {
//                 params.set("search", search.trim());
//             } else {
//                 params.delete("search");
//             }

//             router.push(`/admin/inquiry?${params.toString()}`);
//         }, 400);
//     };


//     const buildQuery = (page: number) => {
//         const params = new URLSearchParams(searchParams.toString());

//         params.set("page", String(page));

//         return `/admin/inquiry?${params.toString()}`;
//     };


//     const handleNextPage = () => {
//         if (pagination.page < pagination?.totalPages) {
//             router.push(buildQuery(pagination.page + 1));
//         }
//     };

//     const handlePrevPage = () => {
//         if (pagination.page > 1) {
//             router.push(buildQuery(pagination.page - 1));
//         }
//     };


//     /*
//         Everytime a lead/oppurtinity is updated (status or stage), this page will refresh after 3 seconds to reflect the latest Go High Level data
//     */
//     const [isPending, startTransition] = useTransition();
//     const lastVersionRef = useRef<number | null>(null);

//     useEffect(() => {
//         const interval = setInterval(async () => {
//             const response = await axios.get(`${BASE_URL}/inquiry/v1/version`);
//             const version = response.data.version;

//             if (
//                 lastVersionRef.current !== null &&
//                 version !== lastVersionRef.current
//             ) {
//                 startTransition(() => {
//                     router.refresh();
//                 });
//             }

//             lastVersionRef.current = version;
//         }, 3000);

//         return () => clearInterval(interval);
//     }, [router, startTransition]);



//     return (
//         <>
//             {isPending && (
//                 <div className="w-full h-[3px] z-50 overflow-hidden">
//                     <div className="h-full bg-[#1D242B] animate-loading" />
//                 </div>
//             )}

//             <div className="flex w-full h-full overflow-y-auto">
//                 <div className="flex flex-col w-full xl:px-[8rem] lg:px-[1rem] px-[1rem] py-[2rem] gap-[2rem]">

//                     <div className="flex items-center justify-between w-full">
//                         <div className="flex items-center gap-[1rem]">
//                             <span className="text-[28px] text-[#1D242B] font-bold leading-tight">Inquiry</span>

//                             <div className="flex items-center w-[600px] gap-1">
//                                 <input
//                                     type="search"
//                                     placeholder="Search for Reference #, Name or, Contact #"
//                                     className="flex w-full text-[16px] bg-[#1D242B]/10 p-2 border-2 border-[#1D242B]/10 rounded-[10px] focus:border-[#0077C0] focus:outline-none"
//                                     onChange={(e) => updateURL(e.target.value)}
//                                 />
//                             </div>

//                             <select
//                                 className="px-2 py-[0.6rem] rounded-[10px] min-w-[300px] border-2 border-[#1D242B]/30 text-[16px] font-bold cursor-pointer focus:border-[#0077C0] focus:outline-none"
//                                 value={activeStatus}
//                                 onChange={(e) => {
//                                     const value = e.target.value;

//                                     router.push(
//                                         value
//                                             ? `/admin/inquiry?inq_status=${value}`
//                                             : "/admin/inquiry"
//                                     );
//                                 }}
//                             >
//                                 {tabs.map((tab) => (
//                                     <option key={tab.value} value={tab.value}>
//                                         {tab.label}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>


//                         {/* <div className="flex items-center gap-2">
//                             {tabs.map(tab => (
//                                 <Link
//                                     key={tab.value}
//                                     href={`/admin/inquiry${tab.value ? `?inq_status=${tab.value}` : ""}`}
//                                     className={`px-3 py-1 rounded-full text-sm font-bold border
//                                         ${activeStatus === tab.value
//                                             ? "bg-[#0077C0] text-white hover:bg-[#0077C0]/80"
//                                             : "bg-transparent text-[#1D242B] border-[#1D242B]/30 hover:bg-[#1D242B]/10"
//                                         }
//                                     `}
//                                 >
//                                     {tab.label}
//                                 </Link>
//                             ))}
//                         </div> */}
                        

//                         <div className="relative flex items-center gap-2">
//                             <button onClick={() => setCreateModalOpen(prev => !prev)} className="flex items-center p-1 cursor-pointer bg-[#0077C0] hover:bg-[#1D242B] text-[#FAFAFA] active:bg-[#0077C0] rounded-[8px] transition-all duration-100">
//                                 <span className="px-3 py-1 font-bold whitespace-nowrap">+ Create Inquiry</span>
//                             </button>
                                
//                             <button onClick={() => setMenuOpen(prev => !prev)} className="flex item-center justify-center cursor-pointer bg-[#1D242B]/15 hover:bg-[#1D242B]/30 active:bg-[#1D242B]/15 rounded-full p-2 transitional-all duration-100">
//                                 <Menu className="w-[20px] h-[20px]" />
//                             </button>

//                             {menuOpen && (
//                                 <div className="absolute top-7 right-5 flex flex-col bg-[#FAFAFA] gap-1 p-1 rounded-[10px] border border-[#1D242B]/25 z-20">
//                                     <Link href={'/admin/inquiry/archives'} className="flex items-center justify-center p-1 cursor-pointer bg-[#1D242B]/25 hover:bg-[#0077C0]/40 active:bg-[#1D242B]/25 rounded-[8px] transition-all duration-100">
//                                         <ArchiveIcon className="w-[20px] h-[20px]" />
//                                         <span className="px-3 py-2 font-bold">Archives</span>
//                                     </Link>
//                                 </div>
//                             )}
//                         </div>
//                     </div>

//                     <div className="flex flex-col w-full">

//                         <div className="grid grid-cols-[5%_15%_15%_15%_20%_10%_20%] justify-items-center border-b border-b-[#1D242B]/45 px-[1rem] py-1">
//                             <span></span>
//                             <span className="text-[14px] text-[#1D242B]/75">Inqiury Type</span>
//                             <span className="text-[14px] text-[#1D242B]/75">Reference #</span>
//                             <span className="text-[14px] text-[#1D242B]/75">Name</span>
//                             <span className="text-[14px] text-[#1D242B]/75">Contact #</span>
//                             <span className="text-[14px] text-[#1D242B]/75">Stage</span>
//                             <span className="text-[14px] text-[#1D242B]/75">Submitted at (yyy-mm-dd)</span>
//                         </div>

//                         <div className="flex flex-col w-full h-[500px] overflow-y-auto">
//                             {inquiryList.length > 0 ? (
//                                 inquiryList.map(inquiry => (
//                                     <div key={inquiry.id} 
//                                     className="group grid grid-cols-[5%_15%_15%_15%_20%_10%_20%] border-b border-b-[#1D242B]/15 py-3 place-items-center justify-items-center hover:bg-[#C7EEFF]/25 active:bg-[#FAFAFA] px-[1rem] transition-all duration-100">
//                                         <input type="checkbox" name="inquiry_checker" id={`inquiry_${inquiry.id}`} 
//                                             checked={checkList.includes(inquiry.id)}
//                                             onChange={(e) => {
//                                                     if (e.target.checked) {
//                                                         setCheckList( prev => [inquiry.id, ...prev] )
//                                                     } else {
//                                                         setCheckList( prev => prev.filter(id => id !== inquiry.id))
//                                                     }
//                                                 }
//                                             }
//                                         />

//                                         <span className={`px-2 rounded-full text-[14px] font-bold
//                                                 ${inquiry.type === 'room_inquiry' 
//                                                     ? 'bg-[#0077C0]/25 text-[#0077C0]' 
//                                                     : 'bg-[#1D242B]/25 text-[#1D242B]/75'}
//                                             `}>
//                                             {inquiry.type}
//                                         </span>
//                                         <span className="text-[14px] text-[#1D242B] font-bold">{inquiry.reference_number}</span>
//                                         <span className="text-[14px] text-[#1D242B] font-bold">{inquiry.fullname}</span>
//                                         <span className="text-[14px] text-[#1D242B] font-bold">{inquiry.contact_number.replace(/\s+/g, '')}</span>
//                                         <span 
//                                             className={`px-2 py-1 text-[14px] text-cetner font-bold w-fit rounded-full
//                                             ${inquiry?.inq_status === 'New lead' ?'bg-[#F9A825]/10 text-[#F9A825]' 
//                                                 : inquiry?.inq_status === 'Contacted' ? 'bg-[#303F9F]/25 text-[#303F9F]'
//                                                 : inquiry?.inq_status === 'Qualified' ? 'bg-[#009688]/25 text-[#009688]'
//                                                 : inquiry?.inq_status === 'Closed - Won' ? 'bg-[#3A8E5C]/10 text-[#3A8E5C]'
//                                                 : 'bg-[#F44336]/25 text-[#F44336]'
//                                             }
//                                         `}>{inquiry.inq_status}</span>

//                                         <div className="relative flex items-center gap-[1rem]">
//                                             <div className="flex flex-col items-center justify-center group-hover:opacity-0">
//                                                 <span className="leading-tight text-[14px] text-[#1D242B] font-bold">
//                                                     {inquiry.created_at.split("T")[0].split("-").join("-")}
//                                                 </span>
//                                                 <span className="text-[12px] font-bold opacity-50 leading-tight">
//                                                     {timeAgo(inquiry.created_at)}
//                                                 </span>
//                                             </div>

//                                             <button
//                                                 onClick={() => {
//                                                     setSelectedId(inquiry.id);
//                                                     setSender(inquiry.fullname);
//                                                     viewModal(inquiry.id);
//                                                 }}
//                                                 className="
//                                                     absolute right-0 top-1/2 -translate-y-1/2
//                                                     flex items-center gap-1
//                                                     opacity-0 group-hover:opacity-100
//                                                     cursor-pointer
//                                                     bg-[#0077C0]/25
//                                                     hover:bg-[#0077C0]/50
//                                                     active:bg-[#0077C0]/25
//                                                     px-3 py-1 rounded-full
//                                                 "
//                                             >
//                                                 <span className="font-bold opacity-90">View</span>
//                                                 <Arrow className="w-[30px] h-[25px]" />
//                                             </button>
//                                         </div>
//                                     </div>
//                                 ))
//                             ) : (
//                                 <div className='flex items-center justify-center w-full h-[400px]'>
//                                     <span className='text-[16px] font-bold'>Nothing to show yet...</span>
//                                 </div>
//                             )}
//                         </div>

//                         <div className='flex items-center justify-center w-full gap-2 pt-[2rem]'>
//                             <button onClick={handlePrevPage} disabled={pagination.page === 1} 
//                             className={`cursor-pointer bg-[#141414]/15 p-2 border-2 border-[#141414]/50 rounded-[10px] ${pagination.page === 1 && 'opacity-25'}`}>
//                                 Prev
//                             </button>

//                             <span className='p-2 px-4 border-2 border-[#141414] rounded-[10px]'>{pagination.page}</span>

//                             <button onClick={handleNextPage} disabled={pagination.page >= pagination?.totalPages} 
//                             className={`cursor-pointer p-2 bg-[#141414]/15 border-2  border-[#141414]/50 rounded-[10px] ${pagination.page >= pagination?.totalPages && 'opacity-25'}`}>
//                                 Next
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {modalOpen && inquiry && (
//                 <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
//                     <InquiryModalWrapper 
//                         modalOpen={() => setModalOpen(false)}
//                         inquiry={inquiry}
//                         onSuccess={() => router.refresh()}
//                         onDelete={() => setConfirmType('single')}
//                         onArchiveSingle={() => setConfirmType('archive_single')}
//                         successMessage={(msg) => setSuccessMessage(msg)}
//                         errorMessage={(msg) => setErrorMessage(msg)}
//                     />
//                 </div>
//             )}


//             {createModalOpen && (
//                 <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//                     <InquiryCreateModalWrapper 
//                         setModalClose={setCreateModalOpen}
//                         setErrorMessage={setErrorMessage}
//                         setSuccessMessage={setSuccessMessage}
//                         roomUUIDs={roomUUIDs}
//                     />
//                 </div>
//             )}

//             {checkList.length > 0 && (
//                 <div className="z-20">
//                     <WindowDeleteMultiple 
//                         count={checkList.length}
//                         ids={checkList}
//                         onCancel={() => setCheckList([])}
//                         onConfirm={() => setConfirmType('multiple')}
//                         onArchive={() => setConfirmType('archive')}   /// add the function here first 
//                     />
//                 </div>
//             )}

//             {confirmType === 'multiple' && checkList.length > 0 && selectedId === null &&  (
//                 <ConfirmWindow 
//                     title={`Delete Inquiries`}
//                     message={`You will be deleting ${checkList.length} inquiries. Do you want to proceed`}
//                     onCancel={() => {
//                         setConfirmType(null)
//                         // setCheckList([]);
//                     }}
//                     onConfirm={async () => {
//                         await handleDeleteMultiple(checkList);
//                         router.refresh();
//                         setConfirmType(null);
//                         resetModal();
//                     }}
//                 />
//             )}

//             {confirmType === 'single' && (
//                 <ConfirmWindow
//                     title={'Delete Inquiry'}
//                     message={`You are about to delete an inquiry from ${sender}. Do you want to proceed?`}
//                     onCancel={() => {
//                         setConfirmType(null);
//                         setSelectedId(null);
//                     }}
//                     onConfirm={async () => {
//                         await handleDeleteSingle(Number(selectedId));
//                         // await loadInquiries('');
//                         router.refresh(); // this instead of calling 'loadInquiries' function
//                         setConfirmType(null)
//                         resetModal();
//                     }}
//                 />
//             )}

//             {confirmType === 'archive' && (
//                 <ConfirmWindow
//                     title={'Archive Inquiries'}
//                     message={`You will be archiving ${checkList.length} inquiries. Do you want to proceed?`}
//                     onCancel={() => {
//                         setConfirmType(null);
//                         // setCheckList([]);
//                     }}
//                     onConfirm={async () => {
//                         await handleArchiveMultiple(checkList); 
//                         // await loadInquiries('');
//                         router.refresh(); // this instead of calling 'loadInquiries' function
//                         setConfirmType(null) 
//                         setCheckList([])
//                         resetModal(); 
//                     }}
//                 />
//             )}

//             {confirmType === 'archive_single' && (
//                 <ConfirmWindow
//                     title={'Archive Inquiry'}
//                     message={`You are about to archive an inquiry from ${sender}. Do you want to proceed?`}
//                     onCancel={() => {
//                         setConfirmType(null);
//                         setSelectedId(null);
//                     }}
//                     onConfirm={async () => {
//                         await handleArchiveSingle(Number(selectedId)); // change this to handleArchiveMultiple
//                         // await loadInquiries(''); 
//                         router.refresh(); // this instead of calling 'loadInquiries' function
//                         setConfirmType(null) 
//                         resetModal(); 
//                     }}
//                 />
//             )}


//             {errorMessage && <ErrorToast message={errorMessage} />}
//             {successMessage && <SuccessToast message={successMessage} />}
//         </>
//     )
// }