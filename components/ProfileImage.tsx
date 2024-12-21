"use client";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import useCookieValue from "./useCookieValue";

const ProfileImage = () => {
  const [isClient, setIsClient] = useState(false);
 

  const photoURL = useCookieValue("photoURL","");
  const userName = useCookieValue("userName","");

  useEffect(() => {
    // Mark that we are running in the client
    setIsClient(true);
  
  }, []);

  if (!isClient) {
    // Avoid rendering on the server to prevent mismatches
    return null;
  }

  return (
    <div className="w-10 rounded-full">
      {photoURL ? (
        <img alt="Profile" height={45} width={45} src={photoURL} />
      ) : (
        <div className="flex items-center justify-center bg-blue-2 text-blue-1">
          {userName ? userName?.charAt(0).toUpperCase():""}
        </div>
      )}
    </div>
  );
};

export default ProfileImage;
