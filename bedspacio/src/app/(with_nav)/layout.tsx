"use client"

import Footer from "@/components/Footer"
import NavigationBar from "@/components/navigationBar"
import NavigationMobile from "@/components/NavigationMobile"

import Script from "next/script"
import { useState } from "react"

export default function WithNavigation({
    children,
}: {
    children: React.ReactNode
}) {

    const [toggleNav, setToggleNav] = useState<boolean>(false)

    return (
        <>  
            {/*
                Noted at 06-09-2026
                1. Chat button widget from GoHighLevel
                2. Uncomment this if GHL is integrated
             */}
            {/* <script 
                src="https://beta.leadconnectorhq.com/loader.js" 
                data-resources-url="https://beta.leadconnectorhq.com/chat-widget/loader.js" data-widget-id="6a1bc87f1b5a98ef9d7bcf2d">
            </script> */}


            
            {/* <Script id="kommo-widget" strategy="afterInteractive">
                {`
                    (function(a,m,o,c,r,m){
                        a[m]={
                            id:"1074637",
                            hash:"e089dbb3ae464d2c7673e0ea2cd73aa8935b935423e8eea9cd658ec47eac6f70",
                            locale:"en",
                            setMeta:function(p){
                                this.params=(this.params||[]).concat([p])
                            }
                        };

                        a[o]=a[o]||function(){
                            (a[o].q=a[o].q||[]).push(arguments)
                        };

                        var d=a.document,
                            s=d.createElement('script');

                        s.async=true;
                        s.id=m+'_script';
                        s.src='https://gso.kommo.com/js/button.js';

                        d.head && d.head.appendChild(s);

                    })(window,0,'crmPlugin',0,0,'crm_plugin');
                `}
            </Script> */}

            <div className="flex flex-col w-full min-h-screen">

                <NavigationBar
                    toggleMobileNav={() => setToggleNav(prev => !prev)}
                />

                {/* Overlay */}
                <div
                    onClick={() => setToggleNav(false)}
                    className={`fixed inset-0 xl:hidden lg:hidden z-30 transition-opacity duration-200
                    ${toggleNav ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
                    bg-black/40 backdrop-blur-sm`}
                />

                <div
                    className={`fixed inset-y-0 flex items-end justify-end w-full min-h-screen xl:hidden lg:hidden z-40 transition-transform duration-200 ease-out ${
                        toggleNav ? 'translate-x-0' : 'translate-x-full'
                    }`}
                >
                    <NavigationMobile
                        toggleNavigation={() => setToggleNav(prev => !prev)}
                    />
                </div>

                <main>
                    {children}
                </main>

                <Footer />
            </div>
        </>
    )
}


// "use client"

// import Footer from "@/components/Footer"
// import NavigationBar from "@/components/navigationBar"
// import NavigationMobile from "@/components/NavigationMobile"

// import Script from 'next/script';
// import { useState } from "react"

// export default function WithNavigation({ children }: { children: React.ReactNode }) {

//     const [toggleNav, setToggleNav] = useState<boolean>(false)

//     return (
//         <div className="flex flex-col w-full min-h-screen">

//             <NavigationBar toggleMobileNav={() => setToggleNav(prev => !prev)} />

//             {/* > Slides from left for mobile version
//                 > Only visible in mobile UI version
//             */}

//             {/* Overlay */}
//             <div
//                 onClick={() => setToggleNav(false)}
//                 className={`fixed inset-0 xl:hidden lg:hidden z-30 transition-opacity duration-200
//                 ${toggleNav ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
//                 bg-black/40 backdrop-blur-sm`}
//             />

//             <div className={`fixed inset-y-0 flex items-end justify-end w-full min-h-screen xl:hidden lg:hidden z-40 transition-transform duration-200 ease-out ${toggleNav ? 'translate-x-0' : 'translate-x-full'}`}>
//                 <NavigationMobile toggleNavigation={() => setToggleNav(prev => !prev)} />
//             </div>

//             <main className="flex-1 w-full">
//                 {children}
//             </main>

//             {/* 1. Set configuration settings onto the window global object before execution */}
//             <Script id="kommo-chat-config" strategy="beforeInteractive">
//                 {`
//                     window.crmPlugin = {
//                         id: "1074637",
//                         hash: "e089dbb3ae464d2c7673e0ea2cd73aa8935b935423e8eea9cd658ec47eac6f70",
//                         locale: "en",
//                         setMeta: function (p) {
//                             this.params = (this.params || []).concat([p]);
//                         }
//                     };
//                 `}
//             </Script>

//             {/* 2. Download and execute the actual Kommo visual widget layout module */}
//             <Script
//                 id="kommo-chat-widget"
//                 src="https://gso.kommo.com/js/button.js"
//                 strategy="afterInteractive"
//             />

//             <Footer />
//         </div>
//     )   
// }
