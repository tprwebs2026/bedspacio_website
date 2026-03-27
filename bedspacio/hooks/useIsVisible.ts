import { useEffect, useState, RefObject } from "react";

export default function useIsVisible<T extends HTMLElement>(
    ref: RefObject<T | null>
    ) {

    const [isIntersecting, setIsIntersecting] = useState(false);

    useEffect(() => {
        if (!ref.current) return; 

        const observer = new IntersectionObserver(([entry]) => {
            setIsIntersecting(entry.isIntersecting);
        });

        observer.observe(ref.current);
        return () => { observer.disconnect(); };

    }, [ref]);

    return isIntersecting;
}