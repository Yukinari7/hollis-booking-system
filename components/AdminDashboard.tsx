import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { prisma } from "@/lib/prisma";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);

const getDurationDays = (checkIn: Date, checkOut: Date) => {
  const diffMs = checkOut.getTime() - checkIn.getTime();
  return Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
};

const page = async () => {
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const hour = new Date().getHours();
  let greeting = "";
  if (hour < 12) {
    greeting = "Good Morning";
  } else if (hour < 18) {
    greeting = "Good Afternoon";
  } else {
    greeting = "Good Evening";
  }

  const [rooms, bookings, paidPayments, todayBookings] = await Promise.all([
    prisma.room.findMany({
      select: { id: true, status: true },
    }),
    prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      select: {
        id: true,
        checkIn: true,
        checkOut: true,
        room: {
          select: { type: true, room_number: true },
        },
        guest: {
          select: { name: true },
        },
        status: true,
      },
    }),
    prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: "Paid" },
    }),
    prisma.booking.count({
      where: {
        checkIn: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    }),
  ]);

  const occupiedRooms = rooms.filter((room) => room.status === "Occupied").length;
  const totalRooms = rooms.length;
  const occupancyPercent = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;
  const revenue = paidPayments._sum.amount ?? 0;
  const pendingCheckIn = todayBookings;

  return (
    <div className="w-[90%] mx-auto py-5 flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <div className="border-b border-gray-300">
          <h1 className="text-lg md:text-xl font-semibold">Dashboard</h1>
          <p className="text-sm">{formattedDate}</p>
        </div>
        <div>
          <h2 className="text-xl">{greeting}, Admin.</h2>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Occupancy</CardTitle>
            <CardDescription className="text-2xl">{occupancyPercent}%</CardDescription>
          </CardHeader>
          <CardContent>
            {occupiedRooms} of {totalRooms} rooms
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Today&apos;s Arrivals</CardTitle>
            <CardDescription className="text-2xl">{pendingCheckIn}</CardDescription>
          </CardHeader>
          <CardContent>{pendingCheckIn} pending check-in</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Revenue</CardTitle>
            <CardDescription className="text-2xl">{formatCurrency(revenue)}</CardDescription>
          </CardHeader>
          <CardContent>{totalRooms} rooms tracked</CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-[0.5fr_1.5fr] gap-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-semibold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col space-y-2">
            <Button variant="outline">Check in Guest</Button>
            <Button variant="outline">Check out Guest</Button>
            <Button variant="outline">Walk in Reservation</Button>
            <Button variant="outline">Update Room Status</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-semibold">Revenue</CardTitle>
          </CardHeader>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-semibold">Booking List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking Id</TableHead>
                <TableHead>Guest Name</TableHead>
                <TableHead>Room Type</TableHead>
                <TableHead>Room Number</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Check-In & Check-out</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>{booking.id.slice(0, 8)}</TableCell>
                  <TableCell>{booking.guest?.name ?? "Unknown"}</TableCell>
                  <TableCell>{booking.room?.type ?? "—"}</TableCell>
                  <TableCell>{booking.room?.room_number ?? "—"}</TableCell>
                  <TableCell>{getDurationDays(booking.checkIn, booking.checkOut)} day(s)</TableCell>
                  <TableCell>
                    {booking.checkIn.toLocaleDateString()} - {booking.checkOut.toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default page
