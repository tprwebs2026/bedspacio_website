import Check from '@/asset/icon/check.svg'

interface ToastProp {
    message: string;
}

export default function SuccessToast ({ message }: ToastProp) {

    return (
        <div
            className={`fixed bottom-4 right-4 flex items-center justify-between min-w-[300px] min-h-[50px] bg-[#08CF2D] rounded-[10px] px-2 transform transition-transform duration-300 ease-out
            animate-slide-in`}
        >
            <div className='flex items-center h-full'>
                <Check className="w-[40px] h-full"/>
                <span className="text-[#1D242B] text-[16px] font-bold px-2">{message}</span>
            </div>
        </div>
    )
}