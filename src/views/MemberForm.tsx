import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { motion } from "framer-motion";
import { ClipLoader } from "react-spinners";

const MemberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  img: z.string().optional(),
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

const departments = ["Art", "Academic", "HR", "Creative","Tech"];
const positions = ["Member", "Leader", "Head", "Founding member"];

const MemberForm: React.FC = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<MemberFormData>({
    resolver: zodResolver(MemberSchema),
  });

  const onSubmit = async (data: MemberFormData) => {
    setIsSubmitting(true);

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
        reset();
        setImagePreview(null);
      }
    } catch (error) {
      console.error("Error Posting Member: ", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploadingImage(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setIsUploadingImage(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full min-h-screen mx-auto p-24 bg-gray-800 text-white">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <motion.label
            className="block text-sm font-medium mb-1"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            Name
          </motion.label>
          <motion.input
            {...register("name")}
            className={`w-full p-3 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? "ring-2 ring-red-500" : ""}`}
            type="text"
            placeholder="Member's Name"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          />
          {errors.name && <span className="text-red-400 text-sm">{errors.name.message}</span>}
        </div>

        <div>
          <motion.label
            className="block text-sm font-medium mb-1"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            About
          </motion.label>
          <motion.textarea
            {...register("about")}
            className={`w-full p-3 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.about ? "ring-2 ring-red-500" : ""}`}
            placeholder="About the Member"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          />
          {errors.about && <span className="text-red-400 text-sm">{errors.about.message}</span>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <motion.label
              className="block text-sm font-medium mb-1"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Department
            </motion.label>
            <motion.select
              {...register("department")}
              className={`w-full p-3 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.department ? "ring-2 ring-red-500" : ""}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <option value="" disabled>Select Department</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept} Department
                </option>
              ))}
            </motion.select>
            {errors.department && <span className="text-red-400 text-sm">{errors.department.message}</span>}
          </div>

          <div>
            <motion.label
              className="block text-sm font-medium mb-1"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Position
            </motion.label>
            <motion.select
              {...register("position")}
              className={`w-full p-3 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.position ? "ring-2 ring-red-500" : ""}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <option value="" disabled>Select Position</option>
              {positions.map((pos) => (
                <option key={pos} value={pos}>
                  {pos}
                </option>
              ))}
            </motion.select>
            {errors.position && <span className="text-red-400 text-sm">{errors.position.message}</span>}
          </div>
        </div>

        <div>
          <motion.label
            className="block text-sm font-medium mb-1"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Social Links
          </motion.label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.input
              {...register("socialLinks.facebook")}
              className="w-full p-3 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              placeholder="Facebook"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            />
            <motion.input
              {...register("socialLinks.instagram")}
              className="w-full p-3 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              placeholder="Instagram"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            />
            <motion.input
              {...register("socialLinks.twitter")}
              className="w-full p-3 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              placeholder="Twitter"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.6 }}
            />
            <motion.input
              {...register("socialLinks.linkedIn")}
              className="w-full p-3 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              placeholder="LinkedIn"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.7 }}
            />
          </div>
        </div>

        <div>
          <motion.label
            className="block text-sm font-medium mb-1"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            Upload Image
          </motion.label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-700 cursor-pointer"
          />
          {isUploadingImage ? (
            <div className="mt-2 flex justify-center">
              <ClipLoader color="#ffffff" loading={true} size={35} />
            </div>
          ) : (
            imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-4 rounded-lg shadow-lg max-w-full h-auto"
              />
            )
          )}
        </div>

        <motion.button
          type="submit"
          className="w-full py-3 px-4 bg-green-500 rounded-md text-white font-semibold hover:bg-green-600 transition-colors duration-300"
          whileHover={{ scale: 0.99 }}
          whileTap={{ scale: 0.95 }}
        >
          {isSubmitting ? (
            <ClipLoader color="#ffffff" loading={true} size={24} />
          ) : (
            "Submit"
          )}
        </motion.button>
      </form>
    </div>
  );
};

export default MemberForm;
