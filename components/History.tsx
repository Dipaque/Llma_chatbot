"use client";
import React, { useEffect, useState } from 'react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
  import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"
  import Cookies from 'js-cookie';
import { useParams, useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { Trash2 } from 'lucide-react';
import  { StateContext } from './ContextProvider';
import { useContext } from "react"
import { cn } from '@/lib/utils';


const History = () => {

    const {isUpdated}:any = useContext(StateContext);
    const [history,setHistory] = useState<any[]>([]);
    const router = useRouter();
    const params = useParams();
    useEffect(()=>{
        const fetchHistory = async () => {
            await fetch(`/api/history?email=${Cookies.get("email")}`).then((res)=>{
                res.json().then((data)=>setHistory(data.data.map((obj:any)=>{
                    return {
                     title: obj.title,
                     id:obj.id

                    }
                })))
            })
        }
        fetchHistory();
        return () => {
            setHistory([]);
        }
    },[isUpdated])


  return (
    <div className=' '>
        <header className=" mt-5 ps-3 mb-5 font-bold  ">
          Recent
        </header>
    {
        history.map((history,i)=>{
          const isActive = params.id===history.id
          return (
            
                    <div key={i} className={cn("  text-sm flex gap-3 py-4 w-full ps-3 items-center   ",{"border-r-4 bg-blue-2 border-blue-1":isActive})} onClick={()=>router.push(`/home/${history.id}`)} >
                      <TooltipProvider   >
                 <Tooltip >
                <TooltipTrigger >
                      {history?.title.toString().length >= 30 ? history.title.slice(0, 30) + "..." : history?.title}      
                 </TooltipTrigger>
                 <TooltipContent className="p-3 bg-gray-800 w-[200px]" >
                   <p >{history?.title}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
               </div>
        )})
    }
    </div>
  )
}

export default History