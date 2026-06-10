// "use client"

// import { useState } from 'react'
// import Arrow from '@/asset/icon/arrow-right.svg'
// import FullScreen from '@/asset/icon/full-screen.svg'

// // Prod/Dev
// import { ODOO_BASE_URL } from '@/config/config'


// import ImageFullView from './ImageFullView'

// export type RoomImage = {
//     id: number,
//     url: string
// }

// export type RoomImageProp = {
//     images: RoomImage[]
// }

// export default function RoomImages ({ images }: RoomImageProp) {
//     const [selectedIndex, setSelectedIndex] = useState<number>(0);
//     const [fullViewOpen, setFullViewOpen] = useState<Boolean>(false);

//     const imageArray = images.map((image) => { return image.id })
//     const selectedImage = imageArray[selectedIndex];

//     console.log('Selected image: ', selectedImage);

//     const displayImage = (image: number) => {
//         const index = imageArray.indexOf(image);
//         setSelectedIndex(index);
//     }

//     const imagesLength = images.length; 

//     const toggleImageLeft = () => {
//         setSelectedIndex((prev) => 
//             prev === 0 ? imageArray.length - 1 : prev - 1
//         );
//     }
//     const toggleImageRight = () => {
//         setSelectedIndex((prev) => 
//             (prev + 1) % imageArray.length
//         );
//     }

//     console.log('Image details from roomImage: ', images );
//     console.log('Number of image', imagesLength);


//     return (
//         <>
//             <div className="grid grid-rows-[80%_20%] w-full h-[550px] gap-1">
//                 <div className="relative flex items-start justify-start w-full h-full overflow-hidden cursor-pointer">
//                     <button onClick={() => setFullViewOpen(prev => !prev)} title='Full Screen' className='hidden xl:flex lg:flex absolute bottom-2 right-2 cursor-pointer'>
//                         <FullScreen className="w-[20px] h-[20px] hover:scale-110 active:scale-100 transition-all duration-100"/>
//                     </button>

//                     {images.length > 1 && (
//                         <div className="xl:hidden lg:hidden absolute  flex items-center justify-between w-full h-full px-2">
//                             <button onClick={toggleImageLeft}  className="bg-[#FAFAFA] rounded-full cursor-pointer active:bg-[#0077C0] active:scale-95 transition-all duration-100">
//                                 <Arrow className="w-[40px] h-[40px] -rotate-180" />
//                             </button>

//                             <button onClick={toggleImageRight} className="bg-[#FAFAFA] rounded-full cursor-pointer active:bg-[#0077C0] active:scale-95 transition-all duration-100">
//                                 <Arrow className="w-[40px] h-[40px]" />
//                             </button>
//                         </div>
//                     )}

//                     <img onClick={() => setFullViewOpen(prev => !prev)}
//                         src={`${ODOO_BASE_URL}/web/image/bedspacio.room.image/${selectedImage}/image?width=1920`}
//                         alt="sample"
//                         className="w-full h-full object-cover rounded-[10px]"
//                     />
//                 </div>

//                 <div className="flex items-center w-full gap-1 overflow-x-scroll xl:overflow-x-auto overflow-y-hidden">
//                     {images.map((img) => (
//                         <button
//                             onClick={() => displayImage(img.id)}
//                             key={img.id}
//                             className={`relative shrink-0 w-20 h-20 cursor-pointer hover:border-2 hover:border-[#1D242B] active:border-[#0077C0] rounded-[10px] overflow-hidden ${selectedImage === img.id && 'opacity-100 border-2 border-[#0077C0]'}`}
//                         >
//                             <img
//                                 // src={`data:image/webp;base64,${img.image}`}
//                                 src={`${ODOO_BASE_URL}${img.url}`}
//                                 alt="sample"
//                                 className={`w-full h-full object-cover opacity-50 active:opacity-100 ${selectedImage === img.id && 'opacity-100'}`}
//                             />
//                         </button>
//                     ))}
//                 </div>
//             </div>

