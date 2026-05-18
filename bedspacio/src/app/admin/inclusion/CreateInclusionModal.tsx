
import Close from '@/asset/icon/cancel.svg'
import { createInclusion } from '../../../../lib/inclusion';
import { useState } from 'react';


interface InclusionProps {
    closeModal: () => void;
    onSuccess: () => void;
    onMessage: (msg: string) => void;
}

export default function CreateInclusionModal ({ closeModal, onSuccess, onMessage }: InclusionProps) {

    const [inclusion, setInclusion] = useState<string>('');

    const handleCreateInclusion = async (value: string) => {
        await createInclusion(value);

        onMessage(`'${value}' created!`);

        onSuccess();
        closeModal();
        setTimeout(() => onMessage(''), 4000)
    }


    return (
        <div className="relative flex flex-col w-[500px] h-auto bg-[#FAFAFA] rounded-[10px] border-2 border-[#1D242B]/50 p-[2rem] gap-[1rem]">
            <button onClick={closeModal} className="absolute top-4 right-4 cursor-pointer rounded-full p-2 hover:bg-[#1D242B]/15 active:bg-[#FAFAFA]">
                <Close className="w-[15px] h-[15px]" />
            </button>
            
            <span className='text-[28px] text-[#1D242B] font-bold leading-[1]'>Create Inclusion</span>

            <div className='flex flex-col items-start w-full gap-2'>
                <span className='text-[16px] text-[#1D242B]'>Name</span>    
                <input type="text" placeholder='Enter the name of inclusion here...' 
                value={inclusion} onChange={(e) => setInclusion(e.target.value)} className='w-full p-[1rem] rounded-[10px] bg-[#1D242B]/10 border border-[#1D242B]/25 hover:border-[#1D242B]/50 focus:outline-none focus:border-[#0077C0]'/>
            </div>

            <button onClick={() => handleCreateInclusion(inclusion)} className='w-full bg-[#0077C0] text-[#FAFAFA] font-bold rounded-[10px] py-[1rem] cursor-pointer hover:bg-[#0077C0]/90 active:bg-[#0077C0]'>Continue</button>
        </div>
    ) 
}