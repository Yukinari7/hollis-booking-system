"use server";

import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";
import { prisma } from "../prisma";
import { getSession } from "../auth/server";
import { Role, RoomStatus } from "../generated/prisma/enums";
import { uploadImage } from "@/lib/uploadImage";
import { redirect } from "next/navigation";

export type FormState = {
  success: boolean;
  message: string;
};

function parseCreateStaff(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (name.length < 3 || name.length > 120) {
    throw new Error("Name must be between 3 and 120 characters");
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const department = String(formData.get("department") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !department || !password) {
    throw new Error("All fields are required");
  }

  return {
    name,
    email,
    department,
    password,
  };
}

export async function createStaffAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {

    try {
      const session = await getSession();

      if (!session.data?.user) {
        return {
          success: false,
          message: "Your session expired. Please sign in again.",
        };
      }

      const input = parseCreateStaff(formData);

      const existingUser = await prisma.user.findUnique({
        where: {
          email: input.email,
        },
      });

      if (existingUser) {
        return {
          success: false,
          message: "A user with this email already exists.",
        };
      }

      const hashedPassword = await bcrypt.hash(input.password, 12);

      await prisma.user.create({
        data: {
          name: input.name,
          email: input.email,
          department: input.department,
          password: hashedPassword,
          role: Role.Staff,
        },
      });

      revalidatePath("/dashboard/staff-management");

      return {
        success: true,
        message: "Staff account created successfully.",
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to create staff account.",
      };
    }

}

function parseCreateRoom(formData: FormData) {
    const room_number = String(formData.get("room_number") ?? "").trim();
    const type = String(formData.get("type") ?? "").trim();
    const rawPrice = formData.get("pricePerNight")?.toString() || "";
    const pricePerNight = parseFloat(rawPrice);
    if (Number.isNaN(pricePerNight) || pricePerNight <= 0) {
        throw new Error("Invalid room price. Please enter a positive number")
    }
    const description = String(formData.get("description") ?? "").trim();
    const amenities = String(formData.get("amenities") ?? "").split(",").map(item => item.trim()).filter(Boolean);
    const images = formData.get("images") as File | null;


    return {
        room_number,
        type,
        pricePerNight,
        description,
        amenities,
        images
    };
}

export async function createRoomAction(
    _prevState: FormState, 
    formData: FormData): Promise<FormState> {
    try {
     const session = await getSession();

      if (!session.data?.user) {
        return {
          success: false,
          message: "Your session expired. Please sign in again.",
        };
      }

      const input = parseCreateRoom(formData)

      let imageUrl: string | null = null;
        if (input.images && input.images.size > 0) {
        imageUrl = await uploadImage(input.images);
    }

      await prisma.room.create({
        data: {
            room_number: input.room_number,
            type: input.type,
            pricePerNight: input.pricePerNight,
            description: input.description,
            amenities: input.amenities,
            images: imageUrl ? [imageUrl]: []
        }
      })

      revalidatePath("/dashboard/room-types")

      return {
        success: true, message: "Room created successfully"
      };
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "Unable to create room"
        }
    }
}

export async function updateRoomAction(id: string, prevState: FormState, formData: FormData):
 Promise<FormState> {
try {
    const room_number = String(formData.get("room_number") ?? "").trim();
    const type = String(formData.get("type") ?? "").trim();
    const rawPrice = formData.get("pricePerNight")?.toString() || "";
    const pricePerNight = parseFloat(rawPrice);
    if (Number.isNaN(pricePerNight) || pricePerNight <= 0) {
        throw new Error("Invalid room price. Please enter a positive number")
    }
    const description = String(formData.get("description") ?? "").trim();
    const amenities = String(formData.get("amenities") ?? "").split(",").map(item => item.trim()).filter(Boolean);
    const images = formData.get("images") as File | null;

    let imageUrl: string | null = null;
        if (images && images.size > 0) {
        imageUrl = await uploadImage(images);
    }

    await prisma.room.update({
        where: {id: id},
        data: {
            room_number,
            type,
            pricePerNight,
            description,
            amenities,
            images: imageUrl ? [imageUrl] : undefined,

        }
    })

    revalidatePath("/dashboard/room-types")

    return {
        success: true, message: "Room edited successfully"
    };

} catch (error) {
    return {
        success: false, message: "Unable to edit room details"
    }
}
}

export async function deleteRoomAction(id: string){
    try{
        await prisma.room.delete({
            where: {
                id: id
            }
        });
        
        revalidatePath("/dashboard/room-type")
        
        return {
            success: true, message: "Room deleted successfully"
        }

    } catch (error){
        return {
            success: false, message: "Failed to delete room"
        }
    }
}

function parseCreateBooking(formData: FormData) {
    const name = String(formData.get("name")?? "").trim();
    if (name.length <3 || name.length > 120) {
        throw new Error ("Name must be between 3 to 120 characters")
    }
    const email = String(formData.get("email")?? "").trim().toLowerCase();
    const phone = String(formData.get("phone"));
    const checkIn = String(formData.get("checkIn")?? "").trim();
    if(!checkIn) {
        throw new Error("Check-In date required");
    }

    const checkOut = String(formData.get("checkOut")?? "").trim();
    if(!checkOut) {
        throw new Error("Check-Out date required");
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut)

    if (checkOutDate <= checkInDate) {
        throw new Error("Check-out date must be before check-in date")
    }

    return {
        name,
        email,
        phone,
        checkInDate,
        checkOutDate,
    }
}

export async function createBookingAction(roomId: string, prevState: FormState, formData: FormData): Promise<FormState> {
    try {
        const session = await getSession();
        if (!session.data?.user.id) {
            return {success: false, message: "Your session expired. Please sign in"}
        }

        const input = parseCreateBooking(formData);

        const room = await prisma.room.findUnique({
            where: { id: roomId }
        })
        if (!room) {
            throw new Error("Room not found")
        }

        const timeDifference = input.checkOutDate.getTime() - input.checkInDate.getTime();
        const totalNights = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
        const calculatedPrice = totalNights * room.pricePerNight  

        await prisma.booking.create({
            data: {
                userId: session.data.user.id,
                roomId: room.id,
                checkIn: input.checkInDate,
                checkOut: input.checkOutDate,
                totalPrice: calculatedPrice
            }
        })

        revalidatePath(`/rooms/${room.id}`)
        return {
            success: true, message: "Booking done successfully"
        }
    } catch (error) {
        return {success: false, message: "Failed to book room"}
    }
}
