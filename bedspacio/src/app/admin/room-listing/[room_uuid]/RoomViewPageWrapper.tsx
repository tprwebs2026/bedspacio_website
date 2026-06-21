"use client"

import { useState, useMemo } from "react";
import axios from "axios";
import { BASE_URL } from "@/config/config";
import { useRouter } from "next/navigation";

// icons
import Remove from '@/asset/icon/delete.svg'
import MenuDots from '@/asset/icon/menu-three-dots.svg'
import Delete from '@/asset/icon/delete.svg'

import GalleryViewer from "./GalleryViewer";
import InclusionSelectionViewWrapper from "./InclusionSelectectionViewWrapper";

import { BranchType } from "../create/CreateRoomPageWrapper";
import { InclusionViewType } from "./page";
import { RoomViewType } from "./page";
import BranchSelectionViewWrapper from "./BranchSelectionViewWrapper";

import SuccessToast from "@/components/admin/Toast/SuccessToast";
import ErrorToast from "@/components/admin/Toast/ErrorToast";
import DeleteToast from "@/components/admin/Toast/DeleteToast";
import ConfirmWindow from "@/components/admin/Toast/ConfirmWindow";
import Link from "next/link";


type PaymentTerms = {
    term: string,
    amount: number
}

type RoomImage = {
    preview: string;
    public_id?: string,
    file?: File;
    existing: boolean;
};

interface RoomProps {
    room: RoomViewType;
    inclusions: InclusionViewType[];
    branches: BranchType[];
}


