"use client"

import axios from "axios"
import { useState } from "react"
import { BASE_URL } from "@/config/config"

import Remove from '@/asset/icon/delete.svg'
import GalleryWrapper from "./GalleryWrapper"
import InclusionSelectionWrapper from "./InclusionSelectionWrapper"
import BranchSelectionWrapper from "./BranchSelectionWrapper"

import ErrorToast from "@/components/admin/Toast/ErrorToast"
import SuccessToast from "@/components/admin/Toast/SuccessToast"
import Link from "next/link"

type PaymentTerms = {
    term: string,
    amount: number
}

export type InclusionType = {
    id: number,
    inclusion: string
}

export type BranchType = {
    branch_id: number,
    branch_name: string
    property_manager_id: number,
    property_manager: string
}

type RoomImage =
    | { type: "existing"; url: string }
    | { type: "new"; file: File };

interface RoomProps {
    inclusions: InclusionType[]
    branches: BranchType[]
}

export default function CreateRoomPageWrapper ({ inclusions, branches }: RoomProps) {
    const [roomName, setRoomName] = useState<string>('');
    const [roomDescription, setRoomDescription] = useState<string>('');
    const [roomPrice, setRoomPrice] = useState<number>(0) 

    const [totalUpperDecks, setTotalUpperDecks] = useState<number>(0);
    const [totalLowerDecks, setTotalLowerDecks] = useState<number>(0);
    
    const [availableUpperDecks, setAvailableUpperDecks] = useState<number>(0);
    const [availableLowerDecks, setAvailableLowerDecks] = useState<number>(0);

    const [typeSelected, setTypeSelected] = useState<string>('bedspace');
    const [genderSelected, setGenderTypeSelected] = useState<string>('male')
    const [selectedBranch, setSelectedBranch] = useState<number | null>(null)
    const [selectedInclusions, setSelectedInclusions] = useState<number[]>([])
    const [images, setImages] = useState<RoomImage[]>([]);

    console.log('Images: ', images);
    console.log('Inclusions: ', selectedInclusions);

    const totalBedspaceCapacity = totalUpperDecks + totalLowerDecks;
    const TotalBedspaceSlot = availableUpperDecks + availableLowerDecks;


    const [totalAparmentCapacity, setTotalApartmentCapacity] = useState<number>(0)
    const [totalAparmentSlot, setTotalApartmentSlot] = useState<number>(0)

    const [loading, setLoading] = useState<boolean>(false);

    const finalCapacity = 
        typeSelected === 'bedspace'
            ? totalBedspaceCapacity
            : totalAparmentCapacity

    const finalSlot = 
        typeSelected === 'bedspace'
            ? TotalBedspaceSlot
            : totalAparmentSlot


    const [error, setError] = useState<string>('');
    const [errorToastMessage, setErrorToastMessage] = useState<string>('');
    const [successToastMessage, setSuccessToastMessage] = useState<string>('')
    
    const [paymentTermPair, setPaymentTermPair] = useState<PaymentTerms[]>([
        { term: "", amount: 0 }
    ])


    const handleAddPair = () => {
        const lastPair = paymentTermPair[paymentTermPair.length - 1];

        if (lastPair.term === "" || lastPair.amount === 0) {
            setError("Missing required fields");
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

    const handleSubmitNewRoom = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
    
            formData.append('title', roomName);
            formData.append('description', roomDescription);
            formData.append('price', String(roomPrice));
            formData.append('type', typeSelected);

            if (typeSelected === 'bedspace') {
                formData.append('upper_deck_total', String(totalUpperDecks));
                formData.append('lower_deck_total', String(totalLowerDecks));
                formData.append('upper_deck_available', String(availableUpperDecks));
                formData.append('lower_deck_available', String(availableLowerDecks));



                if (totalUpperDecks < availableUpperDecks) {
                    setErrorToastMessage('Available upper decks should be lower or equal to the total upper decks');
                    setTimeout(() => setErrorToastMessage(''), 2500);

                    return;
                }

                if (totalLowerDecks < availableLowerDecks) {
                    setErrorToastMessage('Available lower decks should be lower or equal to the total lower decks');
                    setTimeout(() => setErrorToastMessage(''), 2500);

                    return;
                }
            }

            formData.append('slot', String(finalSlot))
            formData.append('capacity', String(finalCapacity));
            formData.append('payment_term', JSON.stringify(paymentTermPair));
            formData.append('gender', genderSelected);
            formData.append('branch_id', String(selectedBranch));

            selectedInclusions.forEach(inc => {
                formData.append('inclusions', String(inc))
            });

            images.forEach(img => {
                if (img.type === "new") {
                    formData.append("room_image", img.file);
                }
            });
    
            
            // Error handling 
            // Show ErrorToast if error is made 
            if (!roomName.trim()) {
                setErrorToastMessage('Room name is required');
                setTimeout(() => setErrorToastMessage(''),2500);
                return;
            }

            if (!roomDescription.trim()) {
                setErrorToastMessage('Description is required');
                setTimeout(() => setErrorToastMessage(''),2500);
                return;
            }

            if (roomPrice <= 0 || isNaN(roomPrice)) {
                setErrorToastMessage('Price is required and must be not be 0.')
                setTimeout(() => setErrorToastMessage(''), 2500);
                return;
            }

            if (!selectedBranch) {
                setErrorToastMessage('Please select a branch')
                setTimeout(() => setErrorToastMessage(''), 2500);
                return;
            }

            if (images.length === 0) {
                setErrorToastMessage('Please upload at least one room image');
                setTimeout(() => setErrorToastMessage(''), 2500);
                return;
            }

    
            await axios.post(`${BASE_URL}/room/v1/new-room`, formData, {
                withCredentials: true
            });

            // successful creation resets all states
            setRoomName('');
            setRoomDescription('');
            setRoomPrice(0);
            setTypeSelected('bedspace');
            setGenderTypeSelected('male');
            setTotalApartmentCapacity(0);
            setTotalApartmentSlot(0);
            setTotalUpperDecks(0);
            setTotalLowerDecks(0);
            setAvailableUpperDecks(0);
            setAvailableLowerDecks(0);
            setPaymentTermPair([{ term: "", amount: 0 }]);
            setSelectedBranch(null);
            setSelectedInclusions([]);
            setImages([]);

            setSuccessToastMessage(`Room created successfully`);
            setTimeout(() => setSuccessToastMessage(''), 3500)

        } catch (err) {
            console.error('Failed to create new room: ', err);
            setErrorToastMessage('Failed to create room');
            setTimeout(() => setErrorToastMessage(''), 3500)
        } finally {
            setLoading(false);
        }
    }

    
    return (
        <>
            <div className="flex w-full min-h-screen">
                <div className="flex flex-col items-start w-full px-[1rem] xl:px-[8rem] py-[1rem]">
                    <span className="text-[28px] text-[#1D242B] font-[900]">Create New Listing</span>


                    <div className="grid grid-cols-[2fr_3fr] w-full h-auto py-[1rem] gap-[1rem]">
                        <GalleryWrapper
                            images={images}
                            setImages={setImages}
                        />

                        <div className="flex flex-col items-center gap-4 w-full border-box">
                            <div className="flex flex-col items-start gap-1 w-full">
                                <span>Name</span>
                                <input type="text" placeholder="Enter room name here..."
                                value={roomName} onChange={(e) => setRoomName(e.target.value)}
                                className="w-full p-2 border border-[#1D242B]/50 rounded-[10px] focus:outline-[#0077C0]"/>
                            </div>

                            <div className="flex flex-col items-start gap-1 w-full">
                                <span>Description</span>
                                <textarea name="description" id="room_description" rows={5} placeholder="Enter description here..." value={roomDescription} onChange={(e) => setRoomDescription(e.target.value)}
                                className="w-full p-2 border border-[#1D242B]/50 rounded-[10px] focus:outline-[#0077C0]"></textarea>
                            </div>

                            <div className="flex flex-col w-full items-start gap-1">
                                <div className="flex items-center gap-2">
                                    <span className="leading-tight">Price</span>
                                    <span className="text-[14px] opacity-75 leading-tight">(Monthly price example: Php 2500 / month)</span>
                                </div>
                                
                                <div className="flex items-center justify-between w-full border border-[#1D242B]/50 rounded-[10px] focus-within:border-[#0077C0] focus-within:border-2">
                                    <input type="text" placeholder="Enter starting price" 
                                    value={roomPrice} onChange={(e) => setRoomPrice(Number(e.target.value))}
                                    className="w-full p-2 rounded-[10px] focus:outline-none"/>

                                    <span className="whitespace-nowrap font-bold px-2 opacity-50">/ Month</span>
                                </div>
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

                            {typeSelected === 'apartment' && (
                                <div className="flex flex-col items-center justify-center gap-2 w-full p-[1rem] rounded-[10px] border-2 border-dashed border-[#1D242B]/25 bg-[#C7EEFF]/50">
                                    <span className="text-[14px] font-bold">Apartment Configuration</span>
                                    <div className="flex w-full items-center gap-2">
                                        <span className="whitespace-nowrap">Total Capacity</span>
                                        <input type="text" placeholder="Enter maximum capacity"
                                        value={totalAparmentCapacity} onChange={(e) => setTotalApartmentCapacity(Number(e.target.value))}
                                        className="w-full p-2 border border-[#1D242B]/50 rounded-[10px] focus:outline-[#0077C0] bg-[#FAFAFA]"/>
                                    </div>

                                    <div className="flex w-full items-center gap-2">
                                        <span className="whitespace-nowrap">Available Slot</span>
                                        <input type="text" placeholder="Enter available slot"
                                        value={totalAparmentSlot} onChange={(e) => {
                                            const value = Number(e.target.value) || 0;
                                            setTotalApartmentSlot(Math.min(value, totalAparmentCapacity))
                                        }}
                                        className="w-full p-2 border border-[#1D242B]/50 rounded-[10px] focus:outline-[#0077C0] bg-[#FAFAFA]"/>
                                    </div>
                                </div>
                            )}
                            

                            {typeSelected === 'bedspace' && (
                                <div className="flex flex-col items-center w-full p-[1rem] border-dashed border-2 border-[#1D242B]/25 rounded-[10px] gap-2 bg-[#C7EEFF]/50">
                                    <span className="text-[14px] text-[#1D242B] font-bold">Bedspace Configuration</span>

                                    <div className="flex items-center gap-4 w-full">
                                        <div className="flex flex-col gap-2 w-full">
                                            <div className="flex items-center gap-1 w-full">
                                                <span className="whitespace-nowrap">Total Upper Decks</span>
                                                <input type="text" placeholder="Enter max number of upper decks" 
                                                value={totalUpperDecks} onChange={(e) => setTotalUpperDecks(Number(e.target.value))} className="w-full p-2 border border-[#1D242B]/50 bg-[#FAFAFA] rounded-[10px] focus:outline-[#0077C0]"/>
                                            </div> 

                                            <div className="flex items-center gap-1 w-full">
                                                <span className="whitespace-nowrap">Total Lower Decks</span>
                                                <input type="text" placeholder="Enter max number of lower decks" 
                                                value={totalLowerDecks} onChange={(e) => setTotalLowerDecks(Number(e.target.value))} className="w-full p-2 border border-[#1D242B]/50 bg-[#FAFAFA] rounded-[10px] focus:outline-[#0077C0]"/>
                                            </div>

                                            <div className="flex items-center justify-between gap-2 w-full">
                                                <span className="whitespace-nowrap">Total Capacity</span>
                                                <span className="text-[#1D242B] text-right font-bold bg-[#0077C0]/50 p-2 rounded-[10px] w-full border border-[#0077C0]">{totalBedspaceCapacity}</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2 w-full">
                                            <div className="flex items-center gap-1 w-full">
                                                <span className="whitespace-nowrap">Available Upper Decks</span>
                                                <input type="text" placeholder="Enter available number of upper decks"
                                                value={availableUpperDecks} onChange={(e) => {
                                                    const value = Number(e.target.value) || 0
                                                    setAvailableUpperDecks(Math.min(value, totalUpperDecks))
                                                }}
                                                className="w-full p-2 border border-[#1D242B]/50 bg-[#FAFAFA] rounded-[10px] focus:outline-[#0077C0]"/>
                                            </div>

                                            <div className="flex items-center gap-1 w-full">
                                                <span className="whitespace-nowrap">Available Lower Decks</span>
                                                <input type="text" placeholder="Enter available number of lower decks"
                                                value={availableLowerDecks} onChange={(e) => {
                                                    const value = Number(e.target.value) || 0;
                                                    setAvailableLowerDecks(Math.min(value, totalLowerDecks))
                                                }}
                                                className="w-full p-2 border border-[#1D242B]/50 bg-[#FAFAFA] rounded-[10px] focus:outline-[#0077C0]"/>
                                            </div>

                                            <div className="flex items-center justify-between gap-2 w-full">
                                                <span className="whitespace-nowrap">Total Slot</span>
                                                <span className="text-[#1D242B] text-right font-bold bg-[#0077C0]/50 p-2 rounded-[10px] w-full border border-[#0077C0]">{TotalBedspaceSlot}</span>
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
                                                    <Remove className="w-[25px] h-[25px] stroke-[#1D242B] stroke-2" />
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


                            {/* CONDITION: IF NO BRANCH AND PROPERTY MANAGER, show reminder message and instruct to create Branch/property Manager first */}
                            <div className="flex flex-col items-center w-full p-[1rem] border-dashed border-2 border-[#1D242B]/25 rounded-[10px] gap-2 bg-[#C7EEFF]/50">
                                <span className="text-[14px] text-[#1D242B] font-bold">Management Configuration</span>

                                {/* Selection of Property Manager and Branch */}
                                <div className="flex flex-col items-center gap-2 w-full">
                                    <BranchSelectionWrapper
                                        branches={branches}
                                        selectedBranch={selectedBranch}
                                        setSelectedBranch={setSelectedBranch}
                                    />

                                    {/* <PropertyManagerSelectionWrapper
                                        managers={managers}
                                    /> */}
                                </div>
                            </div>

                            <div className="flex flex-col items-center w-full p-[1rem] border-dashed border-2 border-[#1D242B]/25 rounded-[10px] gap-2">
                                <span className="text-[14px] text-[#1D242B] font-bold">Inclusions</span>
                                
                                {inclusions.length > 0 && (
                                    <div className="flex flex-col items-center gap-1">
                                        <span className="text-[14px] text-[#1D242B] italic">(Select all that applies)</span>
                                    </div>
                                )}
                                
                                {/* Selection of Property Manager and Branch */}
                                <InclusionSelectionWrapper 
                                    inclusions={inclusions}
                                    selectedInclusions={selectedInclusions}
                                    setSelectedInclusions={setSelectedInclusions}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center w-full items-end justify-end gap-1">
                        <button onClick={handleSubmitNewRoom} className="flex items-center px-4 py-2 border-2 border-[#0077C0] bg-[#0077C0] hover:bg-[#006BAC] active:bg-[#0077C0] text-[#FAFAFA] font-bold rounded-[10px] cursor-pointer">{loading ? 'Creating...' : 'Create'}</button>
                        <Link href={'/admin/room-listing'} className="flex items-center px-4 py-2 border-2 border-[#0077C0] text-[#0077C0] hover:bg-[#0077C0]/15 active:bg-[#FAFAFA] font-bold rounded-[10px] cursor-pointer">Cancel</Link>
                    </div>
                </div>
            </div>

            {errorToastMessage && (
                <ErrorToast message={errorToastMessage} />
            )}

            {successToastMessage && (
                <SuccessToast message={successToastMessage} />
            )}
        </>
    )
}