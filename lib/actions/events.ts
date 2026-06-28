"use server";

import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";
import { prisma } from "../prisma";
import { getSession } from "../auth/server";
import { Role } from "../generated/prisma/enums";

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
