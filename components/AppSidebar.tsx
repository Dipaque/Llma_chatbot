"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"


import Image from "next/image"
import Logo from "@/assets/Logomark@2x.png"
import Home from "@/assets/home-02.svg"
import { useCallback, } from "react"
import {  LucideLogOut, LucidePlus, Trash2 } from "lucide-react"
import Cookies from "js-cookie"
import ProfileImage from "./ProfileImage"
import History from "./History"
import { useRouter } from "next/navigation"

export function AppSidebar() {

  const router = useRouter();
  
  const handleLogout = useCallback(() => {
    Cookies.remove("userName")
    Cookies.remove("email")
    Cookies.remove("photoURL")
    Cookies.remove("uid")
    router.push("/")
  }, [])

  const handleNewChat = async()=>{
     await fetch("/api/addChat",{
        method:"POST",
        headers: {
          "Content-Type": "application/json",
        },
        body:JSON.stringify({email:Cookies.get("email")})
      }).then((res)=>res.json()).then((data)=>router.push(`/home/${data.id}`)).catch(err=>console.log(err));
  }

  return (
    <Sidebar>
      <SidebarHeader className="flex flex-row items-center justify-start   border-b px-4" >
        <Image src={Logo} height={45} width={45} alt="logo" />
        <b className="text-[#000000] font-extrabold">Chitti 2.0</b>
      </SidebarHeader>
      <SidebarContent className="  mt-5  " >
        <SidebarGroup className="!p-0">
          <div className="flex gap-3 py-4 w-full ps-3 items-center bg-blue-2 border-r-4 border-blue-1">

            <Image src={Home} height={24} width={24} className="text-gray-400 text-center" alt="home" />
            <span className="font-bold">Home</span>
          </div>
          <button className="flex gap-3 py-4 w-full ps-3 items-center" onClick={handleNewChat}>
            <LucidePlus size={24} className="text-gray-400" />
          <span className="font-bold">New Chat</span>
          </button>
        <History />
        </SidebarGroup >
        
      </SidebarContent>
      <SidebarFooter className="flex flex-row items-center justify-start gap-2 p-3 border-t px-4">
        <Popover >
          <PopoverTrigger className="flex flex-row items-center  gap-2 ">
        <div className="chat-image avatar">
        <ProfileImage />
        </div>
        <span className="font-semibold">{Cookies.get("userName")}</span>
          </PopoverTrigger>
          <PopoverContent className="flex flex-row items-center justify-start gap-2 p-3 border-t px-4 w-64 rounded-lg " onClick={handleLogout}>
            <LucideLogOut size={18} className="text-gray-500" />
            <span className="text-sm text-gray-500">Log out</span>
          </PopoverContent>
        </Popover>
      </SidebarFooter>
    </Sidebar>
  )
}
