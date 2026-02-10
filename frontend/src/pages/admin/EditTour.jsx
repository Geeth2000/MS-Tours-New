import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { fetchTourById, updateTour } from "../../services/tourService.js";
import { handleApiError } from "../../services/apiClient.js";
import uploadfile from "../../utils/mediaUpload.js";

const EditTour = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [existingImages, setExistingImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm();

  // Fetch tour data on mount
  useEffect(() => {
    const loadTour = async () => {
      try {
        const tour = await fetchTourById(id);
        // Pre-populate form with existing data
        reset({
          title: tour.title,
          category: tour.category,
          durationDays: tour.durationDays,
          pricePerPerson: tour.pricePerPerson,
          description: tour.description,
          locations: tour.locations?.join(", ") || "",
          highlights: tour.highlights?.join(", ") || "",
          includes: tour.includes?.join(", ") || "",
          isFeatured: tour.isFeatured,
        });
        setExistingImages(tour.galleryImages || []);
      } catch (err) {
        console.error(err);
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };
    loadTour();
  }, [id, reset]);

  const onSubmit = async (data) => {
    try {
      setIsUploading(true);

      // Upload new images if any
      let uploadedImageUrls = [];
      if (selectedFiles && selectedFiles.length > 0) {
        const uploadPromises = Array.from(selectedFiles).map((file) =>
          uploadfile(file),
        );
        uploadedImageUrls = await Promise.all(uploadPromises);
      }

      // Combine existing and new images
      const allImages = [...existingImages, ...uploadedImageUrls];

      const payload = {
        ...data,
        locations: data.locations.split(",").map((item) => item.trim()),
        highlights: data.highlights.split(",").map((item) => item.trim()),
        includes: data.includes.split(",").map((item) => item.trim()),
        galleryImages: allImages,
        durationDays: Number(data.durationDays),
        pricePerPerson: Number(data.pricePerPerson),
      };

      await updateTour(id, payload);
      toast.success("Tour updated successfully!");
      navigate("/admin/dashboard");
    } catch (err) {
      console.error(err);
      setError(handleApiError(err));
    } finally {
      setIsUploading(false);
    }
  };

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-sky-500 border-t-transparent" />
          <p className="mt-4 text-slate-500">Loading tour data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="mb-8 text-3xl font-bold text-slate-800">Edit Tour</h1>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 rounded-3xl bg-white p-8 shadow-soft"
      >
        {/* Basic Info */}
        <div className="grid gap-6 md:grid-cols-2">
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

        <div className="grid gap-6 md:grid-cols-2">
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

        {/* Existing Images */}
        {existingImages.length > 0 && (
          <div>
            <span className="text-sm font-bold text-slate-700">
              Current Images
            </span>
            <div className="mt-2 flex flex-wrap gap-3">
              {existingImages.map((url, index) => (
                <div key={index} className="group relative">
                  <img
                    src={url}
                    alt={`Tour image ${index + 1}`}
                    className="h-20 w-20 rounded-lg object-cover shadow"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(index)}
                    className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white opacity-0 transition group-hover:opacity-100"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New Image Upload */}
        <label className="block">
          <span className="text-sm font-bold text-slate-700">
            Add New Images (Select multiple)
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
            className="h-5 w-5 text-primary"
          />
          <span className="text-sm font-bold text-slate-700">
            Feature on Home Page?
          </span>
        </label>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate("/admin/dashboard")}
            className="flex-1 rounded-xl border-2 border-slate-200 py-3 font-bold text-slate-600 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            disabled={isSubmitting || isUploading}
            className="flex-1 rounded-xl bg-sky-500 py-3 font-bold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:bg-sky-300"
          >
            {isUploading
              ? "Uploading Images..."
              : isSubmitting
                ? "Saving..."
                : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTour;
