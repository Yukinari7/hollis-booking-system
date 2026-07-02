"use client"

import { deleteRoomAction } from '@/lib/actions/events'
import { toast } from 'react-toastify'
import { useState } from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Trash } from 'lucide-react'

interface Props {
    room: {
        id: string,
        room_number: string;
        type: string;
    }
}

export default function DeleteRoom({room}: Props) {
    const [loading, setLoading] = useState(false);
    const handleDelete = async () => {
        const result = await deleteRoomAction(room.id);
            if(result.success) {
                toast.success(result.message)
            } else {
                toast.error(result.message)
            }
            setLoading(false);
        }
  return (
    <AlertDialog>
        <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm" className='ml-2'>
                <Trash className='w-4 h-4'/>
            </Button>
        </AlertDialogTrigger>
                <AlertDialogContent className='sm:max-w-sm'>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Room</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to delete <strong>{room.type}, {room.room_number}</strong>
                                <br/>
                                This action cannot be undone
                            </AlertDialogDescription>
                    </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleDelete}>{loading ? "Deleting...":"Delete"}</AlertDialogAction>
                                </AlertDialogFooter>
                </AlertDialogContent>
    </AlertDialog>
  )
}
