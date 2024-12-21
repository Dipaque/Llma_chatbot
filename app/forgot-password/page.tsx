"use client";
import { Button } from '@/components/ui/button';
import { auth } from '@/firebaseConfig';
import { sendPasswordResetEmail } from 'firebase/auth';
import React, { useRef } from 'react'
import { useToast } from "@/hooks/use-toast"
import { useRouter } from 'next/navigation';

const page = () => {
  const email = useRef<any>(null)
  const { toast } = useToast()
  const router = useRouter();

  const hadleForgotPassword = async() => {
    if(email.current.value){
      await sendPasswordResetEmail(auth,email.current.value).then(()=>{
        toast({
          description: "The password reset email has been sent to your mail box",
        })
        router.push("/login")
      }).catch((err)=> console.log(err))
    }else{
      toast({
        variant:"destructive",
        description: "Email is required!",
      })
    }
  }
  return (
    <main className='h-screen flex items-center justify-center bg-[#f3f3f3]'>
      <div className='bg-white rounded-lg   p-6 shadow-lg '>
        <h4 className='mt-3  mb-5 font-bold text-black-1 text-lg'>Forgot your passsword?</h4>
        <form className='flex flex-col ms-3' onSubmit={(e)=>e.preventDefault()}>
          <label className=" text-sm ">Email</label>
          <input type="email" ref={email} className="border-2 w-[22rem] h-[45px] mt-2 border-gray-300 bg-gray-100 ps-3 rounded-lg p-2 text-sm focus:outline-none" placeholder="vaseegaran@chitti.com" />
        </form>
        <Button type='submit' onClick={hadleForgotPassword} className='bg-blue-1 p-3 rounded-lg mt-5 float-right'>Reset</Button>
      </div>
    </main>
  )
}

export default page