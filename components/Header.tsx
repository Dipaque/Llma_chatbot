"use client";
import React from 'react'
import Cookies from 'js-cookie'
import dynamic from "next/dynamic";
const ProfileImage  = dynamic(()=>import("./ProfileImage"),{ssr:false})
import { SidebarTrigger } from './ui/sidebar'

const Header = () => {
  const photoURL = Cookies.get("photoURL")
  return (
    <header className='flex flex-row items-center justify-between p-3 sticky top-0 h-16   z-20 gap-2 border-b px-4 bg-white'>

        <span className='font-bold text-xl'> <SidebarTrigger />Chitti 2.0</span>
        <div className="chat-image avatar">
   <ProfileImage />
  </div>
      </header>
  )
}

export default Header