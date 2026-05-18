"use client"

export type Manager = {
    id: number,
    fullname: string
}

interface CreateBranchModalProp {
    isModalOpen: () => void;
    propertyManager: Manager[];
    onSuccess: () => void;
    toastMessage: (msg: string) => void;
    alertMessage: (msg: string) => void;
}

import axios from 'axios';
import Close from '@/asset/icon/cancel.svg'
import Delete from '@/asset/icon/delete.svg'
import UploadImage from '@/asset/icon/upload-image.svg'
import ChangeImage from '@/asset/icon/change-image.svg'

import { useState } from 'react';

export default function CreateBranchModal ({ isModalOpen, propertyManager, onSuccess, toastMessage, alertMessage }:CreateBranchModalProp ) {

    const [landmarks, setLandmarks] = useState<string[]>([])
    const [branchImagePreview, setBranchImagePreview] = useState<string | undefined>(undefined)
    const [branchImageBlob, setBranchImageBlob] = useState<File | null>(null)


    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [selectedManager, setSelectedManager] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const [error, setError] = useState<string>('');
    

    const handleAddLandmark = () => {
        setLandmarks(prev => [...prev, ''])
    }

    const handleLandmarkChange = (index: number, value: string) => {
        setLandmarks(prev => prev.map((landmark, i) => 
            i === index ? value : landmark
        ))
    }

    const handleDeleteLandmark = (index: number) => {
        setLandmarks(prev => 
            prev.filter((_, i) => i !== index)
        )
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            if (branchImagePreview) {
                URL.revokeObjectURL(branchImagePreview)
            }

            setBranchImageBlob(file);
            setBranchImagePreview(URL.createObjectURL(file))
        }
    }


    const handleSubmit = async () => {
        if (!name || !address || !selectedManager || !branchImageBlob) {
            alertMessage('Please fill all required fields');

            setTimeout(() => alertMessage(''), 3000);
            return;
        }

        setLoading(true);
        toastMessage('')

        try {
            // Fake loading
            await new Promise(resolve => setTimeout(resolve, 1500));
            const branchFormData = new FormData();

            branchFormData.append('name', name);
            branchFormData.append('address', address);

            branchFormData.append(
                'landmarks',
                JSON.stringify(
                    landmarks.filter(l => l.trim() !== '')
                )
            );

            toastMessage(`Branch ${name} created successfully!`);

            branchFormData.append('userId', selectedManager);
            branchFormData.append('branch_image', branchImageBlob);

            await axios.post('http://localhost:5000/branch/v1/new', branchFormData, {
                withCredentials: true
            });

            // success
            onSuccess();
            setTimeout(() => toastMessage(''), 4000);
            isModalOpen(); // close modal

        } catch (err) {
            console.error('Create branch failed:', err);
        } finally {
            setLoading(false);
        }
    };
    
    

    return (
        <>
            <div className="relative flex flex-col w-[750px] h-auto bg-[#FAFAFA] rounded-[10px] border-2 border-[#1D242B]/50 p-[2rem] gap-[1rem]">
                <button onClick={isModalOpen} className="absolute top-4 right-4 cursor-pointer rounded-full p-2 hover:bg-[#1D242B]/15 active:bg-[#FAFAFA]">
                    <Close className="w-[15px] h-[15px]" />
                </button>

                <div className="flex flex-col w-auto gap-[1rem]">
                    <span className="text-[28px] text-[#1D242B] font-bold leading-[1]">Create Branch</span>

                    <div className='grid grid-cols-[2fr_3fr] w-full gap-[1rem]'>

                        {/* Image Preview Block */}
                        <div className='flex flex-col item-start gap-2'>  
                            <input type="file" name="image" id="branch_image" accept="image/jpeg, image/png" hidden onChange={handleImageChange}/>

                            {!branchImagePreview ? (
                                <label htmlFor="branch_image" className='flex flex-col items-center justify-center w-full gap-2 rounded-[10px] border-2 border-dashed border-[#0077C0]/50 bg-[#0077C0]/10 hover:bg-[#0077C0]/25 active:bg-[#0077C0]/10 p-[1rem] cursor-pointer'>
                                    <UploadImage className="w-[40px] h-[40px] stroke-[#0077C0] opacity-75" />
                                    <span className='text-[14px] text-[#0077C0]'>(Upload 1 Image)</span>
                                </label>
                            ) : (
                                <div className='group relative flex w-full h-[250px] bg-[#1D242B]/25 rounded-[10px] overflow-hidden border-2 border-dashed border-[#1D242B]/25'>
                                    <div className='absolute flex w-full h-full group-hover:bg-[#1D242B]/50 transition-all duration-100'>
                                        <label htmlFor="branch_image" className='absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 cursor-pointer bg-[#FAFAFA] hover:bg-[#C7EEFF]/90 active:bg-[#FAFAFA] rounded-full px-4 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-100'>
                                            <div className='flex items-center gap-2'>
                                                <ChangeImage className="w-[20px] h-[20px] stroke-[#0077C0] opacity-75" /> 
                                                <span className='text-[#1D242B] '>Change</span>
                                            </div>
                                        </label>
                                    </div>

                                    <img src={branchImagePreview} alt="branch-image" className='w-full h-full object-cover'/>
                                </div>
                            )}
                        </div>


                        <div className='flex flex-col w-full gap-[1rem]'>
                            <div className='flex flex-col gap-2'>
                                <span className='text-[16px] font-bold'>Basic Information</span>

                                <div className='flex flex-col items-start w-full gap-1'>
                                    <span className='text-[14px] opacity-75'>Name</span>
                                    <input type="text" placeholder='Enter the name of the branch here' value={name} onChange={(e) => setName(e.target.value)} className='w-full p-[1rem] rounded-[10px] bg-[#1D242B]/10 border border-[#1D242B]/25 hover:border-[#1D242B]/50 focus:outline-none focus:border-[#0077C0]' />
                                </div>

                                <div className='flex flex-col items-start w-full gap-1'>
                                    <span className='text-[14px] opacity-75'>Address</span>
                                    <input type="text" placeholder='Enter the name of the branch here' value={address} onChange={(e) => setAddress(e.target.value)} className='w-full p-[1rem] rounded-[10px] bg-[#1D242B]/10 border border-[#1D242B]/25 hover:border-[#1D242B]/50 focus:outline-none focus:border-[#0077C0]' />
                                </div>
                            </div>

                            <div className='flex flex-col items-start w-full gap-2'>
                                <span className='text-[16px] font-bold'>Landmarks</span>

                                <div className='flex flex-col w-full gap-2'>
                                    {landmarks.length > 0 && (
                                        landmarks.map((landmark, index) => (
                                            <div key={index} className='flex items-center gap-2 rounded-[10px] bg-[#1D242B]/10 border border-[#1D242B]/25 hover:border-[#1D242B]/50 '>
                                                <input type="text" placeholder='Enter a landmark here' value={landmark} onChange={(e) => handleLandmarkChange(index, e.target.value)}
                                                className='w-full p-[0.5rem] focus:outline-none' />

                                                <button onClick={() => handleDeleteLandmark(index)} className='opacity-50 hover:opacity-100 active:opacity-50 p-2 cursor-pointer'>
                                                    <Delete className="w-[25px] h-[25px] stroke-[#1D242B] stroke-" />
                                                </button>
                                            </div>  
                                        ))
                                    )}

                                    <button onClick={handleAddLandmark} className='flex items-center justify-center w-full py-2 rounded-[10px] cursor-pointer border-dashed border-2 border-[#0077C0]/50 bg-[#0077C0]/10 hover:bg-[#1D242B]/25 active:bg-[#1D242B]/10 transition-all duration-100'>
                                        <span className='font-bold text-[14px] text-[#1D242B]'>+ Add Landmark</span>
                                    </button>
                                </div>
                            </div>

                            <div className='flex flex-col w-full gap-1'>
                                <span className='text-[16px] font-bold'>Assign a Property Manager</span>
                                <select name="property_manager" id="property_manager" onChange={(e) => setSelectedManager(e.target.value)} className='w-full p-[1rem] rounded-[10px] bg-[#1D242B]/10 border border-[#1D242B]/25 hover:border-[#1D242B]/50 focus:outline-none focus:border-[#0077C0]'>
                                    <option hidden>Select Property Manager</option>
                                    {propertyManager.map((pm) => (
                                        <option key={pm.id} value={pm.id}>{pm.fullname}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <button onClick={handleSubmit} disabled={loading} className='w-full bg-[#0077C0] text-[#FAFAFA] font-bold rounded-[10px] py-[1rem] cursor-pointer hover:bg-[#0077C0]/90 active:bg-[#0077C0]'>
                        {loading ? '...loading' : 'Continue'}
                    </button>
                </div>
            </div>

        </>
    )
}