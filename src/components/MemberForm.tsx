import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

const MemberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  img: z.any().optional(),
  about: z.string().min(1, "About is required"),
  department: z.string().min(1, "Department is required"),
  position: z.string().min(1, "Position is required"),
  socialLinks: z.object({
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    twitter: z.string().optional(),
    linkedIn: z.string().optional(),
  }),
});

type MemberFormData = z.infer<typeof MemberSchema>;

const MemberForm: React.FC = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<MemberFormData>({
    resolver: zodResolver(MemberSchema),
  });

  const onSubmit = async (data: MemberFormData) => {
    try {
      let imageUrl = null;

      if (imagePreview) {
        const formData = new FormData();
        formData.append("file", imagePreview);
        formData.append("upload_preset", "gfdhvhmn");

        const cloudinaryResponse = await axios.post(
          "https://api.cloudinary.com/v1_1/dcjktgmtr/image/upload",
          formData
        );

        imageUrl = cloudinaryResponse.data.secure_url;
      }

      const postData = { ...data, img: imageUrl };

      const response = await axios.post(
        "https://the-hive-b.vercel.app/admin/members",
        postData
      );

      if (response.status === 201) {
        alert("Member Created Successfully");
      }
    } catch (error) {
      console.error("Error Posting Member: ", error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            {...register("name")}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            type="text"
            placeholder="Member's Name"
          />
          {errors.name && <span className="text-red-500">{errors.name.message}</span>}
        </div>

        <div>
          <label className="block text-sm font-medium">About</label>
          <textarea
            {...register("about")}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            placeholder="About the Member"
          />
          {errors.about && <span className="text-red-500">{errors.about.message}</span>}
        </div>

        <div>
          <label className="block text-sm font-medium">Department</label>
          <input
            {...register("department")}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            type="text"
            placeholder="Department"
          />
          {errors.department && <span className="text-red-500">{errors.department.message}</span>}
        </div>

        <div>
          <label className="block text-sm font-medium">Position</label>
          <input
            {...register("position")}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            type="text"
            placeholder="Position"
          />
          {errors.position && <span className="text-red-500">{errors.position.message}</span>}
        </div>

        <div>
          <label className="block text-sm font-medium">Social Links</label>
          <div className="space-y-2">
            <input
              {...register("socialLinks.facebook")}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              type="text"
              placeholder="Facebook"
            />
            <input
              {...register("socialLinks.instagram")}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              type="text"
              placeholder="Instagram"
            />
            <input
              {...register("socialLinks.twitter")}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              type="text"
              placeholder="Twitter"
            />
            <input
              {...register("socialLinks.linkedIn")}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              type="text"
              placeholder="LinkedIn"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Profile Image</label>
          <input
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Selected"
              className="mt-2 w-32 h-32 object-cover rounded-full"
            />
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default MemberForm;