//             <div className='hidden xl:flex lg:flex'>
//                 {fullViewOpen && (
//                     <ImageFullView 
//                         selectedImage={`${ODOO_BASE_URL}/web/image/bedspacio.room.image/${selectedImage}/image?width=1920`} 
//                         totalImage = {imagesLength}
//                         onClose={() => setFullViewOpen(prev => !prev)}
//                         viewLeft={toggleImageLeft}
//                         viewRight={toggleImageRight}
//                     />
//                 )}
//             </div>
//         </>
//     )
// }


// ------------------ POSTGRES ------------------ //


"use client"

import { useState } from 'react'
import Arrow from '@/asset/icon/arrow-right.svg'
import FullScreen from '@/asset/icon/full-screen.svg'

// Prod/Dev
import { BASE_URL } from '@/config/config'
import Image from 'next/image'

import ImageFullView from './ImageFullView'

export type RoomImage = {
    id: number,
    image: string
}

export type RoomImageProp = {
    images: RoomImage[]
}

export default function RoomImages ({ images }: RoomImageProp) {
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const [fullViewOpen, setFullViewOpen] = useState<Boolean>(false);

    const selectedImage = images[selectedIndex];

    const imagesLength = images.length; 

    const toggleImageLeft = () => {
        setSelectedIndex((prev) => 
            prev === 0 ? images.length - 1 : prev - 1
        );
    }
    const toggleImageRight = () => {
        setSelectedIndex((prev) => 
            (prev + 1) % images.length
        );
    }


    return (
        <>
            <div className="grid grid-rows-[80%_20%] w-full h-[550px] gap-1">
                <div className="relative flex items-start justify-start w-full h-full overflow-hidden cursor-pointer">
                    <button onClick={() => setFullViewOpen(prev => !prev)} title='Full Screen' className='hidden xl:flex lg:flex absolute bottom-2 right-2 cursor-pointer'>
                        <FullScreen className="w-[20px] h-[20px] hover:scale-110 active:scale-100 transition-all duration-100"/>
                    </button>

                    {images.length > 1 && (
                        <div className="xl:hidden lg:hidden absolute  flex items-center justify-between w-full h-full px-2">
                            <button onClick={toggleImageLeft}  className="bg-[#FAFAFA] rounded-full cursor-pointer active:bg-[#0077C0] active:scale-95 transition-all duration-100">
                                <Arrow className="w-[40px] h-[40px] -rotate-180" />
                            </button>

                            <button onClick={toggleImageRight} className="bg-[#FAFAFA] rounded-full cursor-pointer active:bg-[#0077C0] active:scale-95 transition-all duration-100">
                                <Arrow className="w-[40px] h-[40px]" />
                            </button>
                        </div>
                    )}
                    

                    <img onClick={() => setFullViewOpen(prev => !prev)}
                        src={`${BASE_URL}/file/room/image/${selectedImage?.image}`}
                        alt="sample"
                        className="w-full h-full object-cover rounded-[10px]"
                    />
                </div>

                <div className="flex items-center w-full gap-1 overflow-x-scroll xl:overflow-x-auto overflow-y-hidden">
                    {images.map((img, index) => (
                        <button
                            onClick={() => setSelectedIndex(index)}
                            key={img.id}
                            className={`relative shrink-0 w-20 h-20 cursor-pointer hover:border-2 hover:border-[#1D242B] active:border-[#0077C0] rounded-[10px] overflow-hidden ${selectedIndex === index && 'opacity-100 border-2 border-[#0077C0]'}`}
                        >
                            <img
                                // src={`data:image/webp;base64,${img.image}`}
                                src={`${BASE_URL}/file/room/image/${img.image}`}
                                alt="sample"
                                className={`w-full h-full object-cover opacity-50 active:opacity-100 ${selectedIndex === index && 'opacity-100'}`}
                            />
                        </button>
                    ))}
                </div>
            </div>

            <div className='hidden xl:flex lg:flex'>
                {fullViewOpen && (
                    <ImageFullView 
                        selectedImage={`${BASE_URL}/file/room/image/${selectedImage?.image}`}
                        totalImage = {imagesLength}
                        onClose={() => setFullViewOpen(prev => !prev)}
                        viewLeft={toggleImageLeft}
                        viewRight={toggleImageRight}
                    />
                )}
            </div>
        </>
    )
}