"use client";
import React, { useEffect, useState } from 'react'
import Groq from "groq-sdk";
import { SendHorizonal, Paperclip } from 'lucide-react';
import { Button } from './ui/button';
import  { StateContext } from './ContextProvider';
import { useContext } from "react"
import { useParams } from 'next/navigation';

const InputField = () => {
  const [prompt, setPrompt] = useState("");
  const {handleIsUpdated,containsChatTitle,chats,isLoading,setIsLoading,generate,setGenerate}:any = useContext(StateContext);
  const groq = new Groq({ apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY, dangerouslyAllowBrowser: true });
  async function getGroqChatCompletion(prompt: string,contextChunks?:{query:string,response:string,timestamp:any}[]) {
    console.log(contextChunks)
    return groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:`You're a helpful assistant named Chitti 2.0, powered by the llama3-8b-8192 model.${ contextChunks && `Use the following context to answer the user's question accurately:\n\n ${contextChunks.map((chat)=>`Query:${chat.query}\n Response:${chat.response}`).join('\n')}`}`
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama3-8b-8192",

    });
  }

const params = useParams();

  async function send(e:React.FormEvent) {
    e.preventDefault();
    const conversationHistory = chats.length > 4 
  ? chats.slice(-4) // Correctly extract the last two elements
  : chats; // Use the entire array if it has 2 or fewer elements

const alteredPrompt = `Your name is Chitti  a helpful assistant. Here is the conversation history:
${conversationHistory.map((chat:any) => `Query: ${chat.query}\nResponse: ${chat.response}`).join('\n')}
And the new query is: ${prompt}.`;

if (prompt.length > 0) {
  const res = await fetch(`/api/qdrant?query=${prompt}`,{
    method:"GET",
  })
  const contextChunks = await res.json()
  let chatCompletion
  let vectorId = ""
  if(!contextChunks.status) {
    chatCompletion = await getGroqChatCompletion(alteredPrompt,conversationHistory);
    const res = await fetch("/api/qdrant",{
      method:"PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body:JSON.stringify( {
        query:prompt,
        response:chatCompletion.choices[0]?.message.content
      })
    })
    const response = await res.json()
    vectorId = response.data
    console.log(vectorId)
  }else{
    chatCompletion = await getGroqChatCompletion(alteredPrompt,contextChunks.data);
  }
   
      if(!containsChatTitle){
       const titleResponse = await getGroqChatCompletion("Generate a one line title within 3 to 5 words for this prompt: "+prompt);
      const title = titleResponse.choices[0]?.message.content
       const response = await fetch(`/api/addChat`,{
          method:"PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body:JSON.stringify({id:params.id, message:{query: prompt ,response: chatCompletion.choices[0]?.message.content,timestamp:new Date().toISOString(),vectorId:vectorId},title,})
        })
      }else{
        const response = await fetch("/api/addChat",{
          method:"PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body:JSON.stringify({id:params.id, message:{query: prompt ,response: chatCompletion.choices[0]?.message.content,timestamp:new Date().toISOString(),vectorId:vectorId},})
        })
      }
      setPrompt("");
      setIsLoading(true)
      handleIsUpdated()
    } 
  }

  useEffect(()=>{
    const triggerSend = async () => {
      if(!generate) return
      await send(new Event("submit") as React.FormEvent); // simulate form event
      setGenerate(false); // reset trigger
    };
    triggerSend();
  },[generate])

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      if (event.shiftKey) {
        // Allow new line with Shift + Enter
        event.preventDefault();
        setPrompt((prev) => prev + "\n");
      } else {
        // Trigger form submission on Enter
        event.preventDefault();
        send(event);
      }
    }
  };
  return (
    <form className=' mt-12 flex items-center justify-between sticky bottom-6   border-gray-100 border-2 drop-shadow-xl  focus:border-2 bg-white ps-3 p-3 rounded-full md:w-3/5 w-5/6  mb-12 mx-auto  '>
      <span className='flex items-center w-full'>
        <Paperclip size={18} className='text-gray-400 ms-3' />
        <textarea onKeyDown={handleKeyDown}   className='ms-3 focus:border-0 outline-none bg-white w-full h-8 ' value={prompt} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPrompt(e.target.value)} placeholder=' Describe your prompt... ' />
      </span>

      <Button size={"icon"} type='submit' disabled={isLoading} color='#4F46E5' className='rounded-full bg-[#4F46E5] float-end h-10 w-10' onClick={(e) => send(e)}>
        <SendHorizonal />
      </Button>
    </form>

  )
}

export default InputField