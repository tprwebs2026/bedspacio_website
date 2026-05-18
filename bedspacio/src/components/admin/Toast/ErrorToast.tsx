
import { useState } from "react";
import Warning from '@/asset/icon/warning.svg'

interface ToastProp {
    message: string;
    // onClose: () => void;
}

export default function ErrorToast ({ message }: ToastProp) {
    const [entered, setEntered] = useState(false);

    // trigger after first paint
    if (!entered) {
        requestAnimationFrame(() => setEntered(true));
    }

    return (
        <div
            className={`fixed bottom-4 right-4 flex items-center justify-between min-w-[300px] min-h-[50px] bg-[#FE210B] rounded-[10px] px-2 transform transition-transform duration-300 ease-out
            animate-slide-in`}
        >
            <div className='flex items-center gap-2 h-full'>
                <Warning className="w-[30px] h-full"/>
                <span className="text-[#1D242B] text-[16px] font-bold">{message}</span>
            </div>
        </div>
    )
}