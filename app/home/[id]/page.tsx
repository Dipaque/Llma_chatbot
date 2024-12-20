

import Chats from '@/components/Chats'
import Header from '@/components/Header'
import InputField from '@/components/InputField'

const page = () => {

  return (
    <div className='flex flex-col h-screen justify-between lg:w-auto '>
      <Header />
      {/* <div className='mx-auto  '> */}
      <Chats />
      <InputField />  
      {/* </div> */}
    </div>
  )
}

export default page