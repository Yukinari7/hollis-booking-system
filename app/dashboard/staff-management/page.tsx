import { Button } from "@/components/ui/button"
import CreateStaffForm from "./CreateStaffForm"
import { SearchBar } from "@/components/SearchBar"
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Role } from "@/lib/generated/prisma/enums";
import { Suspense } from "react";
import { Badge } from "@/components/ui/badge";

interface PageProps {
  searchParams: Promise<{ search?: string }>;
}

export default async function page({ searchParams }: PageProps) {
  // Await the searchParams object
  const { search } = await searchParams;

  // Build the dynamic filter clause
  const queryFilter = search 
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { department: { contains: search, mode: "insensitive" as const } }
        ],
        role: { in: [Role.Staff, Role.Admin] }
      }
    : {
        role: { in: [Role.Staff, Role.Admin] }
      };

  // Fetch the data conditionally from Neon PostgreSQL
  const staff = await prisma.user.findMany({
    where: queryFilter,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      Status: true,
      department: true, // Make sure department exists in your Prisma Schema!
    },
    orderBy: {
      createdAt: "desc",
    }
  });
  const staffs = staff.map((r) =>({
        id: r.id,
        name: r.name,
        email: r.email,
        role: r.role,
        status: r.Status,
        department: r.department,
    }))
  return (
    <div className="w-[90%] mx-auto flex flex-col py-5 gap-4">
        <div className="border-b border-gray-300 pb-2">
            <h1 className="text-lg md:text-xl font-semibold">Staff Management</h1>
        </div>
        <div className="flex flex-col md:flex-row gap-2">
            <Dialog>
                <DialogTrigger asChild>
                    <Button type="button" className="w-fit p-4.5 bg-blue-600 hover:bg-blue-700">Add Staff</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-3xl">
                    <CreateStaffForm/>
                </DialogContent>
            </Dialog>
            <Suspense fallback={null}>
                <SearchBar/>
            </Suspense>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Staff List</CardTitle>
            </CardHeader>
            <CardContent>
                {staffs.length === 0 ? (<p>No Staff added yet</p>)
                :(<Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Department</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {staffs.map((staff) =>(
                            <TableRow key={staff.id}>
                                <TableCell>{staff.name}</TableCell>
                                <TableCell>{staff.email}</TableCell>
                                <TableCell>{staff.role}</TableCell>
                                <TableCell><Badge variant="secondary">{staff.status}</Badge></TableCell>
                                <TableCell>{staff.department}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>)}
            </CardContent>
        </Card>
    </div>
  )
}
