import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Plus } from 'lucide-react'
import React from 'react'
import CreateRoomForm from './CreateRoomForm'

export default function page() {
  return (
    <div className="w-[90%] mx-auto flex flex-col gap-4 py-5">
        <div className='border-gray-300 border-b pb-2'>
            <h1 className='text-lg md:text-xl font-semibold'>Room Types</h1>
            <h2 className='text-sm'>Manage, create and edit Rooms and amenities</h2>
        </div>
        <div className='flex flex-col md:flex-row gap-3'>
            <Dialog>
                <DialogTrigger asChild>
                    <Button type="button" className='flex items-center gap-1'><Plus className="w-5 h-5"/>Add Rooms</Button>
                </DialogTrigger>
                <DialogContent className='sm:max-w-3xl'>
                    <CreateRoomForm/>
                </DialogContent>
            </Dialog>
        </div>
    </div>
  )
}
