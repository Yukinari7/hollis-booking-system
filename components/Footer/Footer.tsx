import React from 'react'

export default function Footer() {
  return (
    <div className='border-t border-gray-300 py-5'>
        <div className='w-[90%] mx-auto flex flex-col md:flex-row gap-2 items-center justify-center text-sm 
        text-gray-500'><p>© {new Date().getFullYear()} Hollis. All rights reserved.</p>
        <div>
          Developed by <a href="https://ememprinceson.vercel.app" className='text-gray-700 dark:text-gray-400 font-semibold'>Emem Princeson.</a>
        </div>
        </div>
    </div>
  )
}
