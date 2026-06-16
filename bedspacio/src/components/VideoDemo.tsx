"use server"

import { getYoutubeUrl } from "../../lib/content"

export default async function VideoDemo () {
    const video_url = await getYoutubeUrl();

    console.log('video_url details: ', video_url);
    
    return (
        <section  className={`flex w-full p-[1rem] py-[4rem] xl:h-[800px] lg:h-[800px] md:h-[800px] bg-[#FAFAFA] items-center justify-center `}>
            <div className="w-full max-w-5xl mx-auto rounded-[10px] overflow-hidden">
                <div className="aspect-video">
                    <iframe
                    className="w-full h-full"
                    src={video_url.asset_url}
                    title={video_url.asset_name}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    />
                </div>
            </div>
        </section>  
    )
}
