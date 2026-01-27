import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { createTour } from "../../services/tourService.js";
import { handleApiError } from "../../services/apiClient.js";
import { useState } from "react";
import uploadfile from "../../utils/mediaUpload.js"; // Import the upload utility

const AddTour = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  // New state for file handling
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setIsUploading(true);

      // 1. Upload Images to Supabase
      let uploadedImageUrls = [];
      if (selectedFiles && selectedFiles.length > 0) {
        const uploadPromises = Array.from(selectedFiles).map((file) =>
          uploadfile(file),
        );
        uploadedImageUrls = await Promise.all(uploadPromises);
      }

      // 2. Prepare Payload
      // Note: We use the uploaded URLs array directly for galleryImages
      const payload = {
        ...data,
        locations: data.locations.split(",").map((item) => item.trim()),
        highlights: data.highlights.split(",").map((item) => item.trim()),
        includes: data.includes.split(",").map((item) => item.trim()),
        galleryImages: uploadedImageUrls,
        // Ensure numbers are numbers
        durationDays: Number(data.durationDays),
        pricePerPerson: Number(data.pricePerPerson),
      };

      // 3. Send to Backend
      await createTour(payload);
      alert("Tour created successfully!");
      navigate("/admin/dashboard");
    } catch (err) {
      console.error(err);
      setError(handleApiError(err));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Add New Tour</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 bg-white p-8 rounded-3xl shadow-soft"
      >
        {/* Basic Info */}
        <div className="grid md:grid-cols-2 gap-6">
          <label className="block">
            <span className="text-sm font-bold text-slate-700">Tour Title</span>
            <input
              {...register("title", { required: true })}
              className="input-field mt-1 w-full rounded-xl border p-2"
              placeholder="e.g. Magic of Sri Lanka"
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-slate-700">Category</span>
            <select
              {...register("category", { required: true })}
              className="input-field mt-1 w-full rounded-xl border p-2"
            >
              <option value="culture">Culture</option>
              <option value="beach">Beach</option>
              <option value="wildlife">Wildlife</option>
              <option value="adventure">Adventure</option>
              <option value="nature">Nature</option>
            </select>
          </label>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <label className="block">
            <span className="text-sm font-bold text-slate-700">
              Duration (Days)
            </span>
            <input
              type="number"
              {...register("durationDays", { required: true })}
              className="input-field mt-1 w-full rounded-xl border p-2"
            />
          </label>
          <label className="block">
            <span className="text-sm font-bold text-slate-700">
              Price (LKR)
            </span>
            <input
              type="number"
              {...register("pricePerPerson", { required: true })}
              className="input-field mt-1 w-full rounded-xl border p-2"
            />
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-bold text-slate-700">Description</span>
          <textarea
            {...register("description", { required: true })}
            rows="4"
            className="input-field mt-1 w-full rounded-xl border p-2"
          />
        </label>

        {/* Arrays handled as CSV */}
        <label className="block">
          <span className="text-sm font-bold text-slate-700">
            Locations (comma separated)
          </span>
          <input
            {...register("locations")}
            className="input-field mt-1 w-full rounded-xl border p-2"
            placeholder="Kandy, Nuwara Eliya, Ella"
          />
        </label>

        <label className="block">
          <span className="text-sm font-bold text-slate-700">
            Highlights (comma separated)
          </span>
          <input
            {...register("highlights")}
            className="input-field mt-1 w-full rounded-xl border p-2"
            placeholder="Temple of Tooth, Train Ride, Hiking"
          />
        </label>

        <label className="block">
          <span className="text-sm font-bold text-slate-700">
            What's Included (comma separated)
          </span>
          <input
            {...register("includes")}
            className="input-field mt-1 w-full rounded-xl border p-2"
            placeholder="Transport, Hotels, Breakfast"
          />
        </label>

        {/* UPDATED: Image Upload Section */}
        <label className="block">
          <span className="text-sm font-bold text-slate-700">
            Tour Images (Select multiple)
          </span>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setSelectedFiles(e.target.files)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-bold file:text-blue-700 hover:file:bg-blue-100"
          />
          <p className="mt-1 text-xs text-slate-500">
            Recommended: High-quality landscape images.
          </p>
        </label>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            {...register("isFeatured")}
            className="w-5 h-5 text-primary"
          />
          <span className="text-sm font-bold text-slate-700">
            Feature on Home Page?
          </span>
        </label>

        <button
          disabled={isSubmitting || isUploading}
          className="w-full btn-primary py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          {isUploading
            ? "Uploading Images..."
            : isSubmitting
              ? "Creating..."
              : "Create Tour"}
        </button>
      </form>
    </div>
  );
};

export default AddTour;
