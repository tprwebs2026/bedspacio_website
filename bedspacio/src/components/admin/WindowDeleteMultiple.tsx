"use client"

import { useState } from "react";


interface Props {
    count: number;
    ids: number[];
    onArchive: () => void;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function WindowDeleteMultiple ({ count, ids, onArchive, onConfirm, onCancel }: Props) {

    

    return (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 flex items-end justify-center pb-[2rem] transform transition-transform duration-300 ease-out
            animate-slide-up">
            <div className="flex min-w-[300px] items-center justify-between gap-[2rem] bg-[#FAFAFA] border-2 border-dashed border-[#1D242B]/50 p-2 rounded-[10px]">
                    <span className="whitespace-nowrap font-bold">Selected {count} item/s</span>

                    <div className="flex w-full items-center justify-end gap-1">
                        <button onClick={onConfirm} className="bg-[#FF0808]/75 hover:bg-[#8F0808]/75 active:bg-[#FF0808]/75 cursor-pointer rounded-[10px] py-1 px-2 font-bold">
                            <span className="text-[#FAFAFA] text-[14px]">Delete</span>
                        </button>
                        <button onClick={onArchive} className="bg-[#FF0808]/75 hover:bg-[#8F0808]/75 active:bg-[#FF0808]/75 cursor-pointer rounded-[10px] py-1 px-2 font-bold">
                            <span className="text-[#FAFAFA] text-[14px]">Archive</span>
                        </button>
                        <button onClick={onCancel} className="bg-[#1D242B]/25 hover:bg-[#1D242B]/50 active:bg-[#1D242B]/25 cursor-pointer rounded-[10px] py-1 px-2 font-bold">
                            <span className="text-[#1D242B] text-[14px]">Cancel</span>
                        </button>
                    </div>
            </div>
        </div>
    )
}