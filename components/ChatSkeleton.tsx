import React from 'react'
import { Skeleton } from './ui/skeleton'

const ChatSkeleton = () => {
  return (
    <div>
        <div className='flex justify-end items-start gap-2 w-auto ' >
            <div className=''>
                <Skeleton className='h-52  w-96' />
                {/* <Skeleton className='h-3 w-64 mt-2' /> */}
            </div>
            <Skeleton className='h-14 w-14 rounded-full' />
        </div>
        <div className='flex justify-start items-start gap-2 w-auto mt-5 ' >
            <Skeleton className=' avatar h-14 w-14 rounded-full' />
            <div className=''>
                <Skeleton className='h-52 w-96' />
                {/* <Skeleton className='h-3 w-64 mt-2' /> */}
            </div>
        </div>
    </div>
  )
}

export default ChatSkeleton