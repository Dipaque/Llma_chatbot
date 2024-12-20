"use client";
import React from 'react'
import Cookies from 'js-cookie'

const ProfileImage = () => {
    const photoURL = Cookies.get("photoURL")
  return (
    <div className="w-10 rounded-full ">
    { photoURL? <img
        alt="Profile"
        height={45}
        width={45}
        src={photoURL} />:
        <div className='flex items-center justify-center bg-blue-2 text-blue-1'>{
        Cookies.get("userName")?.charAt(0).toUpperCase()
        }
        </div>
      }
    </div>
  )
}

export default ProfileImage