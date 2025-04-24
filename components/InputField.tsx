"use client";
import React, { useEffect, useState } from 'react'
import Groq from "groq-sdk";
import { SendHorizonal, Paperclip } from 'lucide-react';
import { CgSpinner } from "react-icons/cg";
import { Button } from './ui/button';
import { StateContext } from './ContextProvider';
import { useContext } from "react"
import { useParams } from 'next/navigation';
// import { tavily }  from '@tavily/core';

const InputField = () => {
  const [prompt, setPrompt] = useState("");
  const { handleIsUpdated, containsChatTitle, chats, isLoading, setIsLoading, generate, setGenerate, setChats, setStartTyping,animatedIndex, setAnimatedIndex }: any = useContext(StateContext);
  const groq = new Groq({ apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY, dangerouslyAllowBrowser: true });
  // const client = tavily({ apiKey: process.env.NEXT_PUBLIC_TAVILY_API_KEY });
  async function getGroqChatCompletion(alteredPrompt: string, contextChunks?: string) {
    const options = {
      method: 'POST',
      headers: {Authorization: 'Bearer '+process.env.NEXT_PUBLIC_TAVILY_API_KEY, 'Content-Type': 'application/json'},
      body: `{"query":"${prompt}","topic":"general","search_depth":"basic","chunks_per_source":3,"max_results":3,"time_range":null,"days":7,"include_answer":true,"include_raw_content":false,"include_images":false,"include_image_descriptions":false,"include_domains":[],"exclude_domains":[]}`
    };
    // Searching on web 
   const searchResults = await fetch('https://api.tavily.com/search', options)
      .then(response => response.json())
      .then(response =>{ return response})
      .catch(err => console.error(err));
    const results:{title:string,url:string,content:string}[] = searchResults.results.map((result:{title:string,url:string,content:string})=>`${result.title}\n\n${result.url}\n\n${result.content}`).join('\n\n')
    console.log(searchResults,results)
    return groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You're a helpful assistant named Chitti 2.0, powered by the lllama-3.3-70b-versatile model.${contextChunks && `Use the following context to answer the user's question accurately:\n\n ${contextChunks}`} And also use this following web search results returned by tavily to answer the user's question accurately:\n\n ${results} \n\n ${searchResults.answer}`,
        },
        {
          role: "user",
          content: alteredPrompt,
        },
      ],
      model: "llama-3.3-70b-versatile",

    });
  }

  const params = useParams();

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true)
    const conversationHistory = chats.length > 4
      ? chats.slice(-4) // Correctly extract the last two elements
      : chats; // Use the entire array if it has 2 or fewer elements

    const alteredPrompt = `Here is the conversation history:
${conversationHistory.map((chat: any) => `Query: ${chat.query}\nResponse: ${chat.response}`).join('\n')}
And the new query is: ${prompt}.`;

    if (prompt.length > 0) {
      const res = await fetch(`/api/qdrant?query=${prompt}`, {
        method: "GET",
      })
      const contextChunks = await res.json()
      let chatCompletion
      let vectorId = ""
      console.log("contextChunks", contextChunks)
      if (!contextChunks?.success || !contextChunks?.data) {
        chatCompletion = await getGroqChatCompletion(alteredPrompt);
        const res = await fetch("/api/qdrant", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: prompt,
            response: chatCompletion.choices[0]?.message.content
          })
        })
        const response = await res.json()
        vectorId = response.data

      } else {
        chatCompletion = await getGroqChatCompletion(alteredPrompt, contextChunks.data);
      }

      if (!containsChatTitle) {
        const titleResponse = await getGroqChatCompletion("Generate a one line title within 3 to 5 words for this prompt: " + prompt);
        const title = titleResponse.choices[0]?.message.content
        const response = await fetch(`/api/addChat`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: params.id, message: { query: prompt, response: chatCompletion.choices[0]?.message.content, timestamp: new Date().toISOString(), vectorId: vectorId }, title, })
        })
        const newMessage = {
          query: prompt,
          response: chatCompletion.choices[0]?.message.content,
          timestamp: new Date().toISOString(),
          vectorId: vectorId
        };
        
        const updatedChats = [...chats, newMessage];
        response.status === 200 && setChats(updatedChats);
        //  setChats([...chats, { query: prompt, response: chatCompletion.choices[0]?.message.content, timestamp: new Date().toISOString(), vectorId: vectorId }])
      setAnimatedIndex(updatedChats.length-1);
      } else {
        const response = await fetch("/api/addChat", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: params.id, message: { query: prompt, response: chatCompletion.choices[0]?.message.content, timestamp: new Date().toISOString(), vectorId: vectorId }, })
        })
        const newMessage = {
          query: prompt,
          response: chatCompletion.choices[0]?.message.content,
          timestamp: new Date().toISOString(),
          vectorId: vectorId
        };
        
        const updatedChats = [...chats, newMessage];
        response.status === 200 && setChats(updatedChats);
        //  setChats([...chats, { query: prompt, response: chatCompletion.choices[0]?.message.content, timestamp: new Date().toISOString(), vectorId: vectorId }])
      setAnimatedIndex(updatedChats.length-1);
      }
      setPrompt("");
      setIsLoading(false)
      setStartTyping(true);
    }
  }

  useEffect(() => {
    const triggerSend = async () => {
      if (!generate) return
      await send(new Event("submit") as React.FormEvent); // simulate form event
      setGenerate(false); // reset trigger
    };
    triggerSend();
  }, [generate])

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const textarea = e.target;
    textarea.style.height = "auto"; // Reset height
    textarea.style.height = `${textarea.scrollHeight}px`;
    setPrompt(e.target.value)
  }

  return (
    <form className=' mt-12 flex items-center justify-between sticky bottom-6   border-gray-100 border-2 drop-shadow-xl  focus:border-2 bg-white ps-3 p-3 rounded-full md:w-3/5 w-5/6  mb-12 mx-auto  '>
      <span className='flex items-center w-full'>
        <Paperclip size={18} className='text-gray-400 ms-3' />
        <textarea rows={1} onKeyDown={handleKeyDown} className='ms-3 focus:border-0 outline-none bg-white w-full resize-none' value={prompt} onChange={handleChange} placeholder=' Describe your prompt... ' />
      </span>

      <Button size={"icon"} type='submit' disabled={isLoading} color='#4F46E5' className='rounded-full bg-[#4F46E5] float-end h-10 w-10' onClick={(e) => send(e)}>
        {isLoading ? <CgSpinner className='animate-spin' /> : <SendHorizonal />
        }
      </Button>
    </form>

  )
}

export default InputField