"use client";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import Google from "@/assets/Google.png"
import { useRef } from "react"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation";
import signInWithGoogle from "../app/actions/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebaseConfig";


export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
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
    <form className={cn("flex flex-col gap-6", className)} {...props} onSubmit={(e)=>e.preventDefault()}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input ref={email} id="email" type="email" placeholder="m@example.com" required />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a
              href="/forgot-password"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input ref={password} id="password" type="password" required />
        </div>
        <Button type="submit" className="w-full bg-blue-1" onClick={handleLogin}>
          Login
        </Button>
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
        <Button variant="outline" className="w-full" onClick={handleSignInWithGoole}>
         <Image src={Google} height={15} width={15} alt="google-logo" />
          Login with Google
        </Button>
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <a href="/signup" className="underline underline-offset-4">
          Sign up
        </a>
      </div>
    </form>
  )
}
