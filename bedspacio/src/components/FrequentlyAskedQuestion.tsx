"use client"

import { useState } from "react"
import FrequentQuestions from '@/data/faq.json'

import Arrow from '@/asset/icon/arrow-down.svg'
import { spawn } from "child_process"

export default function FrequentlyAskedQuestions() {

    const [questionOpen, setQuestionOpen] = useState<number | null>(null)
    let count = 0;

    interface FaqType {
        id: number,
        question: string,
        answer: string | string []
    }


    return (
        <div className="flex flex-col w-full min-h-[800px] items-center justify-start py-[6rem] gap-[2rem] xl:gap-[4rem] lg:gap-[4rem] md:gap-[2rem] bg-[#FAFAFA]">
            <span className="text-center text-[36px] xl:text-[48px] lg:text-[48px] md:text-[48px] text-[#1D242B] font-[900]">FREQUENTLY ASKED QUESTIONS</span>

            <div className="flex flex-col items-center w-full px-[1rem] xl:px-[8rem] lg:px-[6rem] md:px-[4rem] justify-center">
                {FrequentQuestions.map((faq) => (
                    <div key={faq.id} className="flex flex-col items-center justify-start w-full h-auto border-b border-b-[#1D242B]">
                        <div className="flex items-center justify-between w-full py-[0.5rem]">
                            <span className="flex items-center text-[20px] xl:text-[24px] lg:text-[24px] font-bold">{faq.question}</span>

                            <button onClick={() => {setQuestionOpen(prev => (prev === faq.id ? null : faq.id))}} className="cursor-pointer rounded-full hover:bg-[#0077C0] active:bg-[#C7EEFF] transition-all duration-100">
                                <Arrow className={`w-[40px] h-auto ${questionOpen === faq.id ? '-rotate-0' : '-rotate-90'} transition-all duration-100`}/>
                            </button>
                        </div>

                        {questionOpen === faq.id && (
                            <div className={`flex flex-col items-start w-full py-[1rem] gap-2`}>
                                {typeof faq.answer === "string" ? (
                                    <span className="text-[18px] xl:text-[20px] lg:text-[20px] text-[#1D242B] leading-[1]">
                                        {faq.answer}
                                    </span>
                                ) : (
                                    faq.answer.map((ans, index) => (
                                        <div key={index} className="flex flex-col items-start justify-start w-full">
                                            <div className="flex items-start w-full">
                                                <span className="text-[18px] xl:text-[20px] lg:text-[20px] text-[#1D242B] pr-2 font-bold">{`${String.fromCharCode(96 + (index + 1))}.`}</span>
                                                <span className="text-[18px] xl:text-[20px] lg:text-[20px] text-[#1D242B]">
                                                    {ans}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                ))}

                
            </div>
        </div>
    )
}