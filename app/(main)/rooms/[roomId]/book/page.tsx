import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import BookingForm from "./BookingForm";


interface PageProps {
    params: Promise <{roomId: string}>
}

export default async function book({params}: PageProps) {
    const { roomId } = await params;
    const actualRoomId = roomId;

  const room = await prisma.room.findUnique({
    where: {
      id: actualRoomId,
    },
  });

  if (!room) {
    notFound();
  }

  return <BookingForm room={room} />;
}

