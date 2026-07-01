"use client"
import { Textarea } from "@/components/ui/textarea";
import { updateRoomAction } from "@/lib/actions/events";
import Image from "next/image";
import { useActionState, useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Props {
    room: {
        id: string;
        room_number: string;
        type: string;
        pricePerNight: number;
        description: string;
        amenities: string[];
        images: string[];
    }
}

type FormState = {
  success: boolean;
  message: string;
};

const formState: FormState = {
  success: false,
  message: "",
};

export default function EditRoom({room}:Props) {
    const updateRoomWithId = updateRoomAction.bind(null, room.id)
    const [state, formAction, isPending] = useActionState(updateRoomWithId, formState)
    useEffect(()=>{
        if(!state?.success && state.message) toast.error(state.message)
        if(state.success) {
            toast.success("Room Edited Successfully")
        }
    },[state])

    const [liveText, setLiveText] = useState(room.amenities.join(", "));
    const liveBadgesArray = liveText
    .split(",")
    .map((item) => String(item).trim())
    .filter((item) => item !== "");

    const [previewImage, setPreviewImage] = useState(room.images[0] ?? "");
  return (
    <form action={formAction} className="space-y-4">
        <div>
        <label className="block text-sm font-medium text-slate-700">Room Number</label>
        <input
          type="text"
          name="room_number"
          defaultValue={room.room_number} // Populate with current data from database row
          required
          className="w-full mt-1 border rounded-md p-2"
        />
      </div>

        <div>
        <label className="block text-sm font-medium text-slate-700">Room Type</label>
        <input
          type="text"
          name="type"
          defaultValue={room.type} // Populate with current data from database row
          required
          className="w-full mt-1 border rounded-md p-2"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-slate-700">Description</label>
        <Textarea
          name="description"
          defaultValue={room.description} // Populate with current data from database row
          required
          className="w-full mt-1 border rounded-md p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Price Per Night</label>
        <input
          type="number"
          name="pricePerNight"
          defaultValue={room.pricePerNight}
          required
          min="1"
          step="0.01"
          className="w-full mt-1 border rounded-md p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Amenities</label>
        <input
          type="text"
          name="amenities"
          defaultValue={liveText}
          onChange={(e) => setLiveText(e.target.value)}
          className="w-full mt-1 border rounded-md p-2"
        />
      </div>
      <div className="flex flex-wrap gap-2 pt-1">
        {liveBadgesArray.map((badge, index) => (
            <span key={index} className="text-xs font-medium px-3 py-1.5 bg-gray-200 dark:bg-gray-800 
                text-gray-800 dark:text-gray-200 rounded-full border border-gray-300 dark:border-gray-700 
                transition-all animate-in fade-in zoom-in-95 duration-150">{badge}
            </span>
        ))}
        <span className="text-xs border-2 border-dashed border-gray-300 dark:border-gray-700 text-gray-400 w-7 h-7 
            flex items-center justify-center rounded-full cursor-default select-none">+</span>
      </div>

      {/* 2. Added optional image upload field */}
    <div>
        <label className="block text-sm font-medium text-slate-700">
          Room Image <span className="text-xs text-slate-400 font-normal">(Leave blank to keep current)</span>
        </label>
        <input
            type="file"
            name="images" // Matches your backend formData.get("images") string key exactly!
            accept="image/*"
            onChange={(e) => {
                const file = e.target.files?.[0];
                     if (file) {
                    setPreviewImage(URL.createObjectURL(file));
                }
            }}
          className="w-full mt-1 text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 border rounded-md p-1"
        />
        {previewImage && (
            <div className="relative mt-3 inline-block">
                <Image src={previewImage} alt="Room Preview" width={160} height={160} className="rounded-md object-cover border"/>
                <button type="button" onClick={() => setPreviewImage("")}
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-600 text-white">×</button>
            </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-md font-medium transition disabled:bg-slate-300"
      >
        {isPending ? "Saving changes..." : "Save Changes"}
      </button>
    </form>
  )
}
