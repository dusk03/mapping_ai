import { useEffect, useRef } from "react";

function useAutoScroll(dependencies = []) {
  const scrollContentRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      if (scrollContentRef.current) {
        scrollContentRef.current.scrollTo({
          top: scrollContentRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    }, 300);

    setTimeout(() => {
      clearInterval(intervalRef.current);
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, dependencies);

  return scrollContentRef;
}

export default useAutoScroll;
