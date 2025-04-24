"use client";
import React, { useEffect, useState, useContext, useRef } from "react";
import Markdown from "react-markdown";
import cpu from "@/assets/Cpu.svg";
import Image from "next/image";
import { Copy, AudioLines, LucideCheckCircle, ChevronDown } from "lucide-react";
import { copyText, speakText } from "@/lib/utils";
import { StateContext } from "./ContextProvider";
import Cookies from "js-cookie";
import dynamic from "next/dynamic";
const ProfileImage = dynamic(() => import("./ProfileImage"), { ssr: false });
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useParams } from "next/navigation";
import PopConfirm from "./PopConfirm";
import ChatSkeleton from "./ChatSkeleton";
import { useToast } from "@/hooks/use-toast";
import Feedback from "./Feedback";

const Chats = () => {
  const {
    handleChatTitle,
    chats,
    setChats,
  }: any = useContext(StateContext);
  const { toast } = useToast();
  const params = useParams();
  const [showArrow, setShowArrow] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const el = scrollRef.current;
      if (!el) return;
  
      const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 1;
      setShowArrow(!atBottom);
    };
  
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', handleScroll);
      handleScroll(); // Initial check
    }
  
    return () => {
      if (el) el.removeEventListener('scroll', handleScroll);
    };
  }, [chats]);
  
  // Fetch chats
  useEffect(() => {
    const fethChats = async () => {
      const res = await fetch(`/api/addChat?id=${params.id}`, {
        method: "GET",
      });

      res
        .json()
        .then((data) => {
          setChats(data.data);
          if (data.title !== "New Chat" && data.title !== "") handleChatTitle();
        })
        .catch((err) => console.log(err));
    };

    fethChats();
    return () => {
      setChats([]);
    };
  }, []);

  // Typing animation for latest message
  // useEffect(() => {
  //   if (animatedIndex === null || !chats[chats.length - 1]) return;

  //   const fullMessage = chats[chats.length - 1].response;
  //   let index = 0;
   
  //   const interval = startTyping && setInterval(() => {
  //     setTypedMessage((prev) => prev + fullMessage.charAt(index));
  //     index++;
  //     if (index >= fullMessage.length){
  //       clearInterval(interval);
  //       setStartTyping(false);
    //       setAnimatedIndex(null);
  //     } 
  //   }, 1); // Typing speed

  //   return () => {
  //     clearInterval(interval);
  //     setStartTyping(false);
  //    }
  // }, [animatedIndex, chats,startTyping]);

  return (
    <div  ref={scrollRef} className="flex-grow-0 overflow-x-hidden remove-scrollbar overflow-y-scroll mt-5 lg:w-3/5 lg:mx-auto">
      {chats?.length > 0 ? (
        chats.map((chat: any, index: number) => {

          return (
            <React.Fragment key={index}>
              {/* USER MESSAGE */}
              <div className="chat chat-end w-auto">
                <div className="chat-image avatar hidden md:block">
                  <ProfileImage />
                </div>
                <div className="chat-bubble bg-blue-1 text-white lg:w-auto">
                  <Markdown className="text-[10px] sm:text-base">
                    {chat.query}
                  </Markdown>
                </div>
                <div className="chat-footer flex flex-row gap-3 items-center justify-start mt-3">
                  <AudioLines
                    onClick={() => speakText(chat.query)}
                    size={16}
                    className="text-black-1 cursor-pointer"
                  />
                  <Copy
                    onClick={() => {
                      copyText(chat.query);
                      toast({
                        title: "Copied!",
                        description: "The content copied to the clipboard!",
                      });
                    }}
                    size={16}
                    className="text-black-1 cursor-pointer"
                  />
                </div>
              </div>

              {/* BOT MESSAGE */}
              <div className="chat chat-start">
                <div className="chat-image avatar hidden md:block">
                  <div className="w-10 rounded-full bg-[#EEF2FF] p-2">
                    <Image src={cpu} height={10} width={10} alt="cpu" />
                  </div>
                </div>
                <div className="chat-bubble  bg-[#E2E8F0] text-black-1 p-3 w-4/5 lg:w-auto">
                  <Markdown
                    className="text-xs sm:text-base"
                    components={{
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
                    }}
                  >
                    {chat.response}
                  </Markdown>
                </div>

                <div className="chat-footer flex flex-row gap-3 items-center justify-start mt-3">
                  <AudioLines
                    onClick={() => speakText(chat.response)}
                    size={16}
                    className="text-black-1 cursor-pointer"
                  />
                  <Copy
                    onClick={() => {
                      copyText(chat.response);
                      toast({
                        description: (
                          <span className="flex items-center gap-2">
                            <LucideCheckCircle color="green" />
                            The content copied!
                          </span>
                        ),
                      });
                    }}
                    size={16}
                    className="text-black-1 cursor-pointer"
                  />
                  <Feedback
                    docId={params.id}
                    chat={chat}
                    chats={chats}
                    index={index}
                  />
                </div>
              </div>
            </React.Fragment>
          );
        })
      ) : (
        <p className="text-4xl font-bold text-center text-black-1 h-36">
          How can I help you today?
        </p>
      )}
     {showArrow && chats.length > 0 && (
  <div
    onClick={() =>
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
    className="fixed bottom-36 left-1/2 transform -translate-x-1/2 text-3xl bg-slate-500 opacity-75 rounded-full text-white  z-50 cursor-pointer"
  >
    <ChevronDown />
  </div>
)}


    </div>
  );
};

export default Chats;
