import React from "react";
import { Analytics } from '@vercel/analytics/react';

const Layout = ({ children }) => {
  return (
    <>
      {children}
      <Analytics />
    </>
  );
};

export default Layout;
