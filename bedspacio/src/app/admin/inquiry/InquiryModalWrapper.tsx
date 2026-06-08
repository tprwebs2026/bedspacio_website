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

// import { addNewNote, updateStatusById, getInquiryById } from "../../../../lib/inquiry";

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
//     const [status, setStatus] = useState(inquiry.ghl_status)
//     const [notesOpen, setNotesOpen] = useState(
//         inquiryData.inquiry_logs.length > 0
//     );

//     const [menuOpen, setMenuOpen] = useState<boolean>(false)
//     const [loading, setLoading] = useState<boolean>(false);
//     const [note, setNote] = useState<string>('');

//     const [statusUpdatedMessage, setStatusUpdatedMessage] = useState<string>('')


//     const handleUpdateStatus = async (id: number, status: string) => {
//         setLoading(true);
        
//         try {
//             if (status === inquiryData.ghl_status) {
//                 setLoading(false);
//                 return;
//             }

//             await new Promise<void>((resolve) => {
//                 setTimeout(() => {
//                     setLoading(true);
//                     resolve();
//                 }, 1500);
//             });

//             const response = await updateStatusById(id, status); 
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

//     return (
//         <>
//             {loading && (
//                 <div className="absolute flex items-center justify-center h-full w-full bg-[#1D242B]/50 z-20" >
//                     <span className="text-[#FAFAFA] font-bold">...loading</span>
//                 </div>
//             )}

//             <div className="flex flex-col w-auto h-auto bg-[#FAFAFA] rounded-[10px] border-2 border-[#1D242B]/50 p-[2rem] gap-[1rem]">

//                 <div className={`relative grid ${notesOpen  ? 'grid-cols-[auto_auto]' : 'grid-cols-[auto_auto]'} overflow-x-hidden`}>
//                     <div className={`relative flex flex-col w-[500px] max-h-[600px]  gap-[1rem]`}>
//                         <div className="flex items-center w-full justify-between">

//                             <div className="flex items-center gap-2">
//                                 <span className="text-[28px] font-bold">Inquiry Information</span>
//                                 <span className="text-[14px] text-[#1D242B]/75 font-bold bg-[#1D242B]/10 rounded-full px-3">{inquiryData.type}</span>
//                             </div>


//                             {/* 
//                                 Reason for commenting:
//                                 1. This modal is only going to be used for monitoring only and for historical records.
//                                 2. No need to delete or archive an inquiry
//                                 3. GHL will do the deletion.
//                             */}
//                             {/* <div className="relative flex">
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
//                             </div> */}
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

//                                         <div className="flex items-center justify-between w-full py-2 px-3 rounded-[10px] border border-[#1D242B]/25">
//                                             <span className="w-full">{inquiryData.room_uuid}</span>
                                            
//                                             {inquiryData.room_id ? (
//                                                 <Link href={`/admin/room-listing/${parseInt(inquiryData.room_uuid)}`} target={'_blank'} className="flex items-center whitespace-nowrap text-[14px] text-[#1D242B]/90 font-bold opacity-50 hover:opacity-100 active:opacity-75 cursor-pointer">
//                                                     <span className="px-2">Check room</span>
//                                                 </Link>
//                                             ) : (
//                                                 <span className=" cursor-not-allowed whitespace-nowrap text-[14px] text-[#1D242B]/90 font-bold opacity-50">Room deleted</span>
//                                             )}
//                                         </div>
//                                     </div>

//                                     <div className="flex flex-col items-start w-full">
//                                         <span className="font-bold">Target Move-In (yyyy-mm-dd)</span>
//                                         <span className="w-full py-2 px-3 rounded-[10px] border border-[#1D242B]/25">{inquiryData.target_move_in}</span>
//                                     </div>

//                                     <div className="flex flex-col items-start w-full">
//                                         <span className="font-bold">Months of Stay</span>
//                                         <span className="w-full py-2 px-3 rounded-[10px] border border-[#1D242B]/25">{inquiryData.months_of_stay} Months</span>
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


