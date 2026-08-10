import { useEffect } from "react";

export function useClickOutside(ref, handler) {
  useEffect(() => {
    function onPointerDown(event) {
      if (!ref.current || ref.current.contains(event.target)) return;
      handler(event);
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [ref, handler]);
}
