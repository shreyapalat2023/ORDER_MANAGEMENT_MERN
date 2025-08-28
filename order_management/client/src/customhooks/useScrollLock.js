import { useEffect } from "react";

export default function useScrollLock(lock = true) {
    useEffect(() => {
        if (lock) {
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [lock]);
}