//                             {/* 
//                                 REASON FOR COMMENTING THIS BLOCK
//                                 > GoHighLevel Integration
//                                 > GHL will provide the status and stage of Inquiry
//                                 > This modal will only display the status
//                                 > Status are changed to: open, won, lost, and abandoned
//                                 > Stages are added by GHL.
//                              */}

//                             {/* <div className="flex flex-col items-start w-full">
//                                 <div className="flex items-center justify-between w-full pb-2">
//                                     <span className="font-bold">Status</span>
//                                     {statusUpdatedMessage && (
//                                         <div className="flex items-center gap-1 h-full rounded-full bg-[#007C00]/10 px-2 animate-slide-in">
//                                             <span className="font-bold text-[12px] text-[#007C00]">{statusUpdatedMessage}</span>
//                                         </div>
//                                     )}
//                                 </div>
//                                 <div className="flex items-center w-full border-2 border-dashed border-[#1D242B]/25">
                                    
//                                     <label htmlFor="pending" className={`flex items-center justify-center w-full font-bold p-2 border-r-2 border-dashed border-r-[#1D242B]/25 cursor-pointer hover:bg-[#1D242B]/15 ${status === 'pending' ? 'bg-[#1D242B]/15 text-[#1D242B]/75' : 'bg-[#FAFAFA] text-[#1D242B]'}`}>
//                                         <input type="radio" name="status" id="pending" hidden checked={status === 'pending'} onChange={() => { setStatus('pending'); handleUpdateStatus(inquiryData.id, 'pending'); }}/>
//                                         <span>Pending</span>
//                                     </label>

//                                     <label htmlFor="contacted" className={`flex items-center justify-center w-full font-bold p-2 border-r-2 border-dashed border-r-[#1D242B]/25 cursor-pointer hover:bg-[#1D242B]/15 ${status === 'contacted' ? 'bg-[#FFEF90] text-[#FF6308]/75' : 'bg-[#FAFAFA] text-[#1D242B]'}`}>
//                                         <input type="radio" name="status" id="contacted" hidden checked={status === 'contacted'} onChange={() => { setStatus('contacted'); handleUpdateStatus(inquiryData.id, 'contacted'); }}/>
//                                         <span>Contacted</span>
//                                     </label>
                                    
//                                     <label htmlFor="converted" className={`flex items-center justify-center w-full font-bold p-2 border-r-2 border-dashed border-r-[#1D242B]/25 cursor-pointer hover:bg-[#1D242B]/15
//                                         ${status === 'converted' ? 'bg-[#007C00]/15 text-[#007C00]/75' : 'bg-[#FAFAFA] text-[#1D242B]'}`}>
//                                         <input type="radio" name="status" id="converted" hidden checked={status === 'converted'} onChange={() => { setStatus('converted'); handleUpdateStatus(inquiryData.id, 'converted'); }}/>
//                                         <span>Converted</span>
//                                     </label>

//                                     <label htmlFor="closed" className={`flex items-center justify-center w-full font-bold p-2 cursor-pointer hover:bg-[#1D242B]/15 ${status === 'closed' ? 'bg-[#FE230A]/15 text-[#FE230A]/75' : 'bg-[#FAFAFA] text-[#1D242B]'}`}>
//                                         <input type="radio" name="status" id="closed" hidden checked={status === 'closed'} onChange={() => { setStatus('closed'); handleUpdateStatus(inquiryData.id, 'closed') }}/>
//                                         <span>Closed</span>
//                                     </label>
//                                 </div>
//                             </div> */}

//                             <div className="grid grid-cols-2 w-full gap-1">
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
//                             </div>


//                             {/* 
//                             <span className="text-[14px] opacity-75">Submitted at {inquiryData.created_at.split("T")[0].split("-").join('-')} by user with IP: {inquiryData.ip_address}</span> */}
//                         </div>

//                     </div>
                                
//                     {notesOpen && (
//                         <div className="flex flex-col w-[400px] pl-[1rem] gap-[1rem] max-h-[600px]">
//                             <span className="text-[28px] font-bold">Log Notes</span>

