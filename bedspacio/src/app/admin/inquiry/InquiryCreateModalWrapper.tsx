
// ------------- FALLBACK ------------- //
/*
    This block sends uses the database as the only storage of data
    Manually create an inquiry and send the data to the inquiries table
    No GHL is used here

    COMMENTED ON 06-10-2026
*/

"use client"

import { RoomUUIDType } from "./InquiryPageWrapper"
import { BASE_URL } from "@/config/config"
import axios from "axios"

// hooks
import { useForm } from "react-hook-form"
import { useState } from "react"
import Link from "next/link"

// icons
import Check from '@/asset/icon/check.svg'


type CreateInquiryFormValue = {
    fullname: string,
    contact_number: string,
    email: string,
    work_schedule: string,
    target_move_in: string,
    months_of_stay: number,
    room_uuid: string,
    note: string
}

type InquiryRecord = {
    id: number;
    fullname: string;
    contact_number: string;
    email: string;
    work_schedule: string;
    target_move_in: string;
    months_of_stay: number;
    room_uuid: string;
    message: string;
    reference_number: string;
}


interface CreateModalProp {
    setModalClose: React.Dispatch<React.SetStateAction<boolean>>
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>
    setSuccessMessage: React.Dispatch<React.SetStateAction<string>>
    roomUUIDs: RoomUUIDType[]
}


type InquirySubmissionResponse = {
    reference_number: string;
}



