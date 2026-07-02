import PageHeader from '@/components/PageHeader'
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { prisma } from '@/lib/prisma'
import Image from 'next/image';
import Link from 'next/link';

export default async function page() {
    const slugify = (text: string) => {
        return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "")
      }
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
    });
    
    const rooms = rows.map((e)=>({
        id: e.id,
        room_number: e.room_number,
        type: e.type,
        description: e.description,
        pricePerNight: e.pricePerNight,
        amenities: e.amenities,
        images: e.images
    }));

    const formatDollar = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(amount);
    };

  return (
    <div className='py-10'>
        <div>
            <PageHeader title="Rooms"/>
        </div>

        <div className='pt-10'>
            {rooms.length === 0 ? <Card>
                <CardHeader>
                    <CardTitle className='text-2xl'>No rooms available!</CardTitle>
                </CardHeader>
            </Card>:
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {rooms.map((room)=>{
                const roomSlug = slugify(`${room.type} ${room.room_number}`);
                return (
                    <Card key={room.id} className='p-2'>
                        <div className='flex flex-col lg:flex-row items-start gap-3'>
                            {room.images.length > 0 &&(
                                <Image src={room.images[0]} alt={room.type} width={200} height={200} className='rounded-md object-cover'/>
                            )}
                        <div className='flex-1 flex flex-col'>
                            <div>
                                <h2 className='text-base font-semibold'>{room.type}</h2>
                                <p>{room.room_number}</p>
                            </div>
                            <p>Price Per Night: {''} <span className='text-base font-semibold'>{formatDollar(room.pricePerNight)}</span></p>
                            <div className="flex flex-wrap gap-2 mt-3">
                                {room.amenities.map((amenity, index)=>(
                                    <span key={index} className="text-xs bg-blue-100 text-blue-700 rounded-full py-1 px-3">{amenity}</span>
                                ))}
                            </div>
                        </div>
                        <Button asChild>
                            <Link href={{pathname: `/rooms/${room.id}`,
                                query: { slug: roomSlug}}}>View
                            </Link>
                        </Button>
                        </div>
                    </Card>
                )
                })}
            </div>}
        </div>
    </div>
  )
}


