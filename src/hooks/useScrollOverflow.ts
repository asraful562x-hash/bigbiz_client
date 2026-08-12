import { useState, useEffect, useCallback, RefObject } from 'react';

export function useScrollOverflow(ref: RefObject<HTMLElement | null>) {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    // Allow a small tolerance margin of 3px for rounding issues
    setCanScrollLeft(scrollLeft > 3);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 3);
  }, [ref]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Check initially
    checkScroll();

    // Listen to scroll and resize
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);

    const resizeObserver = new ResizeObserver(checkScroll);
    resizeObserver.observe(el);

    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
      resizeObserver.disconnect();
    };
  }, [ref, checkScroll]);

  return { canScrollLeft, canScrollRight, checkScroll };
}
