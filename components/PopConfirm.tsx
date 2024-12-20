import React from 'react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import { Button } from './ui/button'

const PopConfirm = ({children,onCancel,onOk}:{children:React.ReactNode,onCancel?:()=>void,onOk:()=>void}) => {
  return (
    <Popover >
  <PopoverTrigger >{children}</PopoverTrigger>
  <PopoverContent className='w-44'>
    <p className='text-start text-gray-600 text-sm -mt-2 rounded-lg'>Are you sure?</p>
    <div className='flex items-center justify-end gap-2  mt-3'>

    <Button type='button' size={"sm"} className='bg-slate-200 text-black-1 h-6 w-10 hover:bg-slate-300' onClick={onCancel}>
        No
    </Button>
    <Button type='button' onClick={onOk} className='bg-blue-1 text-white h-6 w-10 hover:' size={"sm"}>
        Yes
    </Button>
    </div>
  </PopoverContent>
</Popover>
  )
}

export default PopConfirm