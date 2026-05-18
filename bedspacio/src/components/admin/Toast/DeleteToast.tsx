import Delete from '@/asset/icon/delete.svg'

interface ToastProp {
    message: string;
}

export default function DeleteToast ({ message }: ToastProp) {

    return (
        <div
            className={`fixed bottom-4 right-4 flex items-center justify-between min-w-[300px] min-h-[50px] bg-[#ABADAC] rounded-[10px] px-2 transform transition-transform duration-300 ease-out
            animate-slide-in`}
        >
            <div className='flex items-center gap-2 h-full'>
                <Delete className="w-[30px] h-full stroke-[#1D242B] stroke-2"/>
                <span className="text-[#1D242B] text-[16px] font-bold">{message}</span>
            </div>
        </div>
    )
}
