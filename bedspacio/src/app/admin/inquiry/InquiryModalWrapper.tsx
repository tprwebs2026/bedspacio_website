// ----------------- with GoHighLevel Integration ----------------- //


"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { InquiryModalType } from "./page"
import { BASE_URL } from '@/config/config'

// icon
import Arrow from '@/asset/icon/arrow-long.svg'
import Menu from '@/asset/icon/menu-three-dots.svg'
import Close from '@/asset/icon/close.svg'
import Cancel from '@/asset/icon/cancel.svg'
import Delete from '@/asset/icon/delete.svg'
import Add from '@/asset/icon/add.svg'
import Note from '@/asset/icon/note.svg'
import Archive from '@/asset/icon/archive.svg'
import Check from '@/asset/icon/check-circle.svg'

import { addNewNote, updateStatusById, getInquiryById } from "../../../../lib/inquiry";

import { useAuth } from "@/context/AuthContext";

interface InquiryModalProps { 
    modalOpen: () => void;
    inquiry: InquiryModalType
    onSuccess: () => void;
    onDelete: () => void;
    onArchiveSingle: () => void;
    successMessage: (msg: string) => void;
    errorMessage: (msg: string) => void;
}


export default function InquiryModalWrapper ({ modalOpen, inquiry, onSuccess, onDelete, onArchiveSingle, successMessage, errorMessage }: InquiryModalProps) {

    const { id, fullname } = useAuth();
    const router = useRouter();

    console.log(inquiry)

    const [inquiryData, setInquiryData] = useState(inquiry);
    const [status, setStatus] = useState(inquiry.ghl_status)
    const [notesOpen, setNotesOpen] = useState(
        inquiryData.inquiry_logs.length > 0
    );

    const [menuOpen, setMenuOpen] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false);
    const [note, setNote] = useState<string>('');

    const [statusUpdatedMessage, setStatusUpdatedMessage] = useState<string>('')


    const handleUpdateStatus = async (id: number, status: string) => {
        setLoading(true);
        
        try {
            if (status === inquiryData.ghl_status) {
                setLoading(false);
                return;
            }

            await new Promise<void>((resolve) => {
                setTimeout(() => {
                    setLoading(true);
                    resolve();
                }, 1500);
            });

            const response = await updateStatusById(id, status); 
            if (!response?.success) {
                throw new Error('Update failed');
            }

            const newLog = response.log;
            setInquiryData(prev => ({
                ...prev,
                status,
                inquiry_logs: [
                    ...prev.inquiry_logs,
                    newLog
                ]
            }));

            setStatus(status);

            setStatusUpdatedMessage(`Status updated to ${status}`);
            setTimeout(() => setStatusUpdatedMessage(''), 3500);


            onSuccess();
            // modalOpen();

            return;
        } catch (err: any) {
            console.error('Response data:', err?.response?.data);
        } finally {
            setLoading(false)
        }
    }


    const handleAddNote = async (id: number, note: string, user_id: number) => {
        try {   

            if (!note.trim()) {
                errorMessage('Note is empty.')
                setTimeout(() => errorMessage(''), 3500);

                modalOpen()
                return;
            }

            const response = await addNewNote(
                id,
                note,
                user_id
            );


            const newLog = response.data;
            setInquiryData(prev => ({
                ...prev,
                status,
                inquiry_logs: [
                    ...prev.inquiry_logs,
                    newLog
                ]
            }));
            
            setNote('');
            setNotesOpen(true);

        } catch (err) {
            console.error('Failed to add new note: ', err);
        }
    }

    return (
        <>
            {loading && (
                <div className="absolute flex items-center justify-center h-full w-full bg-[#1D242B]/50 z-20" >
                    <span className="text-[#FAFAFA] font-bold">...loading</span>
                </div>
            )}

            <div className="flex flex-col w-auto h-auto bg-[#FAFAFA] rounded-[10px] border-2 border-[#1D242B]/50 p-[2rem] gap-[1rem]">

                <div className={`relative grid ${notesOpen  ? 'grid-cols-[auto_auto]' : 'grid-cols-[auto_auto]'} overflow-x-hidden`}>
                    <div className={`relative flex flex-col w-[600px] max-h-[600px]  gap-[1rem]`}>
                        <div className="flex items-center w-full justify-between">

                            <div className="flex items-center gap-2">
                                <span className="text-[28px] font-bold">Inquiry Information</span>
                                <span className="text-[14px] text-[#1D242B]/75 font-bold bg-[#1D242B]/10 rounded-full px-3">{inquiryData.type}</span>
                            </div>


                            {/* 
                                Reason for commenting:
                                1. This modal is only going to be used for monitoring only and for historical records.
                                2. No need to delete or archive an inquiry
                                3. GHL will do the deletion.
                            */}
                            {/* <div className="relative flex">
                                <button onClick={() => setMenuOpen(prev => !prev)} className="cursor-pointer bg-[#1D242B]/10 hover:bg-[#1D242B]/20 active:bg-[#1D242B]/10 rounded-full p-2">
                                    <Menu className={`w-[20px] h-[20px] ${menuOpen ? 'rotate-90' : 'rotate-180' } transition-all duration-100`} />
                                    <span></span>
                                </button>

                                {menuOpen && (
                                    <div className="absolute top-5 right-8 flex flex-col gap-1 border-1 border-[#1D242B]/25 rounded-[10px] p-1 bg-[#FAFAFA]">
                                        <button onClick={() => {
                                            onDelete(); setMenuOpen(false)
                                        }} className="flex items-center justify-center bg-[#1D242B]/10 hover:bg-[#1D242B]/20 active:bg-[#1D242B]/10 p-2 rounded-[8px] cursor-pointer">
                                            <span className="font-bold text-[#1D242B] text-[14px] px-2">Delete</span>
                                        </button>
                                        <button onClick={onArchiveSingle} className="flex items-center justify-center bg-[#1D242B]/10 hover:bg-[#1D242B]/20 active:bg-[#1D242B]/10 p-2 rounded-[8px] cursor-pointer">
                                            <span className="font-bold text-[14px] px-2">Archive</span>
                                        </button>
                                    </div>
                                )}
                            </div> */}
                        </div>

                        <div className="flex flex-col w-full gap-[1rem] h-full overflow-y-scroll thin-scrollbar">

                            {/* <div className="flex flex-col items-start w-full">
                                <span className="font-bold">Type </span>
                                <span className="w-full py-2 px-3 rounded-[10px] border border-[#1D242B]/25">{inquiryData.type}</span>
                            </div> */}

                            <div className="flex flex-col items-start w-full">
                                <span className="font-bold">Sent by</span>
                                <span className="w-full py-2 px-3 rounded-[10px] border border-[#1D242B]/25">{inquiryData.fullname}</span>
                            </div>

                            <div className="flex flex-col items-start w-full">
                                <span className="font-bold">Contact number</span>
                                <span className="w-full py-2 px-3 rounded-[10px] border border-[#1D242B]/25">{inquiryData.contact_number}</span>
                            </div>

                            <div className="flex flex-col items-start w-full">
                                <span className="font-bold">Email</span>
                                <span className="w-full py-2 px-3 rounded-[10px] border border-[#1D242B]/25">{inquiryData.email}</span>
                            </div>

                            {inquiryData.type === 'general_inquiry' && (
                                <div className="flex flex-col items-start w-full">
                                    <span className="font-bold">Subject</span>
                                    <span className="w-full py-2 px-3 rounded-[10px] border border-[#1D242B]/25">{inquiryData.subject}</span>
                                </div>
                                )}

                            {inquiryData.type === 'room_inquiry' && (
                                <>
                                    <div className="flex flex-col items-start w-full">
                                        <span className="font-bold">Reference Number</span>
                                        <span className="w-full py-2 px-3 rounded-[10px] border border-[#1D242B]/25">{inquiryData.reference_number}</span>
                                    </div>
                                    
                                    <div className="flex flex-col items-start w-full">
                                        <span className="font-bold">Room ID</span>

                                        <div className="flex items-center justify-between w-full py-2 px-3 rounded-[10px] border border-[#1D242B]/25">
                                            <span className="w-full">{inquiryData.room_uuid}</span>
                                            
                                            {inquiryData.room_id ? (
                                                <Link href={`/admin/room-listing/${parseInt(inquiryData.room_uuid)}`} target={'_blank'} className="flex items-center whitespace-nowrap text-[14px] text-[#1D242B]/90 font-bold opacity-50 hover:opacity-100 active:opacity-75 cursor-pointer">
                                                    <span className="px-2">Check room</span>
                                                </Link>
                                            ) : (
                                                <span className=" cursor-not-allowed whitespace-nowrap text-[14px] text-[#1D242B]/90 font-bold opacity-50">Room deleted</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-start w-full">
                                        <span className="font-bold">Target Move-In (yyyy-mm-dd)</span>
                                        <span className="w-full py-2 px-3 rounded-[10px] border border-[#1D242B]/25">{inquiryData.target_move_in}</span>
                                    </div>

                                    <div className="flex flex-col items-start w-full">
                                        <span className="font-bold">Months of Stay</span>
                                        <span className="w-full py-2 px-3 rounded-[10px] border border-[#1D242B]/25">{inquiryData.months_of_stay} Months</span>
                                    </div>

                                    <div className="flex flex-col items-start w-full">
                                        <span className="font-bold">Work Schedule</span>
                                        <span className="w-full py-2 px-3 rounded-[10px] border border-[#1D242B]/25">{inquiryData.work_schedule}</span>
                                    </div>
                                </>
                            )}
                            

                            <div className="flex flex-col items-start w-full">
                                <span className="font-bold">Message</span>
                                <textarea id="messagge" rows={5} disabled value={inquiryData.message} className="resize-none w-full py-2 px-3 rounded-[10px] border border-[#1D242B]/25"></textarea>
                            </div>


                            <div className="grid grid-cols-2 w-full gap-1">
                                <div className="flex flex-col w-full items-start justify-center">
                                    <span className="font-bold">Status</span>
                                    <span 
                                        className={`text-center font-bold w-full py-2 ${
                                            inquiry?.ghl_status === 'open' ?'bg-[#0077C0]/15 text-[#0077C0]' 
                                            : inquiry?.ghl_status === 'won' ? 'bg-[#57F000]/25 text-[#3A8E5C]'
                                            : inquiry?.ghl_status === 'lost' ? 'bg-[#009688]/25 text-[#009688]'
                                            : 'bg-[#F44336]/25 text-[#F44336]'
                                            }
                                        `}>
                                        {inquiry?.ghl_status.charAt(0).toUpperCase() + inquiry?.ghl_status.slice(1).toLowerCase()}
                                    </span>
                                    
                                </div>

                                <div className="flex flex-col w-full items-start justify-center">
                                    <span className="font-bold">Stage</span>
                                    <span 
                                    className={`text-center font-bold w-full py-2 ${
                                        inquiry?.ghl_pipeline_stage === 'New Lead' ?'bg-[#F9A825]/10 text-[#F9A825]' 
                                        : inquiry?.ghl_pipeline_stage === 'Contacted' ? 'bg-[#303F9F]/25 text-[#303F9F]'
                                        : inquiry?.ghl_pipeline_stage === 'Qualified' ? 'bg-[#009688]/25 text-[#009688]'
                                        : inquiry?.ghl_pipeline_stage === 'Proposal Sent' ? 'bg-[#3A8E5C]/10 text-[#3A8E5C]'
                                        : inquiry?.ghl_pipeline_stage === 'Negotiation' ? 'bg-[#42325D]/25 text-[#42325D]'
                                        : 'bg-[#F44336]/25 text-[#F44336]'
                                            }
                                        `}>{inquiry.ghl_pipeline_stage}</span>
                                </div>
                            </div>


                            
                            <span className="text-[14px] opacity-75">Submitted at {inquiryData.created_at.split("T")[0].split("-").join('-')} by user with IP: {inquiryData.ip_address}</span>
                        </div>

                    </div>
                                
                    {notesOpen && (
                        <div className="flex flex-col w-[400px] pl-[1rem] gap-[1rem] max-h-[600px]">
                            <span className="text-[28px] font-bold">Notes</span>

                            <div className="flex flex-col h-full overflow-y-scroll thin-scrollbar gap-[1rem]">

                                {inquiryData.inquiry_logs.map((logs, index) => (
                                    <div key={index} className="flex flex-col w-full gap-1 rounded-[10px] p-2 shadow-sm bg-[#C7EEFF]/50">
                                        <span className="text-[12px] font-bold opacity-50 text-left">{`Noted at ${logs.noted_at} by ${logs.noter}`}</span>
                                        <p className="w-full text-[14px] focus:outline-none leading-tight">
                                            {logs.note}
                                        </p>
                                    </div>
                                ))}

                                <div className="flex flex-col items-start">
                                    {/* <span className="font-bold opacity-80">Add new note</span> */}

                                    <div className="flex flex-col w-full items-end gap-2">
                                        <textarea name="inquiry_note" id="note" rows={5} placeholder="Describe your note here..."
                                        value={note} onChange={(e) => setNote(e.target.value)}
                                        className="w-full bg-[#1D242B]/10 rounded-[10px] leading-tight text-[14px] focus:outline-none p-2 focus:border-[#1D242B]"></textarea>

                                        <button onClick={() => handleAddNote(inquiryData.id, note, id)} className="flex items-center bg-[#0077C0] hover:bg-[#006AAB] active:bg-[#0077C0] rounded-[10px] px-2 py-1 cursor-pointer">
                                            <Add className="w-[20px] h-[20px]" />
                                            <span className="text-[#FAFAFA] text-[16px] px-1">Add</span>
                                        </button>

                                    </div>
                                </div>  
                            </div>
                        </div>
                    )}
                </div>


                <div className={`flex items-center w-full justify-end`}>
                    <div className="flex items-center gap-1">

                        <button onClick={() => setNotesOpen(prev => !prev)} className="flex items-center cursor-pointer bg-[#0077C0]/75 hover:bg-[#0077C0]/90 active:bg-[#0077C0]/75 p-2 rounded-[10px] transition-all duration-100">
                            <Note className="w-[20px] h-[20px] stroke-[#1D242B] stroke-2" />
                            <span className="px-2 font-bold text-[16px] text-[#1D242B]">{notesOpen ? 'Hide Note' : 'Show Note'}</span>
                        </button>
                        
                        <button onClick={modalOpen} className="flex items-center cursor-pointer bg-[#1D242B]/25 hover:bg-[#1D242B]/40 active:bg-[#1D242B]/75 p-2 rounded-[10px] transition-all duration-100">
                            <span className="px-2 font-bold text-[16px] text-[#1D242B]">Close</span>
                        </button>
                    </div>

                </div>
            </div>
        </>
    )
}



// -------------- FALLBACK if GoHighLevel is not Integrated ----------------//



// "use client"

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { InquiryModalType } from "./page"
// import { BASE_URL } from '@/config/config'

// // icon
// import Arrow from '@/asset/icon/arrow-long.svg'
// import Menu from '@/asset/icon/menu-three-dots.svg'
// import Close from '@/asset/icon/close.svg'
// import Cancel from '@/asset/icon/cancel.svg'
// import Delete from '@/asset/icon/delete.svg'
// import Add from '@/asset/icon/add.svg'
// import Note from '@/asset/icon/note.svg'
// import Archive from '@/asset/icon/archive.svg'
// import Check from '@/asset/icon/check-circle.svg'

// import { addNewNote, updateInquiryStatusById, getInquiryById, updateInquiryFields } from "../../../../lib/inquiry";

// import { useAuth } from "@/context/AuthContext";

// interface InquiryModalProps { 
//     modalOpen: () => void;
//     inquiry: InquiryModalType
//     onSuccess: () => void;
//     onDelete: () => void;
//     onArchiveSingle: () => void;
//     successMessage: (msg: string) => void;
//     errorMessage: (msg: string) => void;
// }


// export default function InquiryModalWrapper ({ modalOpen, inquiry, onSuccess, onDelete, onArchiveSingle, successMessage, errorMessage }: InquiryModalProps) {

//     const { id, fullname } = useAuth();
//     const router = useRouter();

//     console.log(inquiry)

//     const [inquiryData, setInquiryData] = useState(inquiry);
//     const [inq_status, setStatus] = useState(inquiry.inq_status)
//     const [notesOpen, setNotesOpen] = useState(
//         inquiryData.inquiry_logs.length > 0
//     );

//     const [menuOpen, setMenuOpen] = useState<boolean>(false)
//     const [loading, setLoading] = useState<boolean>(false);
//     const [note, setNote] = useState<string>('');

//     const [statusUpdatedMessage, setStatusUpdatedMessage] = useState<string>('');

//     const [targetMoveIn, setTargetMoveIn] = useState<string>(inquiryData.target_move_in)
//     const [monthsOfStay, setMonthsOfStay] = useState<number>(inquiryData.months_of_stay);
//     const [roomUuid, setRoomUuid] = useState<string>(inquiryData.room_uuid)
//     const [targetMoveInEditing, setTargetMoveInEditing] = useState<boolean>(false);
//     const [monthsOfStayEditing, setMonthsOfStayEditing] = useState<boolean>(false);
//     const [roomUuidEditing, setRoomUuidEditing] = useState<boolean>(false);



//     const handleUpdateStatus = async (id: number, status: string) => {
//         setLoading(true);
        
//         try {
//             if (status === inquiryData.inq_status) {
//                 setLoading(false);
//                 return;
//             }

//             await new Promise<void>((resolve) => {
//                 setTimeout(() => {
//                     setLoading(true);
//                     resolve();
//                 }, 1500);
//             });

//             const response = await updateInquiryStatusById(id, status); 
//             if (!response?.success) {
//                 throw new Error('Update failed');
//             }

//             const newLog = response.log;
//             setInquiryData(prev => ({
//                 ...prev,
//                 status,
//                 inquiry_logs: [
//                     ...prev.inquiry_logs,
//                     newLog
//                 ]
//             }));

//             setStatus(status);

//             setStatusUpdatedMessage(`Status updated to ${status}`);
//             setTimeout(() => setStatusUpdatedMessage(''), 3500);


//             onSuccess();
//             // modalOpen();

//             return;
//         } catch (err: any) {
//             console.error('Response data:', err?.response?.data);
//         } finally {
//             setLoading(false)
//         }
//     }

    
//     interface UpdateInquiryFields {
//         room_uuid?: string;
//         target_move_in?: string;
//         months_of_stay?: number;
//     }

//     const handleUpdateFields = async (
//         id: number,
//         fields: UpdateInquiryFields
//     ) => {

//         setLoading(true);

//         try {

//             await new Promise<void>((resolve) => {
//                 setTimeout(() => {
//                     setLoading(true);
//                     resolve();
//                 }, 1500);
//             });

//             const changedFields: UpdateInquiryFields = {};

//             if (roomUuid !== inquiryData.room_uuid) {
//                 changedFields.room_uuid = fields.room_uuid;
//             }

//             if (targetMoveIn !== inquiryData.target_move_in) {
//                 changedFields.target_move_in = fields.target_move_in;
//             }

//             if (monthsOfStay !== inquiryData.months_of_stay) {
//                 changedFields.months_of_stay = fields.months_of_stay;
//             }

//             if (Object.keys(changedFields).length === 0) {
//                 console.log('No changes detected');
//                 return;
//             }

//             const updates = await updateInquiryFields(id, changedFields);
//             console.log('Updates: ', updates.data);

//             setInquiryData(prev => ({
//                 ...prev,
//                 room_uuid: roomUuid,
//                 target_move_in: targetMoveIn,
//                 months_of_stay: monthsOfStay
//             }));


//             // update successfull
//             setRoomUuidEditing(false);
//             setTargetMoveInEditing(false);
//             setMonthsOfStayEditing(false);

//             // modalOpen();
            
//             successMessage('Update successfull');
//             setTimeout(() => successMessage(''), 3500);



//         } catch (err) {
//             console.error('Failed to updated fields in inquiry: ', err);
//         } finally {
//             setLoading(false);
//         }
//     }


//     const handleAddNote = async (id: number, note: string, user_id: number) => {
//         try {   

//             if (!note.trim()) {
//                 errorMessage('Note is empty.')
//                 setTimeout(() => errorMessage(''), 3500);

//                 modalOpen()
//                 return;
//             }

//             const response = await addNewNote(
//                 id,
//                 note,
//                 user_id
//             );


//             const newLog = response.data;
//             setInquiryData(prev => ({
//                 ...prev,
//                 status,
//                 inquiry_logs: [
//                     ...prev.inquiry_logs,
//                     newLog
//                 ]
//             }));
            
//             setNote('');
//             setNotesOpen(true);

//         } catch (err) {
//             console.error('Failed to add new note: ', err);
//         }
//     }


//     const hasChanges =
//         roomUuid !== inquiryData.room_uuid ||
//         targetMoveIn !== inquiryData.target_move_in ||
//         monthsOfStay !== inquiryData.months_of_stay;






//     return (
//         <>
//             {loading && (
//                 <div className="absolute flex items-center justify-center h-full w-full bg-[#1D242B]/50 z-20" >
//                     <span className="text-[#FAFAFA] font-bold">...loading</span>
//                 </div>
//             )}

//             <div className="flex flex-col w-auto h-auto bg-[#FAFAFA] rounded-[10px] border-2 border-[#1D242B]/50 p-[2rem] gap-[1rem]">

//                 <div className={`relative grid ${notesOpen  ? 'grid-cols-[auto_auto]' : 'grid-cols-[auto_auto]'} overflow-x-hidden`}>
//                     <div className={`relative flex flex-col w-[600px] max-h-[600px]  gap-[1rem]`}>
//                         <div className="flex items-center w-full justify-between">

//                             <div className="flex items-center gap-2">
//                                 <span className="text-[28px] font-bold">Inquiry Information</span>
//                                 <span className="text-[14px] text-[#1D242B]/75 font-bold bg-[#1D242B]/10 rounded-full px-3">{inquiryData.type}</span>
//                             </div>


//                             <div className="relative flex">
//                                 <button onClick={() => setMenuOpen(prev => !prev)} className="cursor-pointer bg-[#1D242B]/10 hover:bg-[#1D242B]/20 active:bg-[#1D242B]/10 rounded-full p-2">
//                                     <Menu className={`w-[20px] h-[20px] ${menuOpen ? 'rotate-90' : 'rotate-180' } transition-all duration-100`} />
//                                     <span></span>
//                                 </button>

//                                 {menuOpen && (
//                                     <div className="absolute top-5 right-8 flex flex-col gap-1 border-1 border-[#1D242B]/25 rounded-[10px] p-1 bg-[#FAFAFA]">
//                                         <button onClick={() => {
//                                             onDelete(); setMenuOpen(false)
//                                         }} className="flex items-center justify-center bg-[#1D242B]/10 hover:bg-[#1D242B]/20 active:bg-[#1D242B]/10 p-2 rounded-[8px] cursor-pointer">
//                                             <span className="font-bold text-[#1D242B] text-[14px] px-2">Delete</span>
//                                         </button>
//                                         <button onClick={onArchiveSingle} className="flex items-center justify-center bg-[#1D242B]/10 hover:bg-[#1D242B]/20 active:bg-[#1D242B]/10 p-2 rounded-[8px] cursor-pointer">
//                                             <span className="font-bold text-[14px] px-2">Archive</span>
//                                         </button>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>

//                         <div className="flex flex-col w-full gap-[1rem] h-full overflow-y-scroll thin-scrollbar">

//                             {/* <div className="flex flex-col items-start w-full">
//                                 <span className="font-bold">Type </span>
//                                 <span className="w-full py-2 px-3 rounded-[10px] border border-[#1D242B]/25">{inquiryData.type}</span>
//                             </div> */}

//                             <div className="flex flex-col items-start w-full">
//                                 <span className="font-bold">Sent by</span>
//                                 <span className="w-full py-2 px-3 rounded-[10px] border border-[#1D242B]/25">{inquiryData.fullname}</span>
//                             </div>

//                             <div className="flex flex-col items-start w-full">
//                                 <span className="font-bold">Contact number</span>
//                                 <span className="w-full py-2 px-3 rounded-[10px] border border-[#1D242B]/25">{inquiryData.contact_number}</span>
//                             </div>

//                             <div className="flex flex-col items-start w-full">
//                                 <span className="font-bold">Email</span>
//                                 <span className="w-full py-2 px-3 rounded-[10px] border border-[#1D242B]/25">{inquiryData.email}</span>
//                             </div>

//                             {inquiryData.type === 'general_inquiry' && (
//                                 <div className="flex flex-col items-start w-full">
//                                     <span className="font-bold">Subject</span>
//                                     <span className="w-full py-2 px-3 rounded-[10px] border border-[#1D242B]/25">{inquiryData.subject}</span>
//                                 </div>
//                                 )}

//                             {inquiryData.type === 'room_inquiry' && (
//                                 <>
//                                     <div className="flex flex-col items-start w-full">
//                                         <span className="font-bold">Reference Number</span>
//                                         <span className="w-full py-2 px-3 rounded-[10px] border border-[#1D242B]/25">{inquiryData.reference_number}</span>
//                                     </div>
                                    
//                                     <div className="flex flex-col items-start w-full">
//                                         <span className="font-bold">Room ID</span>

//                                         {roomUuidEditing ? (
//                                             <div className="flex items-center justify-between w-full py-2 px-3 rounded-[10px] border border-[#0077C0]">
//                                                 <input type="text" 
//                                                 className="focus:outline-none w-full"
//                                                 value={roomUuid} onChange={(e) => setRoomUuid(e.target.value)}/>

//                                                 <div className="flex items-center gap-2">
//                                                     <button onClick={() => {
//                                                         setRoomUuid(inquiry.room_uuid)
//                                                         setRoomUuidEditing(false);
//                                                     }} className="text-[14px] font-bold opacity-50 hover:opacity-100 active:opacity-50 transition-all duration-100 cursor-pointer">
//                                                         <span>Cancel</span>
//                                                     </button>
//                                                 </div>
//                                             </div>
//                                         ) : (
//                                             <div className="flex items-center justify-between w-full py-2 px-3 rounded-[10px] border border-[#1D242B]/25">
//                                                 <span className="w-full">{inquiryData.room_uuid}</span>
                                                
//                                                 {inquiryData.room_id ? (
//                                                     <div className="flex items-center justify-between gap-2">
//                                                         <Link href={`/admin/room-listing/${parseInt(inquiryData.room_uuid)}`} target={'_blank'} className="flex items-center whitespace-nowrap text-[14px] font-bold opacity-50 hover:opacity-100 active:opacity-75 cursor-pointer">
//                                                             <span className="px-2">Check room</span>
//                                                         </Link>

//                                                         <button onClick={() => setRoomUuidEditing(true)} className="text-[14px] font-bold opacity-50 hover:opacity-100 active:opacity-50 transition-all duration-100 cursor-pointer">
//                                                             <span>Edit</span>
//                                                         </button>
//                                                     </div>
//                                                 ) : (
//                                                     <span className=" cursor-not-allowed whitespace-nowrap text-[14px] text-[#1D242B]/90 font-bold opacity-50">Room deleted</span>
//                                                 )}
//                                             </div>
//                                         )}
//                                     </div>

//                                     <div className="flex flex-col items-start w-full">
//                                         <span className="font-bold">Target Move-In (yyyy-mm-dd)</span>
//                                         {!targetMoveInEditing ? (
//                                             <div className="flex items-center justify-center w-full py-2 px-3 rounded-[10px] border border-[#1D242B]/25">
//                                                 <span className="w-full">{targetMoveIn}</span>
//                                                 <button onClick={() => setTargetMoveInEditing(true)} className="text-[14px] font-bold opacity-50 hover:opacity-100 active:opacity-50 transition-all duration-100 cursor-pointer">Edit</button>
//                                             </div>
//                                         ) : (
//                                             <div className="flex items-center justify-between w-full py-2 px-3 rounded-[10px] border border-[#0077C0]">
//                                                 <input type="date" name="target_date" id="target_move_in" 
//                                                     className="focus:outline-none focus:border-none cursor-text"
//                                                     value={targetMoveIn} onChange={(e) => setTargetMoveIn(e.target.value)}
//                                                 />

//                                                 <div className="flex items-center gap-2">
//                                                     <button onClick={() => {
//                                                         setTargetMoveInEditing(false);
//                                                         setTargetMoveIn(inquiry.target_move_in);
//                                                     }} className="text-[14px] font-bold opacity-50 hover:opacity-100 active:opacity-50 transition-all duration-100 cursor-pointer">Cancel</button>
//                                                 </div>
//                                             </div>
//                                         )}

//                                     </div>

//                                     <div className="flex flex-col items-start w-full">
//                                         <span className="font-bold">Months of Stay</span>

//                                         {!monthsOfStayEditing ? (
//                                             <div className="flex items-center justify-between w-full py-2 px-3 rounded-[10px] border border-[#1D242B]/25">
//                                                 <span className="w-full">{inquiryData.months_of_stay} Months</span>
//                                                 <button onClick={() => setMonthsOfStayEditing(true)} className="text-[14px] font-bold opacity-50 hover:opacity-100 active:opacity-50 transition-all duration-100 cursor-pointer">Edit</button>
//                                             </div>
//                                         ) : (
//                                             <div className="flex items-center justify-between w-full py-2 px-3 rounded-[10px] border border-[#0077C0]">
//                                                 <input type="text" id="months_of_stay" 
//                                                     className="focus:outline-none focus:border-none w-full"
//                                                     value={monthsOfStay || ''} onChange={(e) => setMonthsOfStay(Number(e.target.value))}
//                                                 />

//                                                 <div className="flex items-center gap-2">
//                                                     <button onClick={() => {
//                                                         setMonthsOfStay(inquiry.months_of_stay);    
//                                                         setMonthsOfStayEditing(false)
//                                                     }} className="text-[14px] font-bold opacity-50 hover:opacity-100 active:opacity-50 transition-all duration-100 cursor-pointer">Cancel</button>
//                                                 </div>
//                                             </div>
//                                         )}
//                                     </div>

//                                     <div className="flex flex-col items-start w-full">
//                                         <span className="font-bold">Work Schedule</span>
//                                         <span className="w-full py-2 px-3 rounded-[10px] border border-[#1D242B]/25">{inquiryData.work_schedule}</span>
//                                     </div>
//                                 </>
//                             )}
                            

//                             <div className="flex flex-col items-start w-full">
//                                 <span className="font-bold">Message</span>
//                                 <textarea id="messagge" rows={5} disabled value={inquiryData.message} className="resize-none w-full py-2 px-3 rounded-[10px] border border-[#1D242B]/25"></textarea>
//                             </div>


//                             <div className="flex flex-col items-start w-full">
//                                 <div className="flex items-center justify-between w-full pb-2">
//                                     <span className="font-bold">Stages</span>
//                                     {statusUpdatedMessage && (
//                                         <div className="flex items-center gap-1 h-full rounded-full bg-[#007C00]/10 px-2 animate-slide-in">
//                                             <span className="font-bold text-[12px] text-[#007C00]">{statusUpdatedMessage}</span>
//                                         </div>
//                                     )}
//                                 </div>
//                                 <div className="flex items-center w-full border-2 border-dashed border-[#1D242B]/25">
                                    
//                                     <label htmlFor="new_lead" className={`flex items-center justify-center w-full p-2 border-r-2 border-dashed border-r-[#1D242B]/25 cursor-pointer hover:bg-[#1D242B]/15 ${inq_status === 'New lead' ? 'bg-[#F9A825]/10 text-[#F9A825]' : 'bg-[#FAFAFA] text-[#1D242B]'}`}>
//                                         <input type="radio" name="status" id="new_lead" hidden checked={inq_status === 'New lead'} onChange={() => { setStatus('New lead'); handleUpdateStatus(inquiryData.id, 'New lead'); }}/>
//                                         <span className="text-[14px] font-bold">New Lead</span>
//                                     </label>

//                                     <label htmlFor="contacted" className={`flex items-center justify-center w-full p-2 border-r-2 border-dashed border-r-[#1D242B]/25 cursor-pointer hover:bg-[#1D242B]/15 ${inq_status === 'Contacted' ? 'bg-[#FFEF90] text-[#FF6308]/75' : 'bg-[#FAFAFA] text-[#1D242B]'}`}>
//                                         <input type="radio" name="status" id="contacted" hidden checked={inq_status === 'Contacted'} onChange={() => { setStatus('Contacted'); handleUpdateStatus(inquiryData.id, 'Contacted'); }}/>
//                                         <span className="text-[14px] font-bold">Contacted</span>
//                                     </label>
                                    
//                                     <label htmlFor="qualified" className={`flex items-center justify-center w-full p-2 border-r-2 border-dashed border-r-[#1D242B]/25 cursor-pointer hover:bg-[#1D242B]/15
//                                         ${status === 'converted' ? 'bg-[#007C00]/15 text-[#007C00]/75' : 'bg-[#FAFAFA] text-[#1D242B]'}`}>
//                                         <input type="radio" name="status" id="qualified" hidden checked={inq_status === 'Qualified'} onChange={() => { setStatus('Qualified'); handleUpdateStatus(inquiryData.id, 'Qualified'); }}/>
//                                         <span className="text-[14px] font-bold">Qualified</span>
//                                     </label>

//                                     <label htmlFor="closed_won" className={`flex items-center justify-center w-full p-2 border-r-2 border-dashed border-r-[#1D242B]/25 cursor-pointer hover:bg-[#1D242B]/15 ${inq_status === 'Closed - Won' ? 'bg-[#FE230A]/15 text-[#FE230A]/75' : 'bg-[#FAFAFA] text-[#1D242B]'}`}>
//                                         <input type="radio" name="status" id="closed_won" hidden checked={inq_status === 'Closed - Won'} onChange={() => { setStatus('Closed - Won'); handleUpdateStatus(inquiryData.id, 'Closed - Won') }}/>
//                                         <span className="text-[14px] font-bold">Closed - Won</span>
//                                     </label>

//                                     <label htmlFor="closed_lost" className={`flex items-center justify-center w-full p-2 cursor-pointer hover:bg-[#1D242B]/15 ${inq_status === 'Closed - Lost' ? 'bg-[#FE230A]/15 text-[#FE230A]/75' : 'bg-[#FAFAFA] text-[#1D242B]'}`}>
//                                         <input type="radio" name="status" id="closed_lost" hidden checked={inq_status === 'Closed - Lost'} onChange={() => { setStatus('Closed - Lost'); handleUpdateStatus(inquiryData.id, 'Closed - Lost') }}/>
//                                         <span className="text-[14px] font-bold">Closed - Lost</span>
//                                     </label>
//                                 </div>
//                             </div>

//                             {/* <div className="grid grid-cols-2 w-full gap-1">
//                                 <div className="flex flex-col w-full items-start justify-center">
//                                     <span className="font-bold">Status</span>
//                                     <span 
//                                         className={`text-center font-bold w-full py-2 ${
//                                             inquiry?.ghl_status === 'open' ?'bg-[#0077C0]/15 text-[#0077C0]' 
//                                             : inquiry?.ghl_status === 'won' ? 'bg-[#57F000]/25 text-[#3A8E5C]'
//                                             : inquiry?.ghl_status === 'lost' ? 'bg-[#009688]/25 text-[#009688]'
//                                             : 'bg-[#F44336]/25 text-[#F44336]'
//                                             }
//                                         `}>
//                                         {inquiry?.ghl_status.charAt(0).toUpperCase() + inquiry?.ghl_status.slice(1).toLowerCase()}
//                                     </span>
                                    
//                                 </div>

//                                 <div className="flex flex-col w-full items-start justify-center">
//                                     <span className="font-bold">Stage</span>
//                                     <span 
//                                     className={`text-center font-bold w-full py-2 ${
//                                         inquiry?.ghl_pipeline_stage === 'New Lead' ?'bg-[#F9A825]/10 text-[#F9A825]' 
//                                         : inquiry?.ghl_pipeline_stage === 'Contacted' ? 'bg-[#303F9F]/25 text-[#303F9F]'
//                                         : inquiry?.ghl_pipeline_stage === 'Qualified' ? 'bg-[#009688]/25 text-[#009688]'
//                                         : inquiry?.ghl_pipeline_stage === 'Proposal Sent' ? 'bg-[#3A8E5C]/10 text-[#3A8E5C]'
//                                         : inquiry?.ghl_pipeline_stage === 'Negotiation' ? 'bg-[#42325D]/25 text-[#42325D]'
//                                         : 'bg-[#F44336]/25 text-[#F44336]'
//                                             }
//                                         `}>{inquiry.ghl_pipeline_stage}</span>
//                                 </div>
//                             </div> */}


                            
//                             <span className="text-[14px] opacity-75">Submitted at {inquiryData.created_at.split("T")[0].split("-").join('-')} by user with IP: {inquiryData.ip_address}</span>
//                         </div>

//                     </div>
                                
//                     {notesOpen && (
//                         <div className="flex flex-col w-[400px] pl-[1rem] gap-[1rem] max-h-[600px]">
//                             <span className="text-[28px] font-bold">Notes</span>

//                             <div className="flex flex-col h-full overflow-y-scroll thin-scrollbar gap-[0.5rem]">

//                                 {inquiryData.inquiry_logs.map((logs, index) => (
//                                     <div key={index} className="flex flex-col w-full gap-1 p-2 rounded-[10px] border-2 border-dashed border-[#1D242B]/15">
//                                         <span className="text-[12px] font-bold opacity-50 text-left">{`Noted at ${logs.noted_at} by ${logs.noter}`}</span>
//                                         <p className="w-full text-[14px] focus:outline-none leading-tight font-bold text-[#1D242B]/90 whitespace-pre-wrap">
//                                             {logs.note}
//                                         </p>
//                                     </div>
//                                 ))}

//                                 <div className="flex flex-col items-start">
//                                     {/* <span className="font-bold opacity-80">Add new note</span> */}

//                                     <div className="flex flex-col w-full items-end gap-2">
//                                         <textarea name="inquiry_note" id="note" rows={5} placeholder="Describe your note here..."
//                                         value={note} onChange={(e) => setNote(e.target.value)}
//                                         className="w-full bg-[#1D242B]/10 rounded-[10px] leading-tight text-[14px] focus:outline-none p-2 focus:border-[#1D242B]"></textarea>

//                                         <button onClick={() => handleAddNote(inquiryData.id, note, id)} className="flex items-center bg-[#0077C0] hover:bg-[#006AAB] active:bg-[#0077C0] rounded-[10px] px-2 py-1 cursor-pointer">
//                                             <Add className="w-[20px] h-[20px]" />
//                                             <span className="text-[#FAFAFA] text-[16px] px-1">Add</span>
//                                         </button>

//                                     </div>
//                                 </div>  
//                             </div>
//                         </div>
//                     )}
//                 </div>


//                 <div className={`flex items-center w-full ${hasChanges ? 'justify-between' : 'justify-end'}`}>
//                     {hasChanges && (
//                         <button 
//                             onClick={() => {
//                                 handleUpdateFields(inquiry.id, { 
//                                     room_uuid: roomUuid, 
//                                     target_move_in: targetMoveIn,
//                                     months_of_stay: monthsOfStay
//                                 })
//                             }}
//                             className="flex items-center cursor-pointer bg-[#0077C0] hover:bg-[#1D242B] active:bg-[#0077C0 p-2 rounded-[10px] transition-all duration-100"
//                             >
//                                 <span className="font-bold px-3 text-[#FAFAFA]">{loading ? 'Updating...' : 'Update'}</span>
//                         </button>
//                     )}

//                     <div className="flex items-center gap-1">
//                         <button onClick={() => setNotesOpen(prev => !prev)} className="flex items-center cursor-pointer bg-[#0077C0]/75 hover:bg-[#0077C0]/90 active:bg-[#0077C0]/75 p-2 rounded-[10px] transition-all duration-100">
//                             <Note className="w-[20px] h-[20px] stroke-[#1D242B] stroke-2" />
//                             <span className="px-2 font-bold text-[16px] text-[#1D242B]">{notesOpen ? 'Hide Note' : 'Show Note'}</span>
//                         </button>
                        
//                         <button onClick={modalOpen} className="flex items-center cursor-pointer bg-[#1D242B]/25 hover:bg-[#1D242B]/40 active:bg-[#1D242B]/75 p-2 rounded-[10px] transition-all duration-100">
//                             <span className="px-2 font-bold text-[16px] text-[#1D242B]">Close</span>
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </>
//     )
// }