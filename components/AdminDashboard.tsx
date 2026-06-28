import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";


const page = () => {
const today = new Date();
const formattedDate = today.toLocaleDateString(
  "en-US",
  {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  }
);

const hour = new Date().getHours();
let greeting= "";
if(hour < 12) {
  greeting = "Good Morning"
} else if(hour < 18) {
    greeting = "Good Afternoon"
  } else {
    greeting = "Good Evening"
  }


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
          <CardDescription className="text-2xl">0%</CardDescription>
        </CardHeader>
        <CardContent>0 of 20 rooms</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Today's Arrivals</CardTitle>
          <CardDescription className="text-2xl">0</CardDescription>
        </CardHeader>
        <CardContent>0 pending check-in</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Total Revenue</CardTitle>
          <CardDescription className="text-2xl">$12,042</CardDescription>
        </CardHeader>
        <CardContent>0 of 20 rooms</CardContent>
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
        </Table>
      </CardContent>
    </Card>
    </div>
  )
}

export default page