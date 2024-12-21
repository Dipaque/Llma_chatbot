import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'

const useCookieValue = (cookieName:string,defaultValue:any) => {
    const [cookie,setCookie] = useState(defaultValue);
    useEffect(()=>{
        const fetchCookie = Cookies.get(cookieName)|| defaultValue;
        setCookie(fetchCookie);
    },[cookieName,defaultValue]);
  return cookie
}

export default useCookieValue