export default function RoomViewPageWrapper ({room, inclusions, branches }: RoomProps) {

    console.log('Room Data: ', room);
    console.log('Room inclusions: ', room.inclusions);
    const router = useRouter();

    const [title, setTitle] = useState<string>(room?.title);
    const [price, setPrice] = useState<string>(room?.price);
    const [description, setDescription] = useState<string>(room?.description);

    const [typeSelected, setTypeSelected] = useState<string|null>(room?.type);
    const [genderSelected, setGenderTypeSelected] = useState<string|null>(room?.gender);

    // if the room type is a bedspace
    const [upperDeckTotal, setUpperDeckTotal] = useState<number>(room?.upper_deck_total);
    const [lowerDeckTotal, setLowerDeckTotal] = useState<number>(room?.lower_deck_total);
    const [upperDeckAvailable, setUpperDeckAvailable] = useState<number>(room?.upper_deck_available);
    const [lowerDeckAvailable, setLowerDeckAvailable] = useState<number>(room?.lower_deck_available);


    const [capacity, setCapacity] = useState<number>(room?.capacity);
    const [slot, setSlot] = useState<number>(room?.slot)

    const computedCapacity = Number(upperDeckTotal || 0) + Number(lowerDeckTotal || 0);
    const computedSlot = Number(upperDeckAvailable || 0) + Number(lowerDeckAvailable || 0);

    const [selectedBranch, setSelectedBranch] = useState<number>(room.branch_id);
    const [selectedInclusions, setSelectedInclusions] = useState<number[]>(room.inclusions.map(inc => Number(inc.id)));

    const [deleteMessage, setDeleteMessage] = useState<string>('')
    const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
    const [confirmOpen, setConfirmOpen] = useState<boolean>(false);

    const [images, setImages] = useState<RoomImage[]>(
        room.images.map(img => ({
            preview: img.image,
            public_id: img.public_id,
            existing: true
        }))
    );

    const [loading, setLoading] = useState<boolean>(false);

    const [paymentTermPair, setPaymentTermPair] =
    useState<PaymentTerms[]>(
        room.payment_term?.length
        ? room.payment_term
        : [{ term: "", amount: 0 }]
    );
    const [error, setError] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');
    
    const handleAddPair = () => {
        const lastPair = paymentTermPair[paymentTermPair.length - 1];

        if (lastPair.term === "" || lastPair.amount === 0) {
            setError("Invalid input");
            return;
        }

        setPaymentTermPair(pair => [...pair, {term: '', amount: 0}]);
    }

    const handlePairOnChange = (index: number, field: keyof PaymentTerms, value: string) => {
        setPaymentTermPair(prev => 
            prev.map((item, i) => 
                i === index 
                    ? { ...item, [field]: field === "amount" ? Number(value) : value }
                    : item
            )
        )

        const updatedPair = paymentTermPair[index];
        const updatedTerm = field === "term" ? value : updatedPair.term;
        const updatedAmount = field === "amount" ? Number(value) : updatedPair.amount;

        if (updatedTerm !== "" && updatedAmount !== 0) {
            setError("");
        }
    };
    
    const handleDeletePair = (index: number) => {
        if (paymentTermPair.length === 1) return;
        setPaymentTermPair(pair =>  pair.filter((_, i) => i !== index));
    }


    const handleRoomChange = async (id: number) => {
        setLoading(true);
        try {
            const formData = new FormData();

            // basic fields
            if (title !== room.title) {
                formData.append("title", title);
            }

            if (description !== room.description) {
                formData.append("description", description);
            }

            if (Number(price) !== Number(room.price)) {
                formData.append("price", price);
            }

            if (typeSelected !== room.type) {
                formData.append("type", typeSelected || "");
            }

            if (genderSelected !== room.gender) {
                formData.append("gender", genderSelected || "");
            }

            if (capacity !== room.capacity) {
                formData.append("capacity", capacity.toString());
            }

            if (slot !== room.slot) {
                formData.append("slot", slot.toString());
            }

            if (selectedBranch !== room.branch_id) {
                formData.append("branch_id", selectedBranch.toString());
            }

            // Apartment-only manual slot/capacity
            if (typeSelected === "apartment") {
                if (capacity !== room.capacity) {
                    formData.append("capacity", capacity.toString());
                }

                if (slot !== room.slot) {
                    formData.append("slot", slot.toString());
                }
            }

            // Bedspace config
            if (typeSelected === "bedspace") {
                formData.append("upper_deck_total", upperDeckTotal.toString());
                formData.append("lower_deck_total", lowerDeckTotal.toString());
                formData.append("upper_deck_available", upperDeckAvailable.toString());
                formData.append("lower_deck_available", lowerDeckAvailable.toString());
            }

            // payment terms
            if (
                JSON.stringify(paymentTermPair) !==
                JSON.stringify(room.payment_term)
            ) {
                formData.append(
                    "payment_term",
                    JSON.stringify(paymentTermPair)
                );
            }

            // inclusions
            if (
                JSON.stringify(selectedInclusions.sort()) !==
                JSON.stringify(
                    room.inclusions.map((inc) => Number(inc.id)).sort()
                )
            ) {
                formData.append(
                    "inclusions",
                    JSON.stringify(selectedInclusions)
                );
            }

            formData.append(
                "existing_images",
                JSON.stringify(
                    images
                        .filter(img => img.existing)
                        .map(img => img.public_id)
                        .filter(Boolean)
                )
            );

            // send new uploads
            images
                .filter((img) => !img.existing && img.file)
                .forEach((img) => {
                    formData.append("room_image", img.file!);
                });

            const updated = await axios.patch(
                `${BASE_URL}/room/v1/${id}/info`,
                formData,
                { withCredentials: true }
            );

            console.log("Room updated:", updated.data);

            setSuccessMessage('Room updated successfully');
            setTimeout(() => setSuccessMessage(''), 3500);

            if (updated.data.success) {
                router.refresh();
            }

        } catch (err) {
            console.error("Failed to update room:", err);
            setError('Update failed');
            setTimeout(() => setError(''), 3500);
        } finally {
            setLoading(false);
        }
    };


    const handleDeleteRoom = async (id: number) => {
        try {

            const deleted_room = await axios.delete(
                `${BASE_URL}/room/v1/${id}/info`, {
                    withCredentials: true
                }
            );

            if (deleted_room?.data?.success === true) {
                setDeleteMessage('Deleted room successfully');

                setTimeout(() => {
                    router.push('/admin/room-listing?page=1');
                }, 3500);
            }
            
        } catch (err) {
            console.error('Failed to delete room: ', err);
            setError('Error deleting this room');

            setTimeout(() => setError(''), 3500)
        }
    }

    const imagesChanged = useMemo(() => {
        const existingImages = images
            .filter(img => img.existing)
            .map(img => img.preview)
            .sort();

        const originalImages = room.images
            .map(img => img.image)
            .sort();

        return (
            JSON.stringify(existingImages) !==
                JSON.stringify(originalImages) ||
                images.some(img => !img.existing)
        );
    }, [images, room.images]);


    const changesMade = 
        title !== room.title ||
        description !== room.description ||
        Number(price) !== Number(room.price) ||
        typeSelected !== room.type ||
        genderSelected !== room.gender ||
        capacity !== room.capacity ||
        slot !== room.slot ||
        selectedBranch !== room.branch_id ||
        JSON.stringify(paymentTermPair) !==
        JSON.stringify(room.payment_term) ||
        JSON.stringify(selectedInclusions.sort()) !==
        JSON.stringify(
            room.inclusions.map((inc) => Number(inc.id)).sort()
        ) || imagesChanged;



    return (
        <>
            {deleteMessage && (
                <div className="bg-[#1D242B]/50 inset-0 fixed z-20"/>
            )}

            
            <div className="flex w-full min-h-screen">
                <div className="flex flex-col items-start w-full px-[1rem] xl:px-[8rem] py-[1rem]">

                    <div className="flex items-center justify-between w-full">
                        <span className="text-[28px] text-[#1D242B] font-[900]">Room ID: {Number(room.room_uuid)}</span>

                        <div className="flex items-center gap-2">
                            <div className=" relative flex">
                                <button onClick={() => setDeleteOpen(prev => !prev)} className="flex items-center bg-[#1D242B]/15 hover:bg-[#1D242B]/30 active:bg-[#1D242B]/15 cursor-pointer rounded-[10px] p-1 transition-all duration-100">
                                    <MenuDots className="w-[18px] h-[18px] fill-[#1D242B]" />
                                    <span className="text-md text-[#1D242B] font-bold pr-2">Menu</span>
                                </button>

                                {deleteOpen && (
                                    <div className="absolute top-9 right-0 bg-[#FAFAFA] flex flex-col gap-1 p-2 border border-[#1D242B]/30 rounded-[15px]">
                                        <button onClick={() => setConfirmOpen(true)} className="flex items-center gap-2 rounded-[10px] border border-[#FF0808]/25 bg-[#FF0808]/10 cursor-pointer hover:bg-[#FF0808]/20 active:bg-[#FF0808]/10 p-1 transition-all duration-100">
                                            <Delete className="w-[25px] h-[25px] stroke-[#FF0808] stroke-2" /> 
                                            <span className="whitespace-nowrap pr-2 text-[#FF0808]/75 font-bold">Delete room</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                            
                        </div>
                    </div>


                    <div className="grid grid-cols-[2fr_3fr] w-full h-auto py-[1rem] gap-[1rem]">

                        {/* <GalleryViewer
                            imageBlob={imageBlob}
                            setImageBlob={setImageBlob}
                            imagePreview={imagePreview}
                            setImagePreview={setImagePreview}
                        /> */}

                        <GalleryViewer
                            images={images}
                            setImages={setImages}
                        />

                        <div className="flex flex-col items-center gap-4 w-full border-box">
                            <div className="flex flex-col items-start gap-1 w-full">
                                <span>Name</span>
                                <input type="text" placeholder="Enter room name here..."
                                value={title} onChange={(e) => setTitle(e.target.value)}
                                className="w-full p-2 border border-[#1D242B]/25 rounded-[10px] focus:outline-[#0077C0]"/>
                            </div>

                            <div className="flex flex-col items-start gap-1 w-full">
                                <span>Description</span>
                                <textarea name="description" id="room_description" rows={5} placeholder="Enter description here..."
                                value={description} onChange={(e) => setDescription(e.target.value)}
                                className="w-full p-2 border border-[#1D242B]/25 rounded-[10px] focus:outline-[#0077C0] whitespace-pre-wrap"></textarea>
                            </div>

                            <div className="flex items-center w-full gap-2">
                                <div className="flex flex-col items-start gap-1 w-full whitespace-nowrap">
                                    <span>Select Room Type</span>
                                    <div className="flex flex-col items-center gap-1 w-full">
                                        <label htmlFor="room_bedspace" className={`p-2 px-3 font-bold border-2 rounded-[10px] w-full cursor-pointer text-[#1D242B]/75 text-center hover:opacity-80 active:bg-[#0077C0]
                                            ${typeSelected === 'bedspace' ? 'bg-[#0077C0] text-[#FAFAFA]/100 border-[#0077C0]' : 'bg-[#1D242B]/15 border-[#1D242B]/10'}`}>
                                            <span>Bedspace</span>
                                            <input type="radio" name="room_type" id="room_bedspace" value={'bedspace'} checked={typeSelected === 'bedspace'} onChange={() => setTypeSelected('bedspace')} hidden/>
                                        </label>

                                        <label htmlFor="room_apartment" className={`p-2 px-3 font-bold border-2 rounded-[10px] w-full cursor-pointer text-[#1D242B]/75 text-center hover:opacity-80 active:bg-[#0077C0]
                                            ${typeSelected === 'apartment' ? 'bg-[#0077C0] text-[#FAFAFA]/100 border-[#0077C0]' : 'bg-[#1D242B]/15 border-[#1D242B]/10'}`}>
                                            <span>Apartment</span>
                                            <input type="radio" name="room_type" id="room_apartment" value={'apartment'} checked={typeSelected === 'apartment'} onChange={() => setTypeSelected('apartment')} hidden />
                                        </label>
                                    </div>  
                                </div>

                                <div className="flex flex-col items-start gap-1 w-full whitespace-nowrap">
                                    <span>Select Gender</span>
                                    <div className="flex flex-col items-center gap-1 w-full">
                                        <label htmlFor="gender_male" className={`p-2 px-3 font-bold border-2 rounded-[10px] w-full cursor-pointer text-[#1D242B]/75 text-center hover:opacity-80 active:bg-[#0077C0]
                                            ${genderSelected === 'male' ? 'bg-[#0077C0] text-[#FAFAFA]/100 border-[#0077C0]' : 'bg-[#1D242B]/15 border-[#1D242B]/10'}`}>
                                            <span>Male</span>
                                            <input type="radio" name="gender" id="gender_male" value={'male'} checked={genderSelected === 'male'} onChange={() => setGenderTypeSelected('male')} hidden/>
                                        </label>

                                        <label htmlFor="gender_female" className={`p-2 px-3 font-bold border-2 rounded-[10px] w-full cursor-pointer text-[#1D242B]/75 text-center hover:opacity-80 active:bg-[#0077C0]
                                            ${genderSelected === 'female' ? 'bg-[#0077C0] text-[#FAFAFA]/100 border-[#0077C0]' : 'bg-[#1D242B]/15 border-[#1D242B]/10'}`}>
                                            <span>Female</span>
                                            <input type="radio" name="gender" id="gender_female" value={'female'} checked={genderSelected === 'female'} onChange={() => setGenderTypeSelected('female')} hidden />
                                        </label>
                                    </div>  
                                </div>
                            </div>

                            <div className="flex flex-col w-full items-start gap-1">
                                <div className="flex items-center gap-2">
                                    <span className="leading-tight">Price</span>
                                    <span className="text-[14px] opacity-75 leading-tight">(Monthly price example: Php 2500 / month)</span>
                                </div>

                                <div className="flex items-center justify-between w-full border border-[#1D242B]/50 rounded-[10px] focus-within:border-[#0077C0] focus-within:border-2">
                                    <input type="text" placeholder="Enter starting price" 
                                    value={price} onChange={(e) => setPrice(e.target.value)}
                                    className="w-full p-2 rounded-[10px] focus:outline-none"/>

                                    <span className="whitespace-nowrap font-bold px-2 opacity-50">/ Month</span>
                                </div>
                            </div>

                            {typeSelected === 'apartment' && (
                                <>
                                    <div className="flex flex-col w-full items-start gap-1">
                                        <span>Capacity</span>
                                        <input type="text" placeholder="Enter maximum capacity" value={capacity} onChange={(e) => setCapacity(Number(e.target.value))} className="w-full p-2 border border-[#1D242B]/25 rounded-[10px] focus:outline-[#0077C0]"/>
                                    </div>

                                    <div className="flex flex-col w-full items-start gap-1">
                                        <span>Available Slot</span>
                                        <input type="text" placeholder="Enter available slot" value={slot} onChange={(e) => setSlot(Number(e.target.value))} className="w-full p-2 border border-[#1D242B]/25 rounded-[10px] focus:outline-[#0077C0]"/>
                                    </div>
                                </>
                            )}
                            

                            {typeSelected === 'bedspace' && (
                                <div className="flex flex-col items-center w-full p-[1rem] border-dashed border-2 border-[#1D242B]/25 rounded-[10px] gap-2 bg-[#C7EEFF]/50">
                                    <span className="text-[14px] text-[#1D242B] font-bold">Bedspace Configuration</span>

                                    <div className="flex items-center gap-4 w-full">
                                        <div className="flex flex-col gap-2 w-full">
                                            <div className="flex items-center gap-1 w-full">
                                                <span className="whitespace-nowrap">Total Upper Decks</span>
                                                <input type="text" placeholder="Enter max number of upper decks" 
                                                value={upperDeckTotal} onChange={(e) => setUpperDeckTotal(Number(e.target.value))}
                                                className="w-full p-2 border border-[#1D242B]/25 bg-[#FAFAFA] rounded-[10px] focus:outline-[#0077C0]"/>
                                            </div>

                                            <div className="flex items-center gap-1 w-full">
                                                <span className="whitespace-nowrap">Total Lower Decks</span>
                                                <input type="text" placeholder="Enter max number of lower decks"
                                                value={lowerDeckTotal} onChange={(e) => setLowerDeckTotal(Number(e.target.value))}
                                                className="w-full p-2 border border-[#1D242B]/25 bg-[#FAFAFA] rounded-[10px] focus:outline-[#0077C0]"/>
                                            </div>

                                            <div className="flex items-center justify-between gap-2 w-full">
                                                <span className="whitespace-nowrap">Total Capacity</span>
                                                <span className="text-[#1D242B] text-right font-bold bg-[#0077C0]/50 p-2 rounded-[10px] w-full border border-[#0077C0]">{computedCapacity}</span>
                                            </div>
                                            {/* Total Capacity display */}
                                        </div>

                                        <div className="flex flex-col gap-2 w-full">
                                            <div className="flex items-center gap-1 w-full">
                                                <span className="whitespace-nowrap">Available Upper Decks</span>
                                                <input type="text" placeholder="Enter available number of upper decks"
                                                value={upperDeckAvailable} onChange={(e) => setUpperDeckAvailable(Number(e.target.value))}
                                                className="w-full p-2 border border-[#1D242B]/25 bg-[#FAFAFA] rounded-[10px] focus:outline-[#0077C0]"/>
                                            </div>

                                            <div className="flex items-center gap-1 w-full">
                                                <span className="whitespace-nowrap">Available Lower Decks</span>
                                                <input type="text" placeholder="Enter available number of lower decks"
                                                value={lowerDeckAvailable} onChange={(e) => setLowerDeckAvailable(Number(e.target.value))}
                                                className="w-full p-2 border border-[#1D242B]/25 bg-[#FAFAFA] rounded-[10px] focus:outline-[#0077C0]"/>
                                            </div>

                                            <div className="flex items-center justify-between gap-2 w-full">
                                                <span className="whitespace-nowrap">Total Slot</span>
                                                <span className="text-[#1D242B] text-right font-bold bg-[#0077C0]/50 p-2 rounded-[10px] w-full border border-[#0077C0]">{computedSlot}</span>
                                            </div>
                                            {/* Total Slot display */}
                                        </div>
                                    </div>
                                </div>
                            )}


                            <div className="flex flex-col items-center w-full p-[1rem] border-dashed border-2 border-[#1D242B]/25 rounded-[10px] gap-2 bg-[#C7EEFF]/50">
                                <span className="text-[14px] text-[#1D242B] font-bold">Payment Term Configuration</span>


                                <div className="flex flex-col gap-2 w-full">

                                    <div className="flex flex-col items-start w-full gap-2">
                                        {/* Value Pair block */}
                                        {paymentTermPair.map((pair, index) => (
                                            <div key={index} className="flex items-center w-full gap-2 border border-[#1D242B]/50 p-2 rounded-[10px] bg-[#FFF]">
                                                <div className="flex items-center gap-2 w-full">
                                                    <span>Term</span>
                                                    <input type="text" name="term" id="term_name" placeholder="Enter term" 
                                                    value={pair.term} 
                                                    onChange={(e) => handlePairOnChange(index, "term", e.target.value)}
                                                    className={`w-full p-2 bg-[#1D242B]/10 rounded-[10px] focus:outline-[#0077C0]`} />
                                                </div>
                                                <div className="flex items-center gap-2 w-full">
                                                    <span>Amount</span>
                                                    <input type="text" name="term" id="term_amount" placeholder="Enter amount"  
                                                    value={Number(pair.amount)}
                                                    onChange={(e) => handlePairOnChange(index, "amount", e.target.value)}
                                                    className={`w-full p-2 bg-[#1D242B]/10 rounded-[10px] focus:outline-[#0077C0]`} />
                                                </div>

                                                <button onClick={() => handleDeletePair(index)} className={`group cursor-pointer rounded-full  p-2 ${paymentTermPair.length === 1 ? 'opacity-25' : 'hover:bg-[#1D242B]/15 active:bg-[#FAFAFA]'}`} disabled={paymentTermPair.length === 1}>
                                                    <Remove className="w-[25px] h-[25px]" />
                                                </button>
                                            </div>  
                                        ))}
                                    </div>

                                    {error && (
                                        <span className="text-[14px] text-[#FA0845] text-center">{error}</span>
                                    )}

                                    <div className="flex items-center justify-center w-full gap-1">
                                        <button onClick={handleAddPair} className="flex items-end justify-end px-[2rem] py-2 rounded-[10px] border border-[#1D242B] bg-[#1D242B] text-[#FAFAFA] cursor-pointer hover:opacity-80 active:opacity-100">+ Add</button>
                                    </div>
                                </div>
                                {/* Key value pair of Term title + Amount */}
                            </div>

                            <div className="flex flex-col items-center w-full p-[1rem] border-dashed border-2 border-[#1D242B]/25 rounded-[10px] gap-2 bg-[#C7EEFF]/50">
                                <span className="text-[14px] text-[#1D242B] font-bold">Management Configuration</span>

                                <BranchSelectionViewWrapper 
                                    branches={branches}
                                    selectedBranch={selectedBranch}
                                    setSelectedBranch={setSelectedBranch}
                                />
                            </div>

                            <div className="flex flex-col items-center w-full p-[1rem] border-dashed border-2 border-[#1D242B]/25 rounded-[10px] gap-2">
                                <span className="text-[14px] text-[#1D242B] font-bold">Inclusions</span>

                                {/* Selection of Property Manager and Branch */}
                                <div className="flex items-center gap-1 w-full">

                                    {/* Change text to white and background to black if selected  */}
                                    <InclusionSelectionViewWrapper 
                                        inclusions={inclusions}
                                        selectedInclusions={selectedInclusions}
                                        setSelectedInclusions={setSelectedInclusions}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {changesMade && (
                        <div className="flex items-center w-full items-end justify-end gap-1">
                            <button onClick={() => handleRoomChange(room.id)} className="flex items-center px-4 py-2 border-2 border-[#0077C0] bg-[#0077C0]/75 hover:bg-[#0077C0] active:bg-[#0077C0]/75 text-[#FAFAFA] font-bold rounded-[10px] cursor-pointer">{loading ? 'Saving changes...' : 'Save Changes'}</button>
                            <Link href={'/admin/room-listing'} className="flex items-center px-4 py-2 border-2 border-[#0077C0] hover:bg-[#0077C0]/15 active:bg-[#FAFAFA] text-[#0077C0] font-bold rounded-[10px] cursor-pointer">Cancel</Link>
                        </div>
                    )}
                </div>
            </div>


            <div className="fixed flex z-50">
                {error && <ErrorToast message={error} />}
                {successMessage && <SuccessToast message={successMessage} />}
                {deleteMessage && <DeleteToast message={deleteMessage} />}
            </div>


            {confirmOpen && (
                <ConfirmWindow 
                    title={'Delete Room'}
                    message={`You are about to delete the room with Room ID: ${room?.room_uuid}. Do you want to proceed?`}
                    onCancel={() => {
                        setConfirmOpen(false)
                        setDeleteOpen(false)
                    }}
                    onConfirm={ () => {
                        setConfirmOpen(false);
                        handleDeleteRoom(room?.id)
                    }}
                />
            )}
        </>
    )
}