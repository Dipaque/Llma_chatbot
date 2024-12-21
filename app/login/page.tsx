import { GalleryVerticalEnd } from "lucide-react"

import { LoginForm } from "@/components/login-form"

import LoginImage from "@/assets/login_image.png"
import Logo from "@/assets/Logomark@2x.png"
import Image from "next/image"

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <Image src={Logo} height={35} width={35} alt="logo" />
            
           <span>Chitti 2.0</span> 
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block p-3">
        <img
          src={LoginImage.src}
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}
