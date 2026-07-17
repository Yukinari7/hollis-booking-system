import PageHeader from '@/components/PageHeader'
import { RoomSearchBar } from '@/components/RoomSearchBar';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { prisma } from '@/lib/prisma'
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';

export const revalidate = 60;

const PAGE_SIZE = 6;

interface PageProps {
    searchParams: Promise<{ search?: string; page?: string }>;
}

export default async function page({ searchParams }: PageProps) {
    const { search, page } = await searchParams;
    const normalizedSearch = search?.toString().trim() ?? '';
    const normalizedPage = Number(page?.toString() ?? '1');
    const currentPage = Number.isFinite(normalizedPage) && normalizedPage > 1 ? normalizedPage : 1;
    const priceValue = Number(normalizedSearch);
    const slugify = (text: string) => {
        return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "")
    }
    const where = normalizedSearch
        ? {
            OR: [
                { type: { contains: normalizedSearch, mode: 'insensitive' as const } },
                { room_number: { contains: normalizedSearch, mode: 'insensitive' as const } },
                { description: { contains: normalizedSearch, mode: 'insensitive' as const } },
                ...(Number.isFinite(priceValue) && priceValue > 0
                    ? [{ pricePerNight: { equals: priceValue } }]
                    : []),
                ...(normalizedSearch ? [{ amenities: { has: normalizedSearch } }] : []),
            ],
        }
        : undefined;

    const rows = await prisma.room.findMany({
        where,
        orderBy: {type: "asc"},
        skip: (currentPage - 1) * PAGE_SIZE,
        take: PAGE_SIZE + 1,
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
    
    const rooms = rows.slice(0, PAGE_SIZE).map((e)=>({
        id: e.id,
        room_number: e.room_number,
        type: e.type,
        description: e.description,
        pricePerNight: e.pricePerNight,
        amenities: e.amenities,
        images: e.images
    }));
    const hasNextPage = rows.length > PAGE_SIZE;
    const hasPreviousPage = currentPage > 1;
    const totalPages = hasNextPage ? currentPage + 1 : currentPage;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0
        }).format(amount);
    };

  return (
    <div className='py-10'>
        <div>
            <PageHeader title="Rooms"/>
        </div>
            <Suspense fallback={null}>
                <RoomSearchBar/>
            </Suspense>

        <div className='pt-10'>
            {rooms.length === 0 ? <Card>
                <CardHeader>
                    <CardTitle className='text-2xl'>No rooms match your search.</CardTitle>
                </CardHeader>
            </Card>:
            <div className="space-y-4">
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
                                <p>Price Per Night: {''} <span className='text-base font-semibold'>{formatCurrency(room.pricePerNight)}</span></p>
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
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2 rounded-lg border border-slate-200 p-3">
                    <p className="text-sm text-slate-600">Page {currentPage} of {totalPages}</p>
                    <div className="flex gap-2">
                        {hasPreviousPage ? (
                            <Button asChild variant="outline" size="sm">
                                <Link href={{ pathname: '/rooms', query: { ...(normalizedSearch ? { search: normalizedSearch } : {}), page: currentPage - 1 } }}>Previous</Link>
                            </Button>
                        ) : null}
                        {hasNextPage ? (
                            <Button asChild size="sm">
                                <Link href={{ pathname: '/rooms', query: { ...(normalizedSearch ? { search: normalizedSearch } : {}), page: currentPage + 1 } }}>Next</Link>
                            </Button>
                        ) : null}
                    </div>
                </div>
            </div>}
        </div>
    </div>
  )
}


