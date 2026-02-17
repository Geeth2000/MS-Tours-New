import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { updateProfile } from "../services/authService.js";
import { handleApiError } from "../services/apiClient.js";
import { useAuthStore } from "../hooks/useAuthStore.js";
import uploadfile from "../utils/mediaUpload.js";

const ProfileEditModal = ({ isOpen, onClose }) => {
  const { user, updateUser } = useAuthStore();
  const [profilePreview, setProfilePreview] = useState(null);
  const [profileFile, setProfileFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm();

  // Initialize form with user data when modal opens
  useEffect(() => {
    if (isOpen && user) {
      reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
      });
      setProfilePreview(user.profileImage || null);
      setProfileFile(null);
    }
  }, [isOpen, user, reset]);

  const handleProfileImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setProfileFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProfileImage = () => {
    setProfileFile(null);
    setProfilePreview(null);
  };

  const onSubmit = async (formData) => {
    try {
      setIsUploading(true);

      // Upload new profile image if selected
      let profileImageUrl = user?.profileImage || null;
      if (profileFile) {
        profileImageUrl = await uploadfile(profileFile);
      } else if (!profilePreview) {
        // User removed the image
        profileImageUrl = "";
      }

      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone || "",
      };

      // Only include profileImage if it has a value or was explicitly cleared
      if (profileImageUrl || profileImageUrl === "") {
        payload.profileImage = profileImageUrl;
      }

      const updatedUser = await updateProfile(payload);

      // Update auth store with new user data
      updateUser(updatedUser);

      toast.success("Profile updated successfully!");
      onClose();
    } catch (err) {
      toast.error(handleApiError(err));
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-slate-900/5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">Edit Profile</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100 text-slate-500"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Profile Photo Section */}
          <div className="flex flex-col items-center gap-4 pb-4 border-b border-slate-100">
            {profilePreview ? (
              <div className="relative">
                <img
                  src={profilePreview}
                  alt="Profile preview"
                  className="h-24 w-24 rounded-full object-cover border-4 border-sky-100 shadow-lg"
                />
                <button
                  type="button"
                  onClick={removeProfileImage}
                  className="absolute -top-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white text-sm hover:bg-red-600 shadow-md"
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-dashed border-slate-200 bg-slate-50">
                <svg
                  className="h-10 w-10 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            )}
            <label className="cursor-pointer inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition shadow-sm">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {profilePreview ? "Change Photo" : "Upload Photo"}
              <input
                type="file"
                accept="image/*"
                onChange={handleProfileImageChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Name Fields */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                First Name
              </label>
              <input
                {...register("firstName", {
                  required: "First name is required",
                })}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:border-sky-300 focus:ring focus:ring-sky-100 transition"
                placeholder="First name"
              />
              {errors.firstName && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Last Name
              </label>
              <input
                {...register("lastName", { required: "Last name is required" })}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:border-sky-300 focus:ring focus:ring-sky-100 transition"
                placeholder="Last name"
              />
              {errors.lastName && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Email
            </label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address",
                },
              })}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:border-sky-300 focus:ring focus:ring-sky-100 transition"
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone Field */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Phone Number
            </label>
            <input
              {...register("phone")}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 focus:border-sky-300 focus:ring focus:ring-sky-100 transition"
              placeholder="Optional"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 bg-white py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="flex-1 rounded-xl bg-sky-500 py-3 text-sm font-bold text-white shadow-lg shadow-sky-500/30 hover:bg-sky-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting || isUploading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditModal;
