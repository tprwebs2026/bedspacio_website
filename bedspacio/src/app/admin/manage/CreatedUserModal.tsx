"use client"

type Data = {
    message: string,
    username: string, 
    password: string
}

interface ModalProp {
    data: Data;
    closeModal: () => void;
}


export default function CreatedUserModal ({ data, closeModal }: ModalProp) {

    return (
        <div className="relative flex flex-col items-center bg-[#FAFAFA] p-[2rem] gap-[1rem] w-[400px] rounded-[15px]">

            <span className="text-[20px] text-[#007C00] font-bold">{data.message}</span>

            <div className="flex flex-col gap-1 w-full">
                <div className="flex items-center justify-between w-full py-2 border-b border-b-[#1D242B]/15">
                    <span>Username: </span>
                    <span className="text-[#1D242B] font-bold">{data.username}</span>
                </div>

                <div className="flex items-center justify-between w-full py-2 border-b border-b-[#1D242B]/15">
                    <span>Password (Temporary): </span>
                    <span className="text-[#1D242B] font-bold">{data.password}</span>
                </div>

                <span className="flex flex-col pt-4 text-[14px] leading-tight text-center">
                    <strong className="text-[#FFB40F]">IMPORTANT*</strong> 
                    <span className="opacity-75">You will only see this message once, please save the info displayed in this window before clicking "Done"</span> 
                </span>
            </div>

            <button onClick={closeModal}
                className="text-[#FAFAFA] text-[16px] font-bold bg-[#0077C0] rounded-[10px] w-full py-2 hover:bg-[#0077C0]/90 active:bg-[#0077C0] cursor-pointer"
            >
                Done
            </button>
        </div>
    )
}