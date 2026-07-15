"use client";

import { useState } from "react";
import MobileNav from "./MobileNav"
import Nav from "./Nav"

const ResponsiveNav = () => {
const [open, setOpen] = useState(false);
  return (
    <div>
        <Nav open={open} setOpen={setOpen}/>
        <MobileNav open={open} setOpen={setOpen}/>
    </div>
  )
}

export default ResponsiveNav