"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createStaffAction } from "@/lib/actions/events";
import { Eye, EyeClosed } from "lucide-react";
import { toast } from "react-toastify";
import { useActionState, useEffect, useState } from "react";

type FormState = {
  success: boolean;
  message: string;
};

const formState: FormState = {
  success: false,
  message: "",
};

export default function CreateStaffForm() {
    const [state, formAction, isPending] = useActionState(
        createStaffAction,
        formState);
    useEffect(()=> {
        if(!state.success && state.message) toast.error(state.message);
        if(state.success) {
            toast.success('Staff Account created successfully');
        }
    },[state])

    const [showPassword, setShowPassword] = useState(false);
    const toggleVisibility = () => setShowPassword(!showPassword)
  return (
    <div className="space-y-4">
        <div className="flex flex-col gap-4">
            <div className="border-b border-gray-300">
                <h1 className="text-lg md:text-xl font-semibold">Staff Management</h1>
            </div>
        </div>
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Create Staff Account</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={formAction} className="flex flex-col gap-4">
                        <div className="flex flex-col justify-between md:flex-row gap-3">
                            <div className="space-y-2 w-full">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" name="name" required placeholder="Staff Name"></Input>
                            </div>
                            <div className="space-y-2 w-full">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" type="email" required placeholder="david@example.com"></Input>
                            </div>
                        </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div className="space-y-2">
                                    <Label htmlFor="department">Department</Label>
                                    <select id="department" name="department" defaultValue="Reception" required className="w-full flex h-8 rounded-lg border px-2">
                                        <option value="Reception">Reception</option>
                                        <option value="Kitchen">Kitchen</option>
                                        <option value="Bar">Bar</option>
                                    </select>
                                </div>
                                <div className="space-y-2 w-full">
                                    <Label htmlFor="password">Temporary Password</Label>
                                    <div className="flex items-center relative">
                                        <Input id="password" name="password" className="pr-10 w-full" type={showPassword ? "text":"password"} required/>
                                        <button type="button" className="absolute right-5 cursor-pointer" onClick={toggleVisibility}>
                                            {showPassword ? (<EyeClosed className="w-4 h-4"/>):(<Eye className="h-4 w-4"/>)}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <button type="submit" disabled={isPending} className="bg-blue-600 hover:bg-blue-700 w-fit p-2 disabled:opacity-50 text-white text-sm rounded-lg transition">
                                {isPending ? "Generating Account...":"Create Staff Account"}
                            </button>
                    </form>
                </CardContent>
            </Card>
        </div>
    </div>
  )
}
