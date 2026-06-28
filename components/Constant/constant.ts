import { BadgeDollarSign, Bed, Calendar, CreditCard, LayoutDashboard, Users2, WashingMachine } from "lucide-react";

export const sideNavLinks = [
    {
        id:1,
        url: '/dashboard',
        label: "Dashboard",
        roles: ["staff", "admin"],
        icon: LayoutDashboard
    },
    {
        id:2,
        url: '#',
        label: "Reservations",
        roles: ["staff", "admin"],
        icon: Calendar
    },
    {
        id:3,
        url: '#',
        label: "Room Status",
        roles: ["staff", "admin"],
        icon: Bed
    },
    {
        id:4,
        url: '#',
        label: "Room Types",
        roles: ["admin"],
        icon: Bed
    },
    {
        id:5,
        url: '#',
        label: "Guests",
        roles: ["staff", "admin"],
        icon: Users2
    },
    {
        id:6,
        url: '#',
        label: "Payments",
        roles: ["staff", "admin"],
        icon: CreditCard
    },
    {
        id:7,
        url: '#',
        label: "Finance",
        roles: ["admin"],
        icon: BadgeDollarSign
    },
    {
        id:8,
        url: '/dashboard/staff-management',
        label: "Staff Management",
        roles: ["admin"],
        icon: Users2
    },
    {
        id:9,
        url: '#',
        label: "House Keeping",
        roles: ["staff", "admin"],
        icon: WashingMachine
    },
]

export const navLinks = [
    {
        id: 1,
        url: "/bookings",
        label: "Bookings",
    },
    {
        id: 2,
        url: "/rooms",
        label: "Rooms",
    },
    {
        id: 3,
        url: "/payments",
        label: "Payments",
    },
]