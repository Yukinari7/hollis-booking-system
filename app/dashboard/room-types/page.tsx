import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Plus } from 'lucide-react'
import CreateRoomForm from './CreateRoomForm'
import EditRoom from './EditRoom'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import DeleteRoom from './DeleteRoom'

export default async function page() {
    const rows = await prisma.room.findMany({
        orderBy: {type: "asc"},
        select: {
            id: true,
            room_number: true,
            type: true,
            description: true,
            pricePerNight: true,
            amenities: true,
            images: true
        }
    })

    const rooms = rows.map((e)=> ({
        id: e.id,
        room_number: e.room_number,
        type: e.type,
        description: e.description,
        pricePerNight: e.pricePerNight,
        amenities: e.amenities,
        images: e.images
    }))

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0
        }).format(amount);
    }

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
                <DialogContent className='sm:max-w-3xl max-h-[85vh] overflow-y-auto'>
                    <CreateRoomForm/>
                </DialogContent>
            </Dialog>
        </div>
        <div>
        {rooms.length === 0 ?<Card>
            <CardHeader>
                <CardTitle>No rooms created yet</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Create a room!</p>
            </CardContent>
        </Card>:
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {rooms.map((room)=>(
                <Card key={room.id}>
                    <CardHeader>
                        <div className='flex items-start justify-between gap-2'>
                            <CardTitle className='text-lg'>{room.type}</CardTitle>
                            <div>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" size="sm">
                                            Edit
                                        </Button>                                       
                                    </DialogTrigger>
                                    <DialogContent className='sm:max-w-3xl max-h-[85vh] overflow-y-auto overflow-x-hidden'>
                                        <EditRoom room={room}/>
                                    </DialogContent>
                                </Dialog>
                                <DeleteRoom room={room}/>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-4">
                            <p className="text-xs">{room.description}</p>
                            <p className='font-semibold text-base'>{formatCurrency(room.pricePerNight)}</p>
                            <div className='flex flex-wrap gap-2'>
                                {room.amenities.map((amenity, index)=>(
                                    <span key={index} className='text-xs font-medium bg-blue-100 text-blue-700 rounded-full px-2 
                                    py-1 '>{amenity}</span>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
        }
        </div>
    </div>
  )
}