export default function InquiryCreateModalWrapper ({
    setModalClose,
    setErrorMessage,
    setSuccessMessage,
    roomUUIDs
}: CreateModalProp) {


    const { register, watch, handleSubmit, reset, formState: { errors } } = useForm<CreateInquiryFormValue>();
    const selectedRoomUUID = watch('room_uuid');

    const [loading, setLoading] = useState<boolean>(false);
    const [createdRecord, setCreatedRecord] = useState<InquiryRecord | null>(null);
    const [recordRespone, setRecordResponse] = useState<InquirySubmissionResponse |null>(null)

    const onSubmit = async (data: CreateInquiryFormValue) => {
        setLoading(true)

        try {
            const response = await axios.post(
                `${BASE_URL}/inquiry/v2/room-inquiry/manual`, {
                    fullname: data.fullname,
                    contact_number: data.contact_number,
                    email: data.email,
                    work_schedule: data.work_schedule,
                    target_move_in: data.target_move_in,
                    months_of_stay: data.months_of_stay,
                    room_uuid: data.room_uuid,
                    note: data.note
                }, 
                { withCredentials: true }
            );

            setCreatedRecord(response.data.data);
            setRecordResponse({
                reference_number: response.data.referenceNumber
            }); 

            setSuccessMessage('Successfully created new inquiry record');
            setTimeout(() => setSuccessMessage(''), 3500)


            
        } catch (err: any) {
            console.error('Error submitting inquiry: ', err);
            const message =
                err?.response?.data?.message ||
                err?.message ||
                'Unexpected error occurred';

            setErrorMessage(message || 'Failed to create inquiry record');
            setTimeout(() => setErrorMessage(''), 3500)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-[500px] h-auto bg-[#FAFAFA] rounded-[10px] border-2 border-[#1D242B]/50 p-[2rem] gap-[1rem]">
            <div className="flex flex-col items-start w-full justify-between gap-2">
                {createdRecord && recordRespone ? (
                    <div className="flex items-center gap-2">
                        <Check className="w-[40px] h-[40px] rounded-full bg-[#1D242B]/25" />
                        <span className="text-[28px] text-[#1D242B] font-bold leading-tight">
                            New Record Created
                        </span>
                    </div>
                ) : (
                    <span className="text-[28px] text-[#1D242B] font-bold leading-tight">Add new inquiry</span>
                )}
                <span className="text-[#1D242B]/75 leading-tight">
                    {!createdRecord && !recordRespone ? 'A new contact & opportunity has successfully been added to Go High Level' : 'Create a new inquiry record by filling in details.'}
                </span>
            </div>

            {createdRecord && recordRespone ? (
                <div className="flex flex-col w-full max-h-[400px] overflow-y-auto thin-scrollbar gap-1  pb-[1rem]">
                    <div className="flex items-center justify-between border-b border-dashed border-[#1D242B]/15 gap-2">
                        <span className="font-bold">Reference #: </span>
                        <span>{recordRespone?.reference_number}</span>
                    </div>

                    <div className="flex items-center justify-between border-b border-dashed border-[#1D242B]/15 gap-2">
                        <span className="font-bold">Name: </span>
                        <span>{createdRecord?.fullname}</span>
                    </div>

                    <div className="flex items-center justify-between border-b border-dashed border-[#1D242B]/15 gap-2">
                        <span className="font-bold">Contact #: </span>
                        <span>{createdRecord?.contact_number}</span>
                    </div>

                    <div className="flex items-center justify-between border-b border-dashed border-[#1D242B]/15 gap-2">
                        <span className="font-bold">Email: </span>
                        <span>{createdRecord?.email}</span>
                    </div>

                    <div className="flex items-center justify-between border-b border-dashed border-[#1D242B]/15 gap-2">
                        <span className="font-bold">Room ID: </span>
                        <span>{createdRecord?.room_uuid}</span>
                    </div>

                    <div className="flex items-center justify-between border-b border-dashed border-[#1D242B]/15 gap-2">
                        <span className="font-bold">Target Move-In: </span>
                        <span>{createdRecord?.target_move_in}</span>
                    </div>

                    <div className="flex items-center justify-between border-b border-dashed border-[#1D242B]/15 gap-2">
                        <span className="font-bold">Months of Stay: </span>
                        <span>{createdRecord?.months_of_stay}</span>
                    </div>

                    <div className="flex items-center justify-between border-b border-dashed border-[#1D242B]/15 gap-2">
                        <span className="font-bold">Work Schedule: </span>
                        <span>{createdRecord?.work_schedule}</span>
                    </div>

                    <div className="flex items-start justify-between border-b border-dashed border-[#1D242B]/15 gap-2">
                        <span className="font-bold">Note/s: </span>
                        <span className="text-right">{createdRecord?.message}</span>
                    </div>


                    <span className="text-[#1D242B]/75 leading-tight py-2">
                        Share the reference number and selected room ID with the inquirer for tracking and future communication.
                    </span>
                </div>
            ) : (
                <div className="flex flex-col w-full h-[400px] overflow-y-auto thin-scrollbar gap-2 pb-[1rem]">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between w-full">
                            <span className="text-[#1D242B]/90 text-[14px] font-bold">Name</span>
                            {errors.fullname && (
                                <span className="text-[14px] text-[#FF0808]">{errors.fullname.message}</span>
                            )}
                        </div>
                        <input type="text" { ...register('fullname', { required: 'Full name is required' }) }
                        className="border border-[#1D242B]/50 focus:outline-none focus:border-[#0077C0] p-2 w-full rounded-[10px]" 
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between w-full">
                            <span className="text-[#1D242B]/90 text-[14px] font-bold">Contact Number</span>
                            {errors.contact_number && (
                                <span className="text-[14px] text-[#FF0808]">{errors.contact_number.message}</span>
                            )}
                        </div>
                        <input type="text" maxLength={11} { 
                            ...register('contact_number', 
                            { 
                                required: 'Contact number is required', 
                                pattern: {
                                    value: /^\+?[0-9\s\-()]+$/,
                                    message: 'Invalid contact number format',
                                },
                                validate: value =>
                                    value.replace(/\D/g, '').length === 11 ||
                                    'Contact number must be 11 digits', }) 
                            }
                            onInput={(e) => {
                                const target = e.target as HTMLInputElement;
                                target.value = target.value.replace(/[^0-9]/g, '');
                            }}
                            className="border border-[#1D242B]/50 focus:outline-none focus:border-[#0077C0] p-2 w-full rounded-[10px]" 
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between w-full">
                            <span className="text-[#1D242B]/90 text-[14px] font-bold">Email</span>
                            {errors.email && (
                                <span className="text-[14px] text-[#FF0808]">{errors.email.message}</span>
                            )}
                        </div>
                        <input type="text" { 
                            ...register('email', 
                            { 
                                required: 'Email is required',
                                pattern: {
                                        value: /^\S+@\S+$/,
                                        message: 'Invalid email address'
                                    }
                                }) 
                            }
                            className="border border-[#1D242B]/50 focus:outline-none focus:border-[#0077C0] p-2 w-full rounded-[10px]" 
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between w-full">
                            <span className="text-[#1D242B]/90 text-[14px] font-bold">Work Schedule</span>
                            {errors.work_schedule && (
                                <span className="text-[14px] text-[#FF0808]">{errors.work_schedule.message}</span>
                            )}
                        </div>
                        <select id="work_schedule" { ...register('work_schedule', { required: 'Work schedule is required' })}
                        className="border border-[#1D242B]/50 focus:outline-none focus:border-[#0077C0] p-2 w-full rounded-[10px] cursor-pointer">
                            <option hidden>Select a work schedule</option>
                            <option value="Morning Shift">Morning Shift</option>
                            <option value="Mid Shift">Mid Shift</option>
                            <option value="Night Shift">Night Shift</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between w-full">
                            <span className="text-[#1D242B]/90 text-[14px] font-bold">Target Move-In</span>
                            {errors.target_move_in && (
                                <span className="text-[14px] text-[#FF0808]">{errors.target_move_in.message}</span>
                            )}
                        </div>
                        <input type="date" { ...register('target_move_in', { required: 'Target move-in is required' })}
                        className="border border-[#1D242B]/50 focus:outline-none focus:border-[#0077C0] p-2 w-full rounded-[10px]" />
                    </div>

                    <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between w-full">
                            <span className="text-[#1D242B]/90 text-[14px] font-bold">Months of Stay</span>
                            {errors.months_of_stay && (
                                <span className="text-[14px] text-[#FF0808]">{errors.months_of_stay.message}</span>
                            )}
                        </div>
                        <input type="text" { 
                                ...register('months_of_stay', 
                                { 
                                    required: 'Months of stay is required',
                                    valueAsNumber: true,
                                    min: {
                                        value: 1,
                                        message: 'Must be at least 1 month',
                                    }
                                }
                            )}
                            className="border border-[#1D242B]/50 focus:outline-none focus:border-[#0077C0] p-2 w-full rounded-[10px]" 
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between w-full">
                            <span className="text-[#1D242B]/90 text-[14px] font-bold">Selected Room ID</span>
                            {errors.room_uuid && (
                                <span className="text-[14px] text-[#FF0808]">{errors.room_uuid.message}</span>
                            )}
                        </div>
                        {/* <input type="text" { ...register('room_uuid', { required: 'Room ID is required' }) }
                        className="border border-[#1D242B]/50 focus:outline-none focus:border-[#0077C0] p-2 w-full rounded-[10px]" /> */}
                        <div className="flex items-center justify-between w-full border border-[#1D242B]/50 focus:outline-none focus:border-[#0077C0] p-2 w-full rounded-[10px]">
                            <select id="room_uuid" {...register('room_uuid', { required: 'Room Id is required' })} className="w-full focus:outline-none">
                                {roomUUIDs.length > 0 ? (
                                    <>
                                        <option hidden>Select a room ID</option>

                                        {roomUUIDs.map(uuid => (
                                            <option key={uuid.room_uuid} value={uuid.room_uuid}>{`${uuid.room_uuid} (${uuid.type})`}</option>
                                        ))}
                                    </>
                                ): (
                                    <option hidden>No room ID to select</option>
                                )}
                                
                            </select>

                            <Link href={`/admin/room-listing/${selectedRoomUUID}`} target={'_blank'} className="whitespace-nowrap text-[14px] font-bold opacity-50 hover:opacity-100 active:opacity-50 transition-all duration-100">Check room</Link>
                        </div>

                        <div className="flex flex-col gap-1 pt-2">
                            <div className="flex items-center justify-between w-full">
                                <span className="text-[#1D242B]/90 text-[14px] font-bold">Note/s</span>
                                {errors.note && (
                                    <span className="text-[14px] text-[#FF0808]">{errors.note.message}</span>
                                )}
                            </div>

                            <textarea id="notes" rows={3} {...register('note')} className="border border-[#1D242B]/50 focus:outline-none focus:border-[#0077C0] p-2 w-full rounded-[10px]"></textarea>
                        </div>
                    </div>
                </div>

            )}


            <div className="flex items-center w-full gap-1">
                {!createdRecord && !recordRespone && (
                    <button className="cursor-pointer flex items-center justify-center w-full bg-[#0077C0] hover:bg-[#00629E] active:bg-[#0077C0] border border-[#0077C0] py-2 rounded-[10px]" disabled={loading}>
                        <span className="text-[#FAFAFA]">
                            {loading ? 'Creating...' : 'Create'}
                        </span>
                    </button>
                )}

                <button type="button" onClick={() => setModalClose(prev => !prev)} className="cursor-pointer flex items-center justify-center w-full py-2 hover:bg-[#1D242B]/10 active:bg-[#FAFAFA] border border-[#1D242B]/25 rounded-[10px]">
                    <span>Close</span>
                </button>
            </div>
        </form>
    )
}



//------------- USE THIS IF GHL IS INTEGRATED ------------- //

// "use client"

// // For manually creating inquiry for staff/property manager
// // Create a webhook on GHL for this to work
// // REASON: Only on website is able to create unique Inquiry Reference Number
// // Manual creation > Save to database > trigger webhook on GHL > create opportunity > save data on GHL

// import { RoomUUIDType } from "./InquiryPageWrapper"
// import { BASE_URL } from "@/config/config"
// import axios from "axios"

// // hooks
// import { useForm } from "react-hook-form"
// import { useState } from "react"
// import Link from "next/link"

// // icons
// import Check from '@/asset/icon/check.svg'


// type CreateInquiryFormValue = {
//     fullname: string,
//     contact_number: string,
//     email: string,
//     work_schedule: string,
//     target_move_in: string,
//     months_of_stay: number,
//     room_uuid: string,
//     note: string
// }

// type InquiryRecord = {
//     id: number;
//     fullname: string;
//     contact_number: string;
//     email: string;
//     work_schedule: string;
//     target_move_in: string;
//     months_of_stay: number;
//     room_uuid: string;
//     message: string;
//     reference_number: string;
// }


// interface CreateModalProp {
//     setModalClose: React.Dispatch<React.SetStateAction<boolean>>
//     setErrorMessage: React.Dispatch<React.SetStateAction<string>>
//     setSuccessMessage: React.Dispatch<React.SetStateAction<string>>
//     roomUUIDs: RoomUUIDType[]
// }


// type InquirySubmissionResponse = {
//     reference_number: string;
//     crm_contact_id: string;
//     crm_opportunity_id: string;
// }



// export default function InquiryCreateModalWrapper ({
//     setModalClose,
//     setErrorMessage,
//     setSuccessMessage,
//     roomUUIDs
// }: CreateModalProp) {


//     const { register, watch, handleSubmit, reset, formState: { errors } } = useForm<CreateInquiryFormValue>();
//     const selectedRoomUUID = watch('room_uuid');

//     const [loading, setLoading] = useState<boolean>(false);
//     const [createdRecord, setCreatedRecord] = useState<InquiryRecord | null>(null);
//     const [recordRespone, setRecordResponse] = useState<InquirySubmissionResponse |null>(null)

//     const onSubmit = async (data: CreateInquiryFormValue) => {
//         setLoading(true)

//         try {
//             const response = await axios.post(
//                 `${BASE_URL}/gohighlevel/submissions/manual`, {
//                     fullname: data.fullname,
//                     contact_number: data.contact_number,
//                     email: data.email,
//                     work_schedule: data.work_schedule,
//                     target_move_in: data.target_move_in,
//                     months_of_stay: data.months_of_stay,
//                     room_uuid: data.room_uuid,
//                     note: data.note
//                 }, 
//                 { withCredentials: true }
//             );

//             setCreatedRecord(response.data.data);
//             setRecordResponse({
//                 reference_number: response.data.referenceNumber,
//                 crm_contact_id: response.data.crm_contact_id,
//                 crm_opportunity_id: response.data.crm_opportunity_id
//             }); 

//             setSuccessMessage('Successfully created new inquiry record');
//             setTimeout(() => setSuccessMessage(''), 3500)


            
//         } catch (err: any) {
//             console.error('Error submitting inquiry: ', err);
//             const message =
//                 err?.response?.data?.message ||
//                 err?.message ||
//                 'Unexpected error occurred';

//             setErrorMessage(message || 'Failed to create inquiry record');
//             setTimeout(() => setErrorMessage(''), 3500)
//         } finally {
//             setLoading(false)
//         }
//     }

//     return (
//         <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-[500px] h-auto bg-[#FAFAFA] rounded-[10px] border-2 border-[#1D242B]/50 p-[2rem] gap-[1rem]">
//             <div className="flex flex-col items-start w-full justify-between gap-2">
//                 {createdRecord && recordRespone ? (
//                     <div className="flex items-center gap-2">
//                         <Check className="w-[40px] h-[40px] rounded-full bg-[#1D242B]/25" />
//                         <span className="text-[28px] text-[#1D242B] font-bold leading-tight">
//                             New Record Created
//                         </span>
//                     </div>
//                 ) : (
//                     <span className="text-[28px] text-[#1D242B] font-bold leading-tight">Add new inquiry</span>
//                 )}
//                 <span className="text-[#1D242B]/75 leading-tight">
//                     {!createdRecord && !recordRespone ? 'A new contact & opportunity has successfully been added to Go High Level' : 'Create a new inquiry record by filling in details.'}
//                 </span>
//             </div>

//             {createdRecord && recordRespone ? (
//                 <div className="flex flex-col w-full max-h-[400px] overflow-y-auto thin-scrollbar gap-1  pb-[1rem]">
//                     <div className="flex items-center justify-between border-b border-dashed border-[#1D242B]/15 gap-2">
//                         <span className="font-bold">Reference #: </span>
//                         <span>{recordRespone?.reference_number}</span>
//                     </div>

//                     <div className="flex items-center justify-between border-b border-dashed border-[#1D242B]/15 gap-2">
//                         <span className="font-bold">Name: </span>
//                         <span>{createdRecord?.fullname}</span>
//                     </div>

//                     <div className="flex items-center justify-between border-b border-dashed border-[#1D242B]/15 gap-2">
//                         <span className="font-bold">Contact #: </span>
//                         <span>{createdRecord?.contact_number}</span>
//                     </div>

//                     <div className="flex items-center justify-between border-b border-dashed border-[#1D242B]/15 gap-2">
//                         <span className="font-bold">Email: </span>
//                         <span>{createdRecord?.email}</span>
//                     </div>

//                     <div className="flex items-center justify-between border-b border-dashed border-[#1D242B]/15 gap-2">
//                         <span className="font-bold">Room ID: </span>
//                         <span>{createdRecord?.room_uuid}</span>
//                     </div>

//                     <div className="flex items-center justify-between border-b border-dashed border-[#1D242B]/15 gap-2">
//                         <span className="font-bold">Target Move-In: </span>
//                         <span>{createdRecord?.target_move_in}</span>
//                     </div>

//                     <div className="flex items-center justify-between border-b border-dashed border-[#1D242B]/15 gap-2">
//                         <span className="font-bold">Months of Stay: </span>
//                         <span>{createdRecord?.months_of_stay}</span>
//                     </div>

//                     <div className="flex items-center justify-between border-b border-dashed border-[#1D242B]/15 gap-2">
//                         <span className="font-bold">Work Schedule: </span>
//                         <span>{createdRecord?.work_schedule}</span>
//                     </div>

//                     <div className="flex items-start justify-between border-b border-dashed border-[#1D242B]/15 gap-2">
//                         <span className="font-bold">Note/s: </span>
//                         <span className="text-right">{createdRecord?.message}</span>
//                     </div>


//                     <span className="text-[#1D242B]/75 leading-tight py-2">
//                         hare the reference number and selected room ID with the inquirer for tracking and future communication.
//                     </span>
//                 </div>
//             ) : (
//                 <div className="flex flex-col w-full h-[400px] overflow-y-auto thin-scrollbar gap-2 pb-[1rem]">
//                     <div className="flex flex-col gap-1">
//                         <div className="flex items-center justify-between w-full">
//                             <span className="text-[#1D242B]/90 text-[14px] font-bold">Name</span>
//                             {errors.fullname && (
//                                 <span className="text-[14px] text-[#FF0808]">{errors.fullname.message}</span>
//                             )}
//                         </div>
//                         <input type="text" { ...register('fullname', { required: 'Full name is required' }) }
//                         className="border border-[#1D242B]/50 focus:outline-none focus:border-[#0077C0] p-2 w-full rounded-[10px]" 
//                         />
//                     </div>

//                     <div className="flex flex-col gap-1">
//                         <div className="flex items-center justify-between w-full">
//                             <span className="text-[#1D242B]/90 text-[14px] font-bold">Contact Number</span>
//                             {errors.contact_number && (
//                                 <span className="text-[14px] text-[#FF0808]">{errors.contact_number.message}</span>
//                             )}
//                         </div>
//                         <input type="text" maxLength={11} { 
//                             ...register('contact_number', 
//                             { 
//                                 required: 'Contact number is required', 
//                                 pattern: {
//                                     value: /^\+?[0-9\s\-()]+$/,
//                                     message: 'Invalid contact number format',
//                                 },
//                                 validate: value =>
//                                     value.replace(/\D/g, '').length === 11 ||
//                                     'Contact number must be 11 digits', }) 
//                             }
//                             onInput={(e) => {
//                                 const target = e.target as HTMLInputElement;
//                                 target.value = target.value.replace(/[^0-9]/g, '');
//                             }}
//                             className="border border-[#1D242B]/50 focus:outline-none focus:border-[#0077C0] p-2 w-full rounded-[10px]" 
//                         />
//                     </div>

//                     <div className="flex flex-col gap-1">
//                         <div className="flex items-center justify-between w-full">
//                             <span className="text-[#1D242B]/90 text-[14px] font-bold">Email</span>
//                             {errors.email && (
//                                 <span className="text-[14px] text-[#FF0808]">{errors.email.message}</span>
//                             )}
//                         </div>
//                         <input type="text" { 
//                             ...register('email', 
//                             { 
//                                 required: 'Email is required',
//                                 pattern: {
//                                         value: /^\S+@\S+$/,
//                                         message: 'Invalid email address'
//                                     }
//                                 }) 
//                             }
//                             className="border border-[#1D242B]/50 focus:outline-none focus:border-[#0077C0] p-2 w-full rounded-[10px]" 
//                         />
//                     </div>

//                     <div className="flex flex-col gap-1">
//                         <div className="flex items-center justify-between w-full">
//                             <span className="text-[#1D242B]/90 text-[14px] font-bold">Work Schedule</span>
//                             {errors.work_schedule && (
//                                 <span className="text-[14px] text-[#FF0808]">{errors.work_schedule.message}</span>
//                             )}
//                         </div>
//                         <select id="work_schedule" { ...register('work_schedule', { required: 'Work schedule is required' })}
//                         className="border border-[#1D242B]/50 focus:outline-none focus:border-[#0077C0] p-2 w-full rounded-[10px] cursor-pointer">
//                             <option hidden>Select a work schedule</option>
//                             <option value="Morning Shift">Morning Shift</option>
//                             <option value="Mid Shift">Mid Shift</option>
//                             <option value="Night Shift">Night Shift</option>
//                         </select>
//                     </div>

//                     <div className="flex flex-col gap-1">
//                         <div className="flex items-center justify-between w-full">
//                             <span className="text-[#1D242B]/90 text-[14px] font-bold">Target Move-In</span>
//                             {errors.target_move_in && (
//                                 <span className="text-[14px] text-[#FF0808]">{errors.target_move_in.message}</span>
//                             )}
//                         </div>
//                         <input type="date" { ...register('target_move_in', { required: 'Target move-in is required' })}
//                         className="border border-[#1D242B]/50 focus:outline-none focus:border-[#0077C0] p-2 w-full rounded-[10px]" />
//                     </div>

//                     <div className="flex flex-col gap-1">
//                         <div className="flex items-center justify-between w-full">
//                             <span className="text-[#1D242B]/90 text-[14px] font-bold">Months of Stay</span>
//                             {errors.months_of_stay && (
//                                 <span className="text-[14px] text-[#FF0808]">{errors.months_of_stay.message}</span>
//                             )}
//                         </div>
//                         <input type="text" { 
//                                 ...register('months_of_stay', 
//                                 { 
//                                     required: 'Months of stay is required',
//                                     valueAsNumber: true,
//                                     min: {
//                                         value: 1,
//                                         message: 'Must be at least 1 month',
//                                     }
//                                 }
//                             )}
//                             className="border border-[#1D242B]/50 focus:outline-none focus:border-[#0077C0] p-2 w-full rounded-[10px]" 
//                         />
//                     </div>

//                     <div className="flex flex-col gap-1">
//                         <div className="flex items-center justify-between w-full">
//                             <span className="text-[#1D242B]/90 text-[14px] font-bold">Selected Room ID</span>
//                             {errors.room_uuid && (
//                                 <span className="text-[14px] text-[#FF0808]">{errors.room_uuid.message}</span>
//                             )}
//                         </div>
//                         {/* <input type="text" { ...register('room_uuid', { required: 'Room ID is required' }) }
//                         className="border border-[#1D242B]/50 focus:outline-none focus:border-[#0077C0] p-2 w-full rounded-[10px]" /> */}
//                         <div className="flex items-center justify-between w-full border border-[#1D242B]/50 focus:outline-none focus:border-[#0077C0] p-2 w-full rounded-[10px]">
//                             <select id="room_uuid" {...register('room_uuid', { required: 'Room Id is required' })} className="w-full focus:outline-none">
//                                 {roomUUIDs.length > 0 ? (
//                                     <>
//                                         <option hidden>Select a room ID</option>

//                                         {roomUUIDs.map(uuid => (
//                                             <option key={uuid.room_uuid} value={uuid.room_uuid}>{`${uuid.room_uuid} (${uuid.type})`}</option>
//                                         ))}
//                                     </>
//                                 ): (
//                                     <option hidden>No room ID to select</option>
//                                 )}
                                
//                             </select>

//                             <Link href={`/admin/room-listing/${selectedRoomUUID}`} target={'_blank'} className="whitespace-nowrap text-[14px] font-bold opacity-50 hover:opacity-100 active:opacity-50 transition-all duration-100">Check room</Link>
//                         </div>

//                         <div className="flex flex-col gap-1 pt-2">
//                             <div className="flex items-center justify-between w-full">
//                                 <span className="text-[#1D242B]/90 text-[14px] font-bold">Note/s</span>
//                                 {errors.note && (
//                                     <span className="text-[14px] text-[#FF0808]">{errors.note.message}</span>
//                                 )}
//                             </div>

//                             <textarea id="notes" rows={3} {...register('note')} className="border border-[#1D242B]/50 focus:outline-none focus:border-[#0077C0] p-2 w-full rounded-[10px]"></textarea>
//                         </div>
//                     </div>
//                 </div>

//             )}


//             <div className="flex items-center w-full gap-1">
//                 {!createdRecord && !recordRespone && (
//                     <button className="cursor-pointer flex items-center justify-center w-full bg-[#0077C0] hover:bg-[#00629E] active:bg-[#0077C0] border border-[#0077C0] py-2 rounded-[10px]" disabled={loading}>
//                         <span className="text-[#FAFAFA]">
//                             {loading ? 'Creating...' : 'Create'}
//                         </span>
//                     </button>
//                 )}

//                 <button type="button" onClick={() => setModalClose(prev => !prev)} className="cursor-pointer flex items-center justify-center w-full py-2 hover:bg-[#1D242B]/10 active:bg-[#FAFAFA] border border-[#1D242B]/25 rounded-[10px]">
//                     <span>Close</span>
//                 </button>
//             </div>
//         </form>
//     )
// }