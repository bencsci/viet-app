import React from "react";

const ScrollToTop = ({ children }) => {
  window.scrollTo(0, 0);
  return <div>{children}</div>;
};

export default ScrollToTop;
