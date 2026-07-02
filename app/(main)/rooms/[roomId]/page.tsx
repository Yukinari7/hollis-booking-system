import { RoomDetail } from "@/components/RoomDetail";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{roomId: string}>
}

export default async function Page({ params }: PageProps) {
  const { roomId } = await params;
  const room = await prisma.room.findUnique({
    where: {
      id: roomId,
    },
  });

  if (!room) {
    notFound();
  }

  return <RoomDetail room={room} />;
}