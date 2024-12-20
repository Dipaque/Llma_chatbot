"use client";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import ContextProvider from "@/components/ContextProvider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
         <ContextProvider >
      <AppSidebar />
      <SidebarInset className="flex flex-col gap-2  ">
        
      <main >
        {children}
      </main>
      </SidebarInset>
      </ContextProvider>
    </SidebarProvider>
  )
}
