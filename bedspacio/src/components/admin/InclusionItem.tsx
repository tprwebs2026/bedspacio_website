"use client"

import { useState } from 'react';

import Edit from '@/asset/icon/edit.svg';
import Delete from '@/asset/icon/delete.svg'
import Save from '@/asset/icon/save.svg'
import Cancel from '@/asset/icon/cancel.svg'

import { deleteInclusion, updateInclusion } from '../../../lib/inclusion';

import ErrorToast from './Toast/ErrorToast';
import SuccessToast from './Toast/SuccessToast';
import DeleteToast from './Toast/DeleteToast';

interface InclusionProps {
    id: number;
    inclusion:string;
    onSuccess: () => void;
    onMessage: (msg: string) => void;
}

export default function InclusionItem ({id,  inclusion, onSuccess, onMessage }: InclusionProps) {

    const [newInclusion, setNewInclusion] = useState<string>(inclusion);
    const [renameVisible, setRenameVisible] = useState<boolean>(false);

    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');


    const handleSave = async (id: number, value: string) => {
        // Save changes after renaming inclusion name       
        if (inclusion.trim() === value.trim()) {
            setError(`No changes made`);
            
            // Clear the error after 1500ms (4 seconds)
            setTimeout(() =>  setError(''), 4000);

            setRenameVisible(false);
            return;
        }

        try {
            const updatedInclusion = await updateInclusion(id, value);
            console.log('Updated: ', updatedInclusion);
            onSuccess();
            setSuccess(`Update successful!`)


            setRenameVisible(false);
            setTimeout(() => setSuccess(''), 4000); // message disappears after 4 second

        } catch (err) {
            setError("Failed to update");
            setTimeout(() => setError(''), 4000);
        }
    };


    // TODO: Lift the message to the parent so its good
    const handleDelete = async (id: number) => {
        const confirmed = window.confirm('Are you sure you want to delete this item?');
        if (!confirmed) return;

        // Delete inclusion, super straight-forward\
        await deleteInclusion(id);

        onMessage('Delete successfull');
        onSuccess();

        setTimeout(() => onMessage(''), 4000);
    }

    return (
        <>
            <div className='group flex items-center justify-between w-full p-2 bg-[#C7EEFF] rounded-[5px] px-[1rem] gap-4'>
                <div className='flex items-center gap-2 w-full'>
                    {renameVisible ? (
                        <input type="text" value={newInclusion} onChange={(e) => setNewInclusion(e.target.value)} className='border border-[#1D242B]/25 p-1 bg-[#FAFAFA] rounded-[5px] focus:outline-none focus:border-[#1D242B] w-full'/> 
                    ) : (
                        <div className='flex items-center gap-2'>
                            <span className='text-[#1D242B] font-bold'>{inclusion}</span>
                        </div>
                    )}
                </div>

                <div className='invisible opacity-0 group-hover:opacity-100 group-hover:visible flex items-center gap-1'>
                    {!renameVisible ? (
                        <div className='flex items-center gap-1'>
                            <button onClick={() => setRenameVisible(true)} className='flex items-center justify-center cursor-pointer size-9 rounded-[15px] hover:bg-[#0077C0]/50 active:bg-[#C7EEFF]' title="Rename">
                                <Edit className="w-[22px] h-[22px]" />
                            </button>

                            <button onClick={() => handleDelete(id)} className='flex items-center justify-center cursor-pointer size-9 rounded-[15px] hover:bg-[#0077C0]/50 active:bg-[#C7EEFF]' title="Delete">
                                <Delete className="w-[22px] h-[22px] stroke-[#1D242B] stroke-2" />
                            </button>
                        </div>
                    ) : (
                        <div className='flex items-center gap-1'>
                            <button onClick={() => handleSave(id, newInclusion)} className='flex items-center justify-center cursor-pointer size-9 rounded-[15px] hover:bg-[#0077C0]/50 active:bg-[#C7EEFF]' title="Save changes">
                                <Save className="w-[22px] h-[22px]" />
                            </button>

                            <button onClick={() => setRenameVisible(false)} className='flex items-center justify-center cursor-pointer size-9 rounded-[15px] hover:bg-[#0077C0]/50 active:bg-[#C7EEFF]' title="Cancel rename">
                                <Cancel className="w-[15px] h-[15px]" />
                            </button>
                        </div>
                    )}
                </div>
            </div> 

            {error && <ErrorToast message={error} /> }
            {success && <SuccessToast  message={success} /> }
        </>
    )
}