"use server";

import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";
import { prisma } from "../prisma";
import { getSession } from "../auth/server";
import { BookingStatus, PaymentStatus, StaffRole } from "../generated/prisma/enums";
import { uploadImage } from "@/lib/uploadImage";

export type FormState = {
  success: boolean;
  message: string;
};

export async function getorCreateGuest() {
  const session = await getSession();
  if (!session.data?.user) {
    throw new Error("Not Authenticated")
  }

  let guest = await prisma.guest.findUnique({
    where: {
      id: session.data.user.id,
    }
  })

  if (!guest) {
    guest = await prisma.guest.create({
      data: {
        id: session.data.user.id,
        name: session.data.user.name ??"Guest",
        email: session.data.user.email!,
        phone: "",
      }
    })
  }
  return guest;
}

function parseCreateStaff(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (name.length < 3 || name.length > 120) {
    throw new Error("Name must be between 3 and 120 characters");
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const phone = String(formData.get("phone") ?? "").trim();
  const department = String(formData.get("department") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !phone || !department || !password) {
    throw new Error("All fields are required");
  }

  return {
    name,
    email,
    phone,
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

      const existingUser = await prisma.staff.findUnique({
        where: {
          email: input.email,
        },
      });

      if (existingUser) {
        return {
          success: false,
          message: "A staff member with this email already exists.",
        };
      }

      const hashedPassword = await bcrypt.hash(input.password, 12);

      await prisma.staff.create({
        data: {
          name: input.name,
          email: input.email,
          phone: input.phone,
          department: input.department,
          password: hashedPassword,
          role: StaffRole.Staff,
        },
      });

      revalidatePath("/dashboard/staff-management");
      
      return {
        success: true,
        message: "Staff account created successfully.",
      };
    } catch (error) {
        console.error("Error creating staff account:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unable to create staff account."
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

// Ensure you import your prisma instance and getSession helper here
// import { prisma } from "@/lib/prisma";
// import { getSession } from "@/lib/auth";

interface VerifyInput {
  reference: string;
  roomId: string;
  userId: string;
  checkIn: string;
  checkOut: string;
}

export type VerifyPaymentResult = {
  success: boolean;
  booking?: any;
  error?: string;
};

function validateBookingData(
  name: string,
  checkIn: string,
  checkOut: string
) {
  if (name.trim().length < 3 || name.trim().length > 120) {
    throw new Error("Name must be between 3 and 120 characters.");
  }

  if (!checkIn) {
    throw new Error("Check-in date is required.");
  }

  if (!checkOut) {
    throw new Error("Check-out date is required.");
  }

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  if (checkOutDate <= checkInDate) {
    throw new Error("Check-out date must be after check-in.");
  }

  return {
    checkInDate,
    checkOutDate,
  };
}

export async function verifyBookingPayment(
  request: Request
): Promise<VerifyPaymentResult> {
  try {
    const session = await getSession();

    if (!session.data?.user?.id) {
      throw new Error("Authentication required.");
    }

    const body = await request.json();

    const {
      reference,
      roomId,
      checkIn,
      checkOut,
      name,
    } = body;

    if (!reference) {
      throw new Error("Payment reference missing.");
    }

    if (!roomId) {
      throw new Error("Room ID missing.");
    }

    validateBookingData(name, checkIn, checkOut);

    const guest = await getorCreateGuest();

    return await verifyAndCommitBooking({
      reference,
      roomId,
      userId: guest.id,
      checkIn,
      checkOut,
    });
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function verifyAndCommitBooking(
  input: VerifyInput
): Promise<VerifyPaymentResult> {
  try {
    const {
      reference,
      roomId,
      userId,
      checkIn,
      checkOut,
    } = input;

    const {
      checkInDate,
      checkOutDate,
    } = validateBookingData(
      "Guest",
      checkIn,
      checkOut
    );

    //------------------------------------------
    // Get Room
    //------------------------------------------

    const room = await prisma.room.findUnique({
      where: {
        id: roomId,
      },
    });

    if (!room) {
      throw new Error("Room not found.");
    }

    //------------------------------------------
    // Calculate Total
    //------------------------------------------

    const nights = Math.ceil(
      (checkOutDate.getTime() - checkInDate.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    const expectedTotal = room.pricePerNight * nights;

    //------------------------------------------
    // Verify Paystack FIRST
    //------------------------------------------

    if (!process.env.PAYSTACK_SECRET_KEY) {
      throw new Error("Missing Paystack secret key.");
    }

    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Unable to verify Paystack transaction.");
    }

    const payment = await response.json();

    if (!payment.status) {
      throw new Error("Invalid Paystack response.");
    }

    if (payment.data.status !== "success") {
      throw new Error("Payment was not successful.");
    }

    const paidAmount = payment.data.amount / 100;

    if (paidAmount !== expectedTotal) {
      throw new Error("Payment amount mismatch.");
    }

    //------------------------------------------
    // Transaction begins ONLY HERE
    //------------------------------------------

    const booking = await prisma.$transaction(async (tx) => {

      const newPayment = await tx.payment.create({
        data: {
          reference: reference,
          guestId: userId,
          amount: expectedTotal,
          currency: "NGN",
          gateway: "Paystack",
          status: PaymentStatus.Paid,
          paidAt: new Date(),
        },
      });

      const existingBooking = await tx.booking.findFirst({
        where: {
          roomId,
          status: {
            not: "Cancelled",
          },
          AND: [
            {
              checkIn: {
                lt: checkOutDate,
              },
            },
            {
              checkOut: {
                gt: checkInDate,
              },
            },
          ],
        },
      });

      if (existingBooking) {
        const refund = await fetch("https://api.paystack.co/refund", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            transaction: reference,
          }),
        }
      );
        if (!refund.ok) {
          throw new Error("Unable to process refund.");
        }

      await tx.payment.update({
      where: {
        reference,
      },
      data: {
        status: PaymentStatus.Refunded,
        refundedAt: new Date(),
      },
      });
        throw new Error("Room has already been booked. Payment has been refunded.");
      }

    const user = await tx.guest.findUnique({
        where: {
            id: userId,
        },
    });

    if (!user) {
        throw new Error("Authenticated user no longer exists.");
    }

      const newBooking = await tx.booking.create({
        data: {
          roomId,
          guestId: userId,
          checkIn: checkInDate,
          checkOut: checkOutDate,
          totalPrice: expectedTotal,
          status: BookingStatus.Confirmed,
        },
      });

      await tx.payment.update({
        where: {
            id: newPayment.id,
        },
        data: {
            bookingId: newBooking.id,
        },
    });

      return { booking: newBooking, payment: newPayment}
    });

    revalidatePath(`/rooms/${roomId}`);

    return {
      success: true,
      booking,
    };
  } catch (error: any) {
    console.error(error);

    return {
      success: false,
      error:
        error.message ??
        "Unable to complete booking.",
    };
  }
}
