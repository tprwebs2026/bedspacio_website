import Alert from '@/asset/icon/exclamation-mark.svg';

type Alert = {
    message: string
}

export default function AlertTaost ({ message }: Alert) {

    return (
        <div
            className={`fixed bottom-4 right-4 flex items-center justify-between min-w-[300px] min-h-[50px] bg-[#FFF554] rounded-[10px] px-2 transform transition-transform duration-300 ease-out
            animate-slide-in`}
        >
            <div className='flex items-center gap-2 h-full'>
                <Alert className="w-[25px] h-full"/>
                <span className="text-[#1D242B] text-[16px] font-bold">{message}</span>
            </div>
        </div>
    )
}