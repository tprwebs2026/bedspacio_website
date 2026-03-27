"use client"

import Quote from '@/asset/icon/quote.svg'
import Star from '@/asset/icon/star.svg'
import ReviewData from '@/data/reviews.json';
import Arrow from '@/asset/icon/circle-arrow.svg'

import { useState, useRef } from 'react';

export default function Reviews () {

    const [currentIndex, setIndex] = useState<number>(0)
    const containerRef = useRef<HTMLDivElement>(null)

    const Reviews = [...ReviewData, ...ReviewData]


    const moveLeft = () => {
        setIndex(prev =>  prev === 0 ? Reviews.length - 1 : prev - 1)
        console.log('sdas')
    }

    const moveRight = () => {
        setIndex(ind => ind === Reviews.length - 1 ? 0 : ind + 1)
        console.log('adasds')
    }

    

    return (
        <section className="relative flex flex-col xl:items-center lg:items-center md:items-center w-full bg-[#C7EEFF] py-12 md:py-16 p-3 gap-5">
            <span className="flex text-center text-[32px] md:text-[46px] font-[900] text-[#0077C0] leading-[1]">
                What Our Customers Say
            </span>

            {/* <div className='absolute inset-0 block w-full h-auto bg-blend-soft-light'>
                <img src="/image/pattern.png" alt="pattern" className='w-full h-full object-cover'/>
            </div> */}

            <div className="flex flex-col xl:items-start lg:items-start md:items-start gap-[2rem] w-auto xl:w-[1450px] oveflow-x-scroll overflow-hidden rounded-[10px]">

                {/* Mobile: horizontal scroll | Desktop: grid */}
                <div ref={containerRef} className={`flex flex-row items-start gap-2 pb-2 rounded-[10px] transition-all oveflow-x-scroll duration-300 rounded-[10px]`}
                style={{
                    transform: `translateX(-${(currentIndex * 478 + (8 * currentIndex))}px)`
                }}
                >
                    {/* <div className='flex xl:w-[450px] lg:w-[450px] sm:w-[420px]  min-h-[320px]'/> */}

                    {/* Center Card */}
                    {Reviews.map((review, index) => (
                        <div key={index} className={`xl:w-[478px] lg:w-[478px] sm:w-[420px] flex flex-col items-start justify-between min-h-[320px] bg-[#FAFAFA] p-[2rem] rounded-[10px] gap-4`}>
                            <div className="flex w-full items-center justify-between">
                                <Quote className="w-[28px] h-auto" />
                                <Quote className="w-[28px] h-auto -rotate-180" />
                            </div>

                            <p className="w-full px-2 leading-relaxed text-center text-[#1D242B] text-base italic">{review.message}</p>

                            <div className="flex flex-col items-center justify-center gap-2 w-full">
                                <span className="font-bold text-[#1D242B] text-lg">{review.name}</span>
                                <div className="flex items-center justify-center gap-1">
                                    <Star className="w-[18px] h-auto" />
                                    <Star className="w-[18px] h-auto" />
                                    <Star className="w-[18px] h-auto" />
                                    <Star className="w-[18px] h-auto" />
                                    <Star className="w-[18px] h-auto" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className='flex w-full items-center justify-center gap-4'>
                <button onClick={moveLeft} className={`cursor-pointer active:scale-95 transition-all duration-100`}>
                    <Arrow className="w-[40px] h-[40px] -rotate-180" />
                </button>

                <button onClick={moveRight} className={`cursor-pointer active:scale-95 transition-all duration-100`}>
                    <Arrow className="w-[40px] h-[40px]" />
                </button>
            </div>
        </section>
    )
}