import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

/** Scroll window to top on every client-side route change. */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);

  return null;
};

export default ScrollToTop;
