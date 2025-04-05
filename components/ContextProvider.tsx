import React, { createContext, useState } from 'react';

export const StateContext = createContext({});


const ContextProvider = ({ children }:any) => {
  const [isUpdated, setIsUpdated] = useState(false); // Manage theme state
  const [containsChatTitle,setContainsTitle] = useState(false);
  const [chats,setChats] = useState<any[]>([]);
  const [isLoading,setIsLoading] = useState(true)
  const [generate,setGenerate] = useState(false);

  
  const handleIsUpdated = () => {
    setIsUpdated((prevState) => {
        return !prevState
    });
  };
  const handleChatTitle = () => {
    setContainsTitle((prevState) => {
        return true
    });
  };
  return (
    <StateContext.Provider value={{ isUpdated, handleIsUpdated, containsChatTitle,handleChatTitle,chats,setChats,isLoading,setIsLoading,generate,setGenerate }}>
      {children}
    </StateContext.Provider>
  );
};

export default ContextProvider;

