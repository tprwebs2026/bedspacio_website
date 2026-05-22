"use client"

interface ConfirmModalProps {
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmWindow ({ title, message, onConfirm, onCancel }: ConfirmModalProps) {
    


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1D242B]/50">

            <div className="bg-[#FAFAFA] flex flex-col w-[500px] h-auto rounded-[15px] p-[2rem] gap-[1rem]">
                <div className="flex flex-col gap-2">
                    <span className="text-[22px] font-bold text-[#1D242B]">
                        {title}
                    </span>

                    <span className="text-[15px] text-[#1D242B]/80">
                        {message}
                    </span>
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-[10px] border border-[#1D242B]/20 hover:bg-[#1D242B]/10 cursor-pointer"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-[10px] bg-[#FE230A] text-white hover:opacity-90 cursor-pointer"
                    >
                        Proceed
                    </button>
                </div>
            </div>

        </div>
    )
}