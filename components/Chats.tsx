"use client";
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Markdown from 'react-markdown'
import cpu from "@/assets/Cpu.svg"
import Image from 'next/image';
import { Copy,AudioLines, Trash2 } from 'lucide-react';
import { copyText, speakText } from '@/lib/utils';
import  { StateContext } from './ContextProvider';
import { useContext } from "react"
import Cookies from 'js-cookie';
import ProfileImage from './ProfileImage';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useParams } from 'next/navigation';
import PopConfirm from './PopConfirm';

const Chats = () => {

  const {isUpdated,handleIsUpdated,handleChatTitle}:any = useContext(StateContext);
  const photoURL = Cookies.get("photoURL")
  const [chats,setChats] = useState<any[]>([]);
  const params = useParams();
  useEffect(()=>{
    const fethChats = async() => {
      const res =  await fetch(`/api/addChat?id=${params.id}`,{
        method:"GET",
        
      })
      res.json().then((data)=>{setChats(data.data)
        if(data.title!=="New Chat" && data.title!=="") handleChatTitle();
      }).catch(err=>console.log(err))
    }
    fethChats();
    return ()=>{
      setChats([])
    }
  },[isUpdated])
  
  // const handleDelete = useCallback(async(index:number)=>{
  //    // Remove the chat at the specified index
  // const filteredChats = chats.filter((chat,i)=>i!==index);


  // // Create a new URLSearchParams object
  // const searchParams = new URLSearchParams({
  //   id: params.id,
  //   chats: JSON.stringify(filteredChats),
  // });

  // // Create a new URL with the encoded query string
  // const url = `/api/addChat?${searchParams.toString()}`;

  // await fetch(url, {
  //   method: 'DELETE',
  // })
  //   .then((res) => {
  //     if (res.ok) {
  //       console.log('Chat deleted successfully');
  //     } else {
  //       throw new Error(`Error: ${res.status}`);
  //     }
  //   })
  //   .catch((err) => {
  //     console.error('Error deleting chat:', err);
  //   });
  //   handleIsUpdated()
  // },[chats])



  return (
    <div className='flex-grow-0 overflow-x-hidden  overflow-y-scroll  mt-5 lg:w-3/5   lg:mx-auto '>
         {
      chats.length>0? chats.map((chat:any,index)=>(
       <React.Fragment key={index} >
        <div className='chat chat-end w-auto' >
        <div className="chat-image avatar hidden md:block">
        <ProfileImage />
  </div>
  <div className="chat-bubble bg-blue-1 text-white lg:w-auto">
  <Markdown className={" text-[10px] sm:text-base"}>
        {
       chat.query
        }
        </Markdown>
  </div>
  <div className='chat-footer flex flex-row gap-3 items-center justify-start mt-3 '>
    <AudioLines onClick={()=>speakText(chat.query)} size={16} className='text-black-1 cursor-pointer' />
    <Copy onClick={()=>copyText(chat.query)} size={16} className='text-black-1 cursor-pointer' />
      {/* <PopConfirm onOk={()=>handleDelete(index)}>
        <Trash2 size={16}  className='text-black-1 cursor-pointer' />
      </PopConfirm> */}
  </div> 

      </div>
          <div className='chat chat-start' >

<div className="chat-image avatar hidden md:block">
    <div className="w-10 rounded-full bg-[#EEF2FF] p-2">
      <Image src={cpu} height={10} width={10} alt='cpu' />
    </div>
  </div>
  <div className="chat-bubble bg-[#E2E8F0] text-black-1 p-3 w-4/5 lg:w-auto  ">
    <Markdown className={" text-xs  sm:text-base"} components={{
          code({ className, children, ...rest }) {
            const match = /language-(\w+)/.exec(className || "");
            return match ? (
              <SyntaxHighlighter
                PreTag="div"
                language={match[1]}
                style={dracula}
                {...rest}
              
              >

                {children}
              </SyntaxHighlighter>
            ) : (
              <code {...rest} className={className}>
                {children}
              </code>
            );
          },
        }}>
        {
       chat.response
        }
        </Markdown>
  </div>
  <div className='chat-footer flex flex-row gap-3 items-center justify-start mt-3 '>
    <AudioLines onClick={()=>speakText(chat.response)} size={16} className='text-black-1 cursor-pointer' />
    <Copy onClick={()=>copyText(chat.response)} size={16} className='text-black-1 cursor-pointer' />
    {/* <PopConfirm onOk={()=>handleDelete(index)}>
        <Trash2 size={16}  className='text-black-1 cursor-pointer' />
    </PopConfirm> */}
  </div>
            
          </div>
        
      </React.Fragment>
      )):
      <p className='text-4xl font-bold text-center text-black-1 '>
        How can I help you today?
        </p>
    }
    </div>
  )
}

export default Chats