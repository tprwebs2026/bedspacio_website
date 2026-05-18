"use client"

import Add from '@/asset/icon/add.svg';

import { useEffect, useState } from 'react';
import BranchCardWrapper from './BranchCardWrapper';
import CreateBranchModal from './CreateBranchModal';
import BranchViewModal from './BranchViewModal';

import { getPropertyManagers } from '../../../../lib/user';
import { getAllBranches, getBranch, deleteBranch } from '../../../../lib/branch';

import { Manager } from './CreateBranchModal';
import ErrorToast from '@/components/admin/Toast/ErrorToast';
import SuccessToast from '@/components/admin/Toast/SuccessToast';
import DeleteToast from '@/components/admin/Toast/DeleteToast';
import AlertTaost from '@/components/admin/Toast/AlertToast';

type Landmark = {
    id: number,
    landmark: string
}


export type branchType = {
    id: number,
    branch_name: string,
    address: string,
    property_manager: string,
    property_manager_id: number,
    landmarks: Landmark[],
    image: string
}


export type branchProp = {
    branches: branchType[];
}



export default function BranchPageWrapper ({ branches: initialBranches }: branchProp) {

    const [ isModalOpen, setIsModalOpen ] = useState<boolean>(false);
    const [ isViewModalOpen, setIsViewModalOpen ] = useState<boolean>(false);
    const [ propertyManager, setPropertyManager ] = useState<Manager[]>([]);
    const [ branches, setBranches ] = useState<branchType[]>(initialBranches);
    const [ selectedBranch, setSelectedBranch ] = useState<branchType | null>(null)

    const [message, setMessage] = useState<string>('');
    const [errorsMessage, setErrorMessage] = useState<string>('');
    const [deleteMessage, setDeleteMessage] = useState<string>('');
    const [alertMessage, setAlertMessage] = useState<string>('');

    const loadPropertyManagers = async () => {
        const pm = await getPropertyManagers();
        setPropertyManager(pm);
    }

    const loadAllBranch = async () => {
        const updatedBranches = await getAllBranches();
        setBranches(updatedBranches)
    }

    const viewBranch = async (branch: branchType) => {
        try {
            const data = await getBranch(branch.id);
            setSelectedBranch(data);

            await loadPropertyManagers();
            setIsViewModalOpen(true);
        } catch (err) {
            setErrorMessage('Failed to view branch');
        }
    }

    const handleDeleteBranch = async (branch: branchType) => {
        const branchToDelete = await deleteBranch(branch.id);
        
        setIsViewModalOpen(false);
        setDeleteMessage(`Deleted ${branch.branch_name} successfully!`);
        loadAllBranch();
        
        setTimeout(() => setDeleteMessage(''), 4000)
        console.log('Deleted Branch: ', branchToDelete);
    }



    return (
        <>
            <div className="flex w-full min-h-screen">
                <div className="flex flex-col w-full h-auto px-[8rem] py-[1rem] gap-[2rem]">
                    
                    <div className="flex items-center justify-between w-full">
                        <span className="text-[28px] text-[#1D242B] font-bold">Branch</span>

                        <button onClick={() => {setIsModalOpen(true); loadPropertyManagers();}} className="flex items-center justify-center rounded-[10px] bg-[#0077C0] p-2 cursor-pointer hover:bg-[#1D242B] active:bg-[#1D242B] xl:active:bg-[#0077C0] transition-all duration-100">
                            <Add className="w-[25px] h-auto stroke-[#FAFAFA]" />
                            <span className="text-[#FAFAFA] text-[16px] px-2">Create</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-5 w-full gap-2">
                        {/* Block */}
                        {branches.map((branch: branchType) => (
                            <BranchCardWrapper 
                                key={branch.id}
                                viewModal={() => viewBranch(branch)} 
                                branchData={branch}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-10'>
                        <CreateBranchModal 
                            propertyManager={propertyManager}
                            isModalOpen={() =>  setIsModalOpen(false)}
                            onSuccess={loadAllBranch}
                            toastMessage={(msg) => setMessage(msg)}
                            alertMessage={(msg) => setAlertMessage(msg)}
                        />
                </div>
            )}

            {isViewModalOpen && selectedBranch && (
                <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
                    <div className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
                        < BranchViewModal
                            propertyManagers={propertyManager}
                            branch={selectedBranch}
                            isModalOpen={() => {
                                setIsViewModalOpen(false);
                                setSelectedBranch(null);
                            }}
                            onDeleteBranch={() => handleDeleteBranch(selectedBranch)}
                            onSuccess={loadAllBranch}
                            setSuccessMessage={(msg) => setMessage(msg)}
                        />
                    </div>
                </div>
            )}

            <div className='fixed inset 0 z-50'>
                {message && <SuccessToast message={message} />}
                {errorsMessage && <ErrorToast message={errorsMessage} />}
                {alertMessage && <AlertTaost message={alertMessage} />}
                {deleteMessage && <DeleteToast message={deleteMessage} />}
            </div>
        </>
    )
}