"use client"

import Link from "next/link"

export default function NonNavigationBar () {
    return (
        <div className="grid grid-cols-3 w-full h-[75px] bg-[#FAFAFA] box-border px-[1rem]">
                <Link href="/">
                    <img src="/asset/bedspacio_logo.jpg" alt="bedspacio-logo" className="w-[70px] h-auto"/>
                </Link>
        </div>
    )
}