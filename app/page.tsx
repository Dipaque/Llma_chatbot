"use client";
import Image from "next/image";
import LoginImage from "@/assets/login_image.png"
import Google from "@/assets/Google.png"
import { Button } from "@/components/ui/button";
import signInWithGoogle from "./actions/auth";
import Cookies from "js-cookie"
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import { useRef } from "react";
import Link from "next/link";


export default function Home() {
    const router = useRouter();
    const email = useRef<any>(null);
    const password = useRef<any>(null);

    const handleLogin = async() => {
    await signInWithEmailAndPassword(auth,email.current.value,password.current.value).then(async(res)=>{
    const user = res.user;
    Cookies.set("userName",user?.displayName||"")
    Cookies.set("email",user?.email||"")
    Cookies.set("photoURL",user?.photoURL ||"")
    Cookies.set("uid",user?.uid)
    if(user?.email){
      await fetch(`/api/addChat`,{
        method:"POST",
        body:JSON.stringify({email:user?.email})
      }).then((res)=>res.json().then((data)=> router.push("/home/"+data.id)))
    }
        }).catch((err)=>{
          console.log(err)
        })
    }

  const handleSignInWithGoole = async() => {
    const user:any = await signInWithGoogle();
    Cookies.set("userName",user?.displayName)
    Cookies.set("email",user?.email)
    Cookies.set("photoURL",user?.photoURL)
    Cookies.set("uid",user?.uid)
    if(user?.email){
      await fetch(`/api/addChat`,{
        method:"POST",
        body:JSON.stringify({email:user?.email})
      }).then((res)=>res.json().then((data)=> router.push("/home/"+data.id)))
    }
   
  }
  return (
    <div className="h-screen grid grid-cols-2">
      <div className="col-span-1  mx-auto my-auto ">
        <div className="flex items-start flex-col gap-2 ">
        <p className="text-3xl font-bold">Welcome back 👋</p>
        <p className=" text-gray-500">Sign in to start chat with your bot.</p>
        <label className="mt-12 text-sm">Email</label>
        <input type="email" ref={email} className="border-2 w-[22rem] h-[45px] border-gray-300 bg-gray-100 ps-3 rounded-lg p-2 text-sm focus:outline-none" placeholder="vaseegaran@chitti.com" />
        <label className="mt-3 text-sm">Password</label>
        <input ref={password} type="password" className="border-2 w-[22rem]  border-gray-300 h-[45px] bg-gray-100 ps-3 rounded-lg p-2 text-sm focus:outline-none" placeholder="Atleast 8 character" />
        <Link href={"/forgot-password"} className="mt-2 text-sm text-blue-1 ms-auto">Forgot Password?</Link>
        <Button className="w-[22rem] h-[45px] mt-2 bg-blue-1 p-3 rounded-lg" onClick={handleLogin}>
          Login
        </Button>
        <p className="text-center mx-auto text-sm mb-2 mt-2 text-gray-500">or</p>
        <Button onClick={()=>handleSignInWithGoole()} className="w-[22rem] h-[45px]  bg-slate-100 p-3 rounded-lg shadow-none text-black-1 hover:bg-slate-200">
            <Image src={Google} width={25} height={25} alt="google" />
            Sign in with Google
        </Button>
       
       <p className="mx-auto mt-3  text-sm"> Don't have an account?<Link href={"/signup"} className="text-blue-1"> Sign up</Link> </p>
        </div>
      </div>
      <div className="col-span-1 flex items-center justify-end p-5 pe-6">
        <Image src={LoginImage} className="rounded-2xl" height={500} width={500} alt="login image" />
      </div>
    </div>
  );
}
