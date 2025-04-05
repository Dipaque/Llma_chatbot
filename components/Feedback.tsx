"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { ThumbsDown, Copy } from "lucide-react"
import  { StateContext } from './ContextProvider';
import { useContext } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  import { Input } from "@/components/ui/input"
  import { useToast } from "@/hooks/use-toast"
  import { Label } from "@/components/ui/label"  
import { FeedbackForm } from "./form/FeedbackForm"
interface chat {query:string,response:string,vectorId:string}

const FormSchema = z.object({
    feedback: z
      .string()
      .min(10, {
        message: "feedback must be at least 10 characters.",
      })
  })
const Feedback = ({docId,chat,chats,index}:{docId:string,chat:chat,chats:chat[],index:number}) => {
    console.log(chat)
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
      })
  const {generate,setGenerate}:any = useContext(StateContext);
      const { toast } = useToast()
     async function onSubmit(data: z.infer<typeof FormSchema>) {
        const res = await fetch("/api/qdrant",{
            method:"PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body:JSON.stringify( {
              query:chat.query,
              response:data.feedback,
              vectorId:chat.vectorId
            })
          })
          const response = await res.json()
          const vectorId = response.data
          chats[index].vectorId = vectorId
          chats[index].response = data.feedback
          const query = new URLSearchParams({
            id: docId,
            chats: JSON.stringify(chats),
          }).toString();

          await fetch(`/api/addChat?${query}`, {
            method: "DELETE",
          });
          
          setGenerate(true)
      }
    
  return (
    <Dialog>
    <DialogTrigger asChild>
    <ThumbsDown  size={16} className='text-black-1 cursor-pointer' />
    </DialogTrigger>
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle className='text-black-1'>Help Chitti Learn</DialogTitle>
        <DialogDescription>
        What Should the Correct Answer Be?
        </DialogDescription>
      </DialogHeader>
      <div className="flex items-center space-x-2">
        <div className="grid flex-1 gap-2">
          <Label htmlFor="link" className="sr-only">
            Link
          </Label>
         <FeedbackForm form={form} onSubmit={onSubmit} />
        </div>
      </div>
      
    </DialogContent>
  </Dialog>
  )
}

export default Feedback