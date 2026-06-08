"use client"

import { useState } from 'react';

import Add from '@/asset/icon/add.svg';
import InclusionItem from '@/components/admin/InclusionItem';
import CreateInclusionModal from './CreateInclusionModal';
import { getInclusions } from '../../../../lib/inclusion';

import SuccessToast from '@/components/admin/Toast/SuccessToast';
import DeleteToast from '@/components/admin/Toast/DeleteToast';

export type InclusionType = {
    id: number,
    inclusion: string
}

interface InclusionProp  {
    inclusions: InclusionType[];
}

export default function InclusionPageWrapper ({ inclusions: initialInclusion }: InclusionProp ) {

    const [allInclusions, setAllInclusions] = useState<InclusionType[]>(initialInclusion)
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const [deleteMessage, setDeleteMessage] = useState<string>('');

    const loadInclusions = async () => {
        const data = await getInclusions();

        setAllInclusions(data)
    }
    
    return (
        <>
            <div className="relative flex flex-col w-full h-auto">
                <div className="flex flex-col w-full px-[1rem] xl:px-[8rem] lg:px-[6rem] py-[1rem] gap-[2rem]">
                    <div className="flex items-center justify-between w-full">
                        <span className="text-[28px] text-[#1D242B] font-[900]">Inclusions</span>
                        <button onClick={() => setIsModalOpen(prev => !prev)} className="flex items-center justify-center rounded-[10px] bg-[#0077C0] p-2 cursor-pointer hover:bg-[#1D242B] active:bg-[#1D242B] xl:active:bg-[#0077C0] transition-all duration-100">
                            <Add className="w-[25px] h-auto stroke-[#FAFAFA]" />
                            <span className="text-[#FAFAFA] text-[16px] px-2">Create</span>
                        </button>
                    </div>

                    <div className='flex flex-col w-full gap-1'>
                        <div className='flex items-center justify-between w-full border-b border-b-[#1D242B]/25'>
                            <span>Name</span>
                            <span>Actions</span>
                        </div>

                        {allInclusions.length > 0 ? (
                            <div className='flex flex-col w-full gap-1 h-[500px] overflow-y-auto'>
                                {allInclusions.map((inc) => (
                                    <InclusionItem 
                                        key={inc.id}
                                        id={inc.id}
                                        inclusion={inc.inclusion} 
                                        onSuccess={loadInclusions}
                                        onMessage={(msg) => setDeleteMessage(msg)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className='flex w-full items-center justify-center h-[500px]'>
                                <span className='text-[18px] font-bold'>Nothing to show yet...</span>
                            </div>
                        )}
                    </div>

                </div>

                {/* MODAL */}
                {isModalOpen && (
                    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
                        <div className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
                            <CreateInclusionModal 
                                closeModal={() => setIsModalOpen(false)}
                                onSuccess={loadInclusions}
                                onMessage={(msg) => setMessage(msg)}
                            />
                        </div>
                    </div>
                )}
            </div>

            {message && ( <SuccessToast message={message} />)}  
            {deleteMessage && ( <DeleteToast message={deleteMessage} /> )}
        </>
    )
}