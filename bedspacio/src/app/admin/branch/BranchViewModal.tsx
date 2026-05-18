"use client"

type PropertyManagersType = {
    id: number,
    fullname: string
}

type Landmark = {
    id?: number,
    landmark: string
}

export type branchByIdType = {
    id: number,
    branch_name: string,
    image: string,
    address: string,
    property_manager: string,
    property_manager_id: number,
    landmarks: Landmark[],
}

export type branchByIdProp = {
    branch: branchByIdType;
}

interface CreateBranchModalProp {
    propertyManagers: PropertyManagersType[]
    branch: branchByIdType;
    isModalOpen: () => void;
    onDeleteBranch: () => void;
    onSuccess: () => void;
    setSuccessMessage: (msg: string) => void
}

import Menu from '@/asset/icon/menu-three-dots.svg'
import Delete from '@/asset/icon/delete.svg'
import UploadImage from '@/asset/icon/upload-image.svg'
import ChangeImage from '@/asset/icon/change-image.svg'

import { BASE_URL } from '@/config/config'

import { useState } from 'react';
import axios from 'axios'

export default function BranchViewModal ({ propertyManagers, branch, isModalOpen, onDeleteBranch, onSuccess, setSuccessMessage }:CreateBranchModalProp) {

    const [landmarks, setLandmarks] = useState<Landmark[]>(branch.landmarks)
    const [branchName, setBranchName] = useState<string>(branch.branch_name ?? '');
    const [branchAddress, setBranchAddress] = useState<string>(branch.address ?? '');
    const [branchImagePreview, setBranchImagePreview] = useState<string | undefined>(undefined)
    const [branchImageBlob, setBranchImageBlob] = useState<File | null>(null)
    const [selectedPropertyManager, setSelectedPropertyManager] = useState<number>(branch.property_manager_id);


    console.log('branch data: ', branch);

    const [menuOpen, setMenuOpen] = useState<boolean>(false);

    const handleAddLandmark = () => {
        setLandmarks(prev => [
            ...prev,
            {
                landmark: ''
            }
        ]);
    };

    const handleLandmarkChange = (index: number, value: string) => {
        setLandmarks(prev =>
            prev.map((item, i) =>
                i === index
                    ? { ...item, landmark: value }
                    : item
            )
        );
    };

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
    };

    const imageSrc =
        branchImagePreview ||
        (branch?.image
            ? `http://localhost:5000/file/branch/image/${branch.image}`
            : undefined);

    

    const branchNameChanged = branchName !== branch.branch_name;
    const branchAddressChanged = branchAddress !== branch.address;
    const propertyManagerChanged = selectedPropertyManager !== branch.property_manager_id;
    const landmarksChanged = JSON.stringify(landmarks) !== JSON.stringify(branch.landmarks);


    const handleBranchChange = async (id: number) => {
        const formData = new FormData();

        if (branchNameChanged) {
            formData.append('name', branchName);
        };

        if (branchAddressChanged) {
            formData.append('address', branchAddress);
        };

        if (propertyManagerChanged) {
            formData.append('property_manager_id', selectedPropertyManager.toString());
        }

        if (landmarksChanged) {
            formData.append('landmarks', JSON.stringify(landmarks));
        }

        if (branchImageBlob) {
            formData.append('branch_image', branchImageBlob)
        }

        const updated = await axios.patch(
            `${BASE_URL}/branch/v1/${id}`,
            formData , 
            { withCredentials: true })

        console.log('Branch updated: ', updated);

        setSuccessMessage('Update success');

        onSuccess();
        setTimeout(() => setSuccessMessage(''), 3500);
        isModalOpen();
    }


    const DataChanges = branchNameChanged || branchAddressChanged || propertyManagerChanged || landmarksChanged || branchImageBlob
    

    return (
        <div className="relative flex flex-col w-[750px] h-auto bg-[#FAFAFA] rounded-[10px] border-2 border-[#1D242B]/50 p-[2rem] gap-[1rem]">
            <div className="flex flex-col w-auto gap-[1rem]">
                <div className='relative flex items-center justify-between w-full'>
                    <span className="text-[28px] text-[#1D242B] font-bold leading-[1]">View Branch</span>
                    <button onClick={() => setMenuOpen(prev => !prev)} className='rounded-full p-1 opacity-75 cursor-pointer hover:opacity-100 bg-[#1D242B]/15 hover:bg-[#1D242B]/25 active:bg-[#1D242B]/15 transition-all duration-100'>
                        <Menu className="w-[20px] h-[20px]"/>
                    </button>

                    {menuOpen && (
                        <button onClick={onDeleteBranch} className='absolute top-7 right-2 flex items-center gap-1 cursor-pointer p-2 border border-[#FF0808]/25 bg-[#FF0808]/15 hover:bg-[#FF0808]/25 active:bg-[#FF0808]/15 rounded-[10px]'>
                            <Delete className="w-[20px] h-[20px] stroke-[#FF0808] stroke-2 opacity-75" />
                            <span className='text-[14px] text-[#FF0808] font-bold pr-1'>Delete</span>
                        </button>
                    )}
                </div>


                <div className='grid grid-cols-[2fr_3fr] w-full gap-[1rem]'>

                    {/* Image Preview Block */}
                    <div className='flex flex-col items-start gap-2'>  
                        <input type="file" name="image" id="branch_image" accept="image/jpeg, image/png" hidden onChange={handleImageChange}/>

                        {!imageSrc ? (
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

                                <img src={imageSrc} alt="branch-image" className='w-full h-full object-cover'/>
                            </div>
                        )}
                    </div>


                    <div className='flex flex-col w-full gap-[1rem]'>
                        <div className='flex flex-col gap-2'>
                            <span className='text-[16px] font-bold'>Basic Information</span>

                            <div className='flex flex-col items-start w-full gap-1'>
                                <span className='text-[14px] opacity-75'>Name</span>
                                <input type="text" placeholder='Enter the name of the branch here' value={branchName} onChange={(e) => setBranchName(e.target.value)} className='w-full p-[1rem] rounded-[10px] bg-[#1D242B]/10 border border-[#1D242B]/25 hover:border-[#1D242B]/50 focus:outline-none focus:border-[#0077C0]' />
                            </div>

                            <div className='flex flex-col items-start w-full gap-1'>
                                <span className='text-[14px] opacity-75'>Address</span>
                                <input type="text" placeholder='Enter the name of the branch here' value={branchAddress} onChange={(e) => setBranchAddress(e.target.value)} className='w-full p-[1rem] rounded-[10px] bg-[#1D242B]/10 border border-[#1D242B]/25 hover:border-[#1D242B]/50 focus:outline-none focus:border-[#0077C0]' />
                            </div>
                        </div>

                        <div className='flex flex-col items-start w-full gap-2'>
                            <span className='text-[16px] font-bold'>Landmarks</span>

                            <div className='flex flex-col w-full gap-2'>
                                {landmarks.length > 0 && (
                                    landmarks.map((item, index) => (
                                        <div key={index} className='flex items-center gap-2 rounded-[10px] bg-[#1D242B]/10 border border-[#1D242B]/25 hover:border-[#1D242B]/50 '>
                                            <input type="text" placeholder='Enter a landmark here' value={item.landmark} onChange={(e) => handleLandmarkChange(index, e.target.value)}
                                            className='w-full p-[0.5rem] focus:outline-none' />

                                            <button onClick={() => handleDeleteLandmark(index)} className='opacity-50 hover:opacity-100 active:opacity-50 p-2 cursor-pointer' title='Delete'>
                                                <Delete className="w-[25px] h-[25px] stroke-[#1D242B] stroke-2" />
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
                            <span className='text-[16px] font-bold'>Property Manager</span>
                            <select name="property_manager" id="property_manager" value={selectedPropertyManager} onChange={(e) => setSelectedPropertyManager(Number(e.target.value))} className='w-full p-[1rem] rounded-[10px] bg-[#1D242B]/10 border border-[#1D242B]/25 hover:border-[#1D242B]/50 focus:outline-none focus:border-[#0077C0]'>
                                {propertyManagers.map(pm => (
                                    <option key={pm.id} value={pm.id}>{pm.fullname}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>


                {/* 
                    Add a state later if details are changed 
                    Display this button if changes were made
                */}
                <div className='flex items-center justify-end w-full gap-1'>
                    {DataChanges && (
                        <button onClick={() => handleBranchChange(branch.id)} className='bg-[#0077C0] text-[#FAFAFA] font-bold rounded-[10px] p-2 px-4 cursor-pointer hover:bg-[#0077C0]/90 active:bg-[#0077C0]'>Save</button>
                    )}  
                    <button onClick={isModalOpen} className='bg-[#1D242B]/15 text-[#1D242B] font-bold rounded-[10px] p-2 cursor-pointer hover:bg-[#1D242B]/30 active:bg-[#FAFAFA]'>Cancel</button>
                </div>
            </div>
        </div>
    )
} 