//                             <div className="flex flex-col h-full overflow-y-scroll thin-scrollbar gap-[1rem]">

//                                 {inquiryData.inquiry_logs.map((logs, index) => (
//                                     <div key={index} className="flex flex-col w-full gap-1 rounded-[10px] p-2 shadow-sm bg-[#C7EEFF]/50">
//                                         <span className="text-[12px] font-bold opacity-50 text-left">{`Noted at ${logs.noted_at} by ${logs.noter}`}</span>
//                                         <p className="w-full text-[14px] focus:outline-none leading-tight">
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


//                 <div className={`flex items-center w-full justify-end`}>
//                     <div className="flex items-center gap-1">

//                         {/* With GHL integration, notes on every inquiries on website are not used anymore */}
//                         {/* <button onClick={() => setNotesOpen(prev => !prev)} className="flex items-center cursor-pointer bg-[#0077C0]/75 hover:bg-[#0077C0]/90 active:bg-[#0077C0]/75 p-2 rounded-[10px] transition-all duration-100">
//                             <Note className="w-[20px] h-[20px] stroke-[#1D242B] stroke-2" />
//                             <span className="px-2 font-bold text-[16px] text-[#1D242B]">{notesOpen ? 'Hide Note' : 'Show Note'}</span>
//                         </button> */}
                        
//                         <button onClick={modalOpen} className="flex items-center cursor-pointer bg-[#1D242B]/25 hover:bg-[#1D242B]/40 active:bg-[#1D242B]/75 p-2 rounded-[10px] transition-all duration-100">
//                             <span className="px-2 font-bold text-[16px] text-[#1D242B]">Close</span>
//                         </button>
//                     </div>

//                 </div>
//             </div>
//         </>
//     )
// }



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

// import { addNewNote, updateInquiryStatusById, getInquiryById } from "../../../../lib/inquiry";

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

//     const [statusUpdatedMessage, setStatusUpdatedMessage] = useState<string>('')


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

//                                         <div className="flex items-center justify-between w-full py-2 px-3 rounded-[10px] border border-[#1D242B]/25">
//                                             <span className="w-full">{inquiryData.room_uuid}</span>
                                            
//                                             {inquiryData.room_id ? (
//                                                 <Link href={`/admin/room-listing/${parseInt(inquiryData.room_uuid)}`} target={'_blank'} className="flex items-center whitespace-nowrap text-[14px] text-[#1D242B]/90 font-bold opacity-50 hover:opacity-100 active:opacity-75 cursor-pointer">
//                                                     <span className="px-2">Check room</span>
//                                                 </Link>
//                                             ) : (
//                                                 <span className=" cursor-not-allowed whitespace-nowrap text-[14px] text-[#1D242B]/90 font-bold opacity-50">Room deleted</span>
//                                             )}
//                                         </div>
//                                     </div>

//                                     <div className="flex flex-col items-start w-full">
//                                         <span className="font-bold">Target Move-In (yyyy-mm-dd)</span>
//                                         <span className="w-full py-2 px-3 rounded-[10px] border border-[#1D242B]/25">{inquiryData.target_move_in}</span>
//                                     </div>

//                                     <div className="flex flex-col items-start w-full">
//                                         <span className="font-bold">Months of Stay</span>
//                                         <span className="w-full py-2 px-3 rounded-[10px] border border-[#1D242B]/25">{inquiryData.months_of_stay} Months</span>
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

//                             <div className="flex flex-col h-full overflow-y-scroll thin-scrollbar gap-[1rem]">

//                                 {inquiryData.inquiry_logs.map((logs, index) => (
//                                     <div key={index} className="flex flex-col w-full gap-1 rounded-[10px] p-2 shadow-sm bg-[#C7EEFF]/50">
//                                         <span className="text-[12px] font-bold opacity-50 text-left">{`Noted at ${logs.noted_at} by ${logs.noter}`}</span>
//                                         <p className="w-full text-[14px] focus:outline-none leading-tight">
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


//                 <div className={`flex items-center w-full justify-end`}>
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