"use client"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createRoomAction } from '@/lib/actions/events';
import { useActionState, useEffect, useState } from 'react';
import { toast } from "react-toastify";

type FormState = {
  success: boolean;
  message: string
}

const formState: FormState = {
  success: false,
  message: ""
}

export default function CreateRoomForm() {
  const [state, formAction, isPending ] = useActionState(createRoomAction, formState);
  useEffect(()=>{
    if(!state?.success && state.message) toast.error(state.message)
    if(state.success) {
      toast.success('Room created successfully')
    }
  },[state])

  const [liveText, setLiveText] = useState("");
  const liveBadgesArray = liveText
    .split(",")
    .map((item) => String(item).trim())
    .filter((item) => item !== "");
  return (
    <div>
      <CardHeader>
                <CardTitle className='text-lg md:text-xl mb-3'>Create Room</CardTitle>
            </CardHeader>
        <Card>
            <CardContent>
              <form action={formAction} className='flex flex-col gap-3'>
                  <div className='flex flex-col md:flex-row gap-3'>
                    <div className="space-y-2 w-full">
                      <Label htmlFor="room_number">Room Number</Label>
                      <Input id="room_number" name="room_number" required placeholder="E.g Room 001"></Input>
                    </div>
                    <div className="space-y-2 w-full">
                      <Label htmlFor="type">Room Type</Label>
                      <Input id="type" name="type" required placeholder="Deluxe, Presidential suite..."></Input>
                    </div>
                    <div className="space-y-2 w-full relative">
                      <Label htmlFor="pricePerNight">Price Per Night</Label>
                      <div className="pointer-events-none absolute pl-3 left-0 -bottom-0.5 flex items-center">
                        <span className='text-gray-500'>N</span>
                      </div>
                      <Input id="pricePerNight" type='number' name="pricePerNight" min="1" required className='pl-7'></Input>
                    </div>
                  </div>
                  <div className="space-y-2 w-full">
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" name="description" required/>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                        <select id="status" name="status" defaultValue="Available" required className="flex h-8 rounded-lg border md:w-[50%]">
                          <option value="Available">Available</option>
                          <option value="Occupied">Occupied</option>
                          <option value="Maintenance">Maintenance</option>
                        </select>
                  </div>
                  <div className="space-y-2 w-full">
                      <Label htmlFor="amenities">Amenities</Label>
                      <input type="text" name="amenities" value={liveText} 
                      placeholder="Tv, Ac, WiFi, Mini Bar, Balcony"
                      onChange={(e) => setLiveText(e.target.value)} // This triggers the live update
                      className="w-full border p-2 rounded-lg dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {liveBadgesArray.map((badge, index) => (
                    <span key={index} className="text-xs font-medium px-3 py-1.5 bg-gray-200 dark:bg-gray-800 
                      text-gray-800 dark:text-gray-200 rounded-full border border-gray-300 dark:border-gray-700 
                      transition-all animate-in fade-in zoom-in-95 duration-150">{badge}
                    </span>
                    ))}
                  <span className="text-xs border-2 border-dashed border-gray-300 dark:border-gray-700 text-gray-400 w-7 h-7 
                    flex items-center justify-center rounded-full cursor-default select-none">+</span>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="images">Room Image</Label>
                    <Input id="images" name="images" type="file" accept="image/*"/>
                  </div>
                  <button type="submit" disabled={isPending} className='bg-blue-600 hover:bg-blue-700 w-fit p-2 rounded-md transition text-white text-sm disabled:opacity-50'>
                    {isPending ? "Creating Room...":"Create Room"}
                  </button>
              </form>
            </CardContent>
        </Card>
    </div>
  )
}
