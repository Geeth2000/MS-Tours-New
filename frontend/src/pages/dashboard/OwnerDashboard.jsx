import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useConfirm } from "../../components/ConfirmModal.jsx";
import { useAuthStore } from "../../hooks/useAuthStore.js";
import {
  fetchMyVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from "../../services/vehicleService.js";
import {
  fetchMyPackages,
  createPackage,
  deletePackage,
} from "../../services/packageService.js";
import {
  fetchOwnerBookings,
  updateBookingStatus,
} from "../../services/bookingService.js";
import { handleApiError } from "../../services/apiClient.js";
import uploadfile from "../../utils/mediaUpload.js"; // Import the upload utility

const PACKAGE_FORM_DEFAULTS = {
  title: "",
  description: "",
  packageType: "dayTrip",
  durationDays: 1,
  pricePerGroup: "",
  pricePerPerson: "",
};

const OwnerDashboard = () => {
  const { user } = useAuthStore();
  const confirm = useConfirm();
  const [vehicles, setVehicles] = useState([]);
  const [packages, setPackages] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  // New state for file handling
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [showMobileForm, setShowMobileForm] = useState(false);
  const [showMobilePackageForm, setShowMobilePackageForm] = useState(false);

  const vehicleForm = useForm();
  const packageForm = useForm({ defaultValues: PACKAGE_FORM_DEFAULTS });
  const vehicleFormRef = useRef(null);

  const load = async () => {
    try {
      const [vehicleData, packageData, bookingData] = await Promise.all([
        fetchMyVehicles(),
        fetchMyPackages(),
        fetchOwnerBookings(),
      ]);
      setVehicles(vehicleData);
      setPackages(packageData);
      setBookings(bookingData);
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  useEffect(() => {
    load();
  }, []);

  // --- HANDLERS ---
  const onVehicleSubmit = vehicleForm.handleSubmit(async (formData) => {
    if (editingVehicle) {
      await handleVehicleUpdate(formData);
      return;
    }
    try {
      setIsUploading(true); // Start loading state
      let imageUrls = [];

      // 1. Upload Images to Supabase if files are selected
      if (selectedFiles && selectedFiles.length > 0) {
        const uploadPromises = Array.from(selectedFiles).map((file) =>
          uploadfile(file),
        );
        imageUrls = await Promise.all(uploadPromises);
      }

      // 2. Process features: convert comma-separated string to array
      let featuresArray = [];
      if (formData.features && typeof formData.features === "string") {
        featuresArray = formData.features
          .split(",")
          .map((f) => f.trim())
          .filter((f) => f.length > 0);
      }

      // 3. Prepare payload with the new image URLs and processed features
      const payload = {
        ...formData,
        images: imageUrls,
        features: featuresArray,
      };

      // 4. Send to backend
      await createVehicle(payload);

      // 5. Cleanup
      vehicleForm.reset();
      setSelectedFiles([]); // Clear selected files
      setShowMobileForm(false); // Hide mobile form after creation
      await load();
      toast.success("Vehicle added successfully!");
    } catch (err) {
      console.error(err);
      setError(handleApiError(err));
    } finally {
      setIsUploading(false); // Stop loading state
    }
  });

  const onPackageSubmit = packageForm.handleSubmit(async (formData) => {
    try {
      // Process array fields: includes, excludes, locations
      let includesArray = [];
      if (formData.includes && typeof formData.includes === "string") {
        includesArray = formData.includes
          .split(",")
          .map((i) => i.trim())
          .filter((i) => i.length > 0);
      }

      let excludesArray = [];
      if (formData.excludes && typeof formData.excludes === "string") {
        excludesArray = formData.excludes
          .split(",")
          .map((e) => e.trim())
          .filter((e) => e.length > 0);
      }

      let locationsArray = [];
      if (formData.locations && typeof formData.locations === "string") {
        locationsArray = formData.locations
          .split(",")
          .map((l) => l.trim())
          .filter((l) => l.length > 0);
      }

      const payload = {
        ...formData,
        includes: includesArray,
        excludes: excludesArray,
        locations: locationsArray,
      };

      await createPackage(payload);
      packageForm.reset(PACKAGE_FORM_DEFAULTS);
      setShowMobilePackageForm(false); // Hide mobile form after creation
      await load();
      toast.success("Package created successfully!");
    } catch (err) {
      setError(handleApiError(err));
    }
  });

  const handleVehicleDelete = async (id) => {
    const confirmed = await confirm({
      title: "Remove Vehicle",
      message:
        "Are you sure you want to remove this vehicle? This action cannot be undone.",
      confirmText: "Remove",
      variant: "danger",
    });
    if (!confirmed) return;
    try {
      await deleteVehicle(id);
      toast.success("Vehicle removed successfully");
      await load();
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  const handleVehicleEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setShowMobileForm(true); // Show form on mobile when editing
    // Pre-fill form with vehicle data
    vehicleForm.reset({
      title: vehicle.title,
      description: vehicle.description || "",
      type: vehicle.type,
      seatingCapacity: vehicle.seatingCapacity,
      make: vehicle.make || "",
      model: vehicle.model || "",
      year: vehicle.year || "",
      transmission: vehicle.transmission || "",
      fuelType: vehicle.fuelType || "",
      pricePerDay: vehicle.pricePerDay,
      "location.city": vehicle.location?.city || "",
      "location.district": vehicle.location?.district || "",
      features: vehicle.features?.join(", ") || "",
      status: vehicle.status || "active",
    });

    // Scroll to form and focus on first input
    setTimeout(() => {
      if (vehicleFormRef.current) {
        vehicleFormRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        // Focus on the first input field
        const firstInput = vehicleFormRef.current.querySelector(
          'input[name="title"]',
        );
        if (firstInput) {
          firstInput.focus();
        }
      }
    }, 100);
  };

  const handleVehicleUpdate = async (formData) => {
    try {
      setIsUploading(true);
      let imageUrls = [...(editingVehicle.images || [])];

      // Upload new images if selected
      if (selectedFiles && selectedFiles.length > 0) {
        const uploadPromises = Array.from(selectedFiles).map((file) =>
          uploadfile(file),
        );
        const newImageUrls = await Promise.all(uploadPromises);
        imageUrls = [...imageUrls, ...newImageUrls];
      }

      // Process features
      let featuresArray = [];
      if (formData.features && typeof formData.features === "string") {
        featuresArray = formData.features
          .split(",")
          .map((f) => f.trim())
          .filter((f) => f.length > 0);
      }

      const payload = {
        ...formData,
        images: imageUrls,
        features: featuresArray,
      };

      await updateVehicle(editingVehicle._id, payload);

      vehicleForm.reset();
      setSelectedFiles([]);
      setEditingVehicle(null);
      setShowMobileForm(false); // Hide mobile form after update
      await load();
      toast.success("Vehicle updated successfully!");
    } catch (err) {
      console.error(err);
      setError(handleApiError(err));
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingVehicle(null);
    vehicleForm.reset();
    setSelectedFiles([]);
    setShowMobileForm(false); // Hide mobile form on cancel
  };

  const handlePackageDelete = async (id) => {
    const confirmed = await confirm({
      title: "Delete Package",
      message:
        "Are you sure you want to delete this package? This action cannot be undone.",
      confirmText: "Delete",
      variant: "danger",
    });
    if (!confirmed) return;
    try {
      await deletePackage(id);
      toast.success("Package deleted successfully");
      await load();
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  const handleBookingStatus = async (id, status) => {
    try {
      await updateBookingStatus(id, { status });
      await load();
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  // --- STATS CALCULATIONS ---
  const totalEarnings = bookings
    .filter((b) => b.status === "confirmed" || b.status === "completed")
    .reduce((acc, b) => acc + (b.ownerEarnings || 0), 0);

  const pendingCount = bookings.filter((b) => b.status === "pending").length;

  return (
    <div className="flex flex-col gap-8 pb-12 font-sans text-slate-600">
      {/* 1. HERO HEADER */}
      <header className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-slate-900 to-slate-800 p-10 text-white shadow-xl">
        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Welcome, {user?.firstName || "Partner"}!
            </h1>
            <p className="mt-2 text-slate-400">
              Manage your Sri Lankan travel business efficiently.
            </p>
          </div>

          <div className="flex gap-4">
            <StatBadge
              label="Total Earnings"
              value={`LKR ${totalEarnings.toLocaleString()}`}
            />
            <StatBadge
              label="Pending Requests"
              value={pendingCount}
              highlight={pendingCount > 0}
            />
          </div>
        </div>
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-sky-500/20 blur-3xl" />
      </header>

      {error && (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-600 shadow-sm">
          {error}
        </div>
      )}

      {/* 2. NAVIGATION TABS */}
      <nav className="flex gap-8 border-b border-slate-200 px-4">
        {["overview", "bookings", "fleet", "packages"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative pb-4 text-sm font-semibold tracking-wide transition-colors ${
              activeTab === tab
                ? "text-sky-600"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 h-0.5 w-full bg-sky-500" />
            )}
          </button>
        ))}
      </nav>

      {/* 3. MAIN CONTENT AREA */}
      <main className="min-h-[500px]">
        {/* --- OVERVIEW TAB --- */}
        {activeTab === "overview" && (
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="grid gap-4 sm:grid-cols-2 lg:col-span-3">
              <InfoCard
                title="Total Vehicles"
                value={vehicles.length}
                icon="🚗"
                color="bg-blue-50 text-blue-600"
              />
              <InfoCard
                title="Active Packages"
                value={packages.length}
                icon="📦"
                color="bg-emerald-50 text-emerald-600"
              />
              <InfoCard
                title="Total Bookings"
                value={bookings.length}
                icon="📅"
                color="bg-purple-50 text-purple-600"
              />
              <InfoCard
                title="Rating"
                value="4.8"
                icon="⭐"
                color="bg-amber-50 text-amber-600"
              />
            </div>

            <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm lg:col-span-2">
              <h3 className="mb-6 text-lg font-bold text-slate-800">
                Recent Activity
              </h3>
              <div className="space-y-4">
                {bookings.length === 0 && (
                  <p className="text-slate-400">No recent activity found.</p>
                )}
                {bookings.slice(0, 5).map((booking) => (
                  <BookingRow
                    key={booking._id}
                    booking={booking}
                    onAction={handleBookingStatus}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-sky-500 to-blue-600 p-8 text-white shadow-lg">
              <div className="mb-4 text-3xl">✨</div>
              <h3 className="text-xl font-bold">AI Assistant</h3>
              <p className="mt-2 text-sky-100 opacity-90">
                "Tourists are looking for <strong>Ella</strong> trips. Consider
                adding a van package!"
              </p>
            </div>
          </div>
        )}

        {/* --- BOOKINGS TAB --- */}
        {activeTab === "bookings" && (
          <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
            <h3 className="mb-6 text-xl font-bold text-slate-800">
              Booking Management
            </h3>
            <div className="space-y-4">
              {bookings.length === 0 && (
                <p className="text-slate-400 py-10 text-center">
                  No bookings yet.
                </p>
              )}
              {bookings.map((booking) => (
                <BookingRow
                  key={booking._id}
                  booking={booking}
                  onAction={handleBookingStatus}
                />
              ))}
            </div>
          </div>
        )}

        {/* --- FLEET TAB (Updated with Supabase Image Upload) --- */}
        {activeTab === "fleet" && (
          <div className="space-y-4">
            {/* Mobile Add Button - Only visible on small screens */}
            <div className="lg:hidden">
              <button
                onClick={() => setShowMobileForm(!showMobileForm)}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 px-6 py-4 font-bold text-white shadow-lg transition hover:shadow-xl"
              >
                <span className="text-xl">{showMobileForm ? "✕" : "+"}</span>
                <span>
                  {showMobileForm
                    ? "Close Form"
                    : editingVehicle
                      ? "Edit Vehicle"
                      : "Add Vehicle"}
                </span>
              </button>
            </div>

            <div className="grid gap-8 lg:grid-cols-12">
              {/* Add Form */}
              <div
                className={`lg:col-span-4 ${
                  showMobileForm ? "block" : "hidden lg:block"
                }`}
                ref={vehicleFormRef}
              >
                <div className="sticky top-24 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm max-h-[85vh] overflow-y-auto">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-800">
                      {editingVehicle ? "Edit Vehicle" : "Add Vehicle"}
                    </h3>
                    {editingVehicle && (
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="text-sm text-slate-500 hover:text-slate-700"
                      >
                        ✕ Cancel
                      </button>
                    )}
                  </div>
                  <form onSubmit={onVehicleSubmit} className="space-y-4">
                    {/* Basic Information */}
                    <div className="rounded-2xl bg-slate-50 p-4 space-y-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                        Basic Information
                      </p>
                      <InputGroup
                        label="Vehicle Name *"
                        register={vehicleForm.register("title", {
                          required: true,
                        })}
                        placeholder="e.g., Toyota Axio 2018"
                      />
                      <TextAreaGroup
                        label="Description"
                        register={vehicleForm.register("description")}
                        placeholder="Describe your vehicle, its condition, and any special features..."
                      />
                    </div>

                    {/* Vehicle Specifications */}
                    <div className="rounded-2xl bg-slate-50 p-4 space-y-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                        Specifications
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <SelectGroup
                          label="Type *"
                          register={vehicleForm.register("type", {
                            required: true,
                          })}
                          options={[
                            "car",
                            "van",
                            "suv",
                            "bus",
                            "jeep",
                            "tuk",
                            "other",
                          ]}
                        />
                        <InputGroup
                          label="Seats *"
                          type="number"
                          register={vehicleForm.register("seatingCapacity", {
                            required: true,
                            min: 1,
                          })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <InputGroup
                          label="Make"
                          register={vehicleForm.register("make")}
                          placeholder="e.g., Toyota"
                        />
                        <InputGroup
                          label="Model"
                          register={vehicleForm.register("model")}
                          placeholder="e.g., Axio"
                        />
                      </div>
                      <InputGroup
                        label="Year"
                        type="number"
                        register={vehicleForm.register("year", {
                          min: 1990,
                          max: new Date().getFullYear() + 1,
                        })}
                        placeholder="e.g., 2018"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <SelectGroup
                          label="Transmission"
                          register={vehicleForm.register("transmission")}
                          options={["", "manual", "automatic"]}
                          placeholder="Select..."
                        />
                        <SelectGroup
                          label="Fuel Type"
                          register={vehicleForm.register("fuelType")}
                          options={[
                            "",
                            "petrol",
                            "diesel",
                            "hybrid",
                            "electric",
                          ]}
                          placeholder="Select..."
                        />
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="rounded-2xl bg-slate-50 p-4 space-y-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                        Pricing
                      </p>
                      <InputGroup
                        label="Daily Rate (LKR) *"
                        type="number"
                        register={vehicleForm.register("pricePerDay", {
                          required: true,
                          min: 0,
                        })}
                        placeholder="e.g., 8000"
                      />
                    </div>

                    {/* Location */}
                    <div className="rounded-2xl bg-slate-50 p-4 space-y-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                        Location
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <InputGroup
                          label="City"
                          register={vehicleForm.register("location.city")}
                          placeholder="e.g., Colombo"
                        />
                        <InputGroup
                          label="District"
                          register={vehicleForm.register("location.district")}
                          placeholder="e.g., Western"
                        />
                      </div>
                    </div>

                    {/* Features */}
                    <div className="rounded-2xl bg-slate-50 p-4 space-y-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                        Features & Amenities
                      </p>
                      <TextAreaGroup
                        label="Features (comma-separated)"
                        register={vehicleForm.register("features")}
                        placeholder="e.g., Air Conditioning, GPS, WiFi, Child Seats"
                      />
                      <p className="text-xs text-slate-500">
                        Separate each feature with a comma
                      </p>
                    </div>

                    {/* Status */}
                    <div className="rounded-2xl bg-slate-50 p-4 space-y-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                        Status
                      </p>
                      <SelectGroup
                        label="Vehicle Status"
                        register={vehicleForm.register("status")}
                        options={["active", "inactive", "maintenance"]}
                      />
                    </div>

                    {/* SUPABASE FILE UPLOAD INPUT */}
                    <div className="rounded-2xl bg-slate-50 p-4 space-y-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                        Images
                      </p>
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-700">
                          Vehicle Images
                        </label>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => setSelectedFiles(e.target.files)}
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 file:mr-4 file:rounded-full file:border-0 file:bg-sky-50 file:px-4 file:py-2 file:text-sm file:font-bold file:text-sky-700 hover:file:bg-sky-100 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
                        />
                        <p className="mt-1 text-xs text-slate-400">
                          Select multiple images. (Max 5 recommended)
                        </p>
                      </div>
                    </div>

                    <SubmitButton
                      label={
                        isUploading
                          ? "Uploading Images..."
                          : editingVehicle
                            ? "Update Vehicle"
                            : "Add Vehicle"
                      }
                      disabled={isUploading}
                    />
                  </form>
                </div>
              </div>

              {/* List */}
              <div className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
                {vehicles.map((v) => (
                  <ItemCard
                    key={v._id}
                    title={v.title}
                    subtitle={`${v.type.toUpperCase()} • ${v.seatingCapacity} Seats`}
                    price={v.pricePerDay}
                    image={v.images?.[0]}
                    onDelete={() => handleVehicleDelete(v._id)}
                    onEdit={() => handleVehicleEdit(v)}
                    type="vehicle"
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --- PACKAGES TAB --- */}
        {activeTab === "packages" && (
          <div className="space-y-4">
            {/* Mobile Add Button - Only visible on small screens */}
            <div className="lg:hidden">
              <button
                onClick={() => setShowMobilePackageForm(!showMobilePackageForm)}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4 font-bold text-white shadow-lg transition hover:shadow-xl"
              >
                <span className="text-xl">
                  {showMobilePackageForm ? "✕" : "+"}
                </span>
                <span>
                  {showMobilePackageForm ? "Close Form" : "Add Package"}
                </span>
              </button>
            </div>

            <div className="grid gap-8 lg:grid-cols-12">
              {/* Add Form */}
              <div
                className={`lg:col-span-4 ${
                  showMobilePackageForm ? "block" : "hidden lg:block"
                }`}
              >
                <div className="sticky top-24 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm max-h-[85vh] overflow-y-auto">
                  <h3 className="mb-4 text-lg font-bold text-slate-800">
                    Create Package
                  </h3>
                  <form onSubmit={onPackageSubmit} className="space-y-4">
                    {/* Basic Information */}
                    <div className="rounded-2xl bg-slate-50 p-4 space-y-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                        Basic Information
                      </p>
                      <InputGroup
                        label="Package Title *"
                        register={packageForm.register("title", {
                          required: true,
                        })}
                        placeholder="e.g., Kandy Day Tour"
                      />
                      <TextAreaGroup
                        label="Description / Itinerary *"
                        register={packageForm.register("description", {
                          required: true,
                        })}
                        placeholder="Describe the tour package, itinerary, and highlights..."
                      />
                    </div>

                    {/* Package Details */}
                    <div className="rounded-2xl bg-slate-50 p-4 space-y-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                        Package Details
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <SelectGroup
                          label="Package Type *"
                          register={packageForm.register("packageType", {
                            required: true,
                          })}
                          options={[
                            "dayTrip",
                            "multiDay",
                            "adventure",
                            "cultural",
                            "wildlife",
                            "relaxation",
                            "custom",
                          ]}
                        />
                        <InputGroup
                          label="Duration (Days) *"
                          type="number"
                          register={packageForm.register("durationDays", {
                            required: true,
                            min: 1,
                          })}
                        />
                      </div>
                      <TextAreaGroup
                        label="Locations (comma-separated)"
                        register={packageForm.register("locations")}
                        placeholder="e.g., Kandy, Sigiriya, Dambulla"
                      />
                      <p className="text-xs text-slate-500">
                        List all destinations included in this package
                      </p>
                    </div>

                    {/* Pricing */}
                    <div className="rounded-2xl bg-slate-50 p-4 space-y-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                        Pricing
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <InputGroup
                          label="Price Per Group (LKR)"
                          type="number"
                          register={packageForm.register("pricePerGroup")}
                          placeholder="e.g., 25000"
                        />
                        <InputGroup
                          label="Price Per Person (LKR)"
                          type="number"
                          register={packageForm.register("pricePerPerson")}
                          placeholder="e.g., 5000"
                        />
                      </div>
                      <p className="text-xs text-slate-500">
                        Set at least one pricing option
                      </p>
                    </div>

                    {/* What's Included */}
                    <div className="rounded-2xl bg-slate-50 p-4 space-y-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                        What's Included
                      </p>
                      <TextAreaGroup
                        label="Includes (comma-separated)"
                        register={packageForm.register("includes")}
                        placeholder="e.g., Hotel accommodation, Breakfast, Entrance fees, Guide"
                      />
                      <TextAreaGroup
                        label="Excludes (comma-separated)"
                        register={packageForm.register("excludes")}
                        placeholder="e.g., Lunch, Dinner, Personal expenses"
                      />
                      <p className="text-xs text-slate-500">
                        Separate each item with a comma
                      </p>
                    </div>

                    {/* Optional Vehicle */}
                    <div className="rounded-2xl bg-slate-50 p-4 space-y-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                        Vehicle (Optional)
                      </p>
                      <div>
                        <label className="mb-1 block text-xs font-bold uppercase text-slate-400">
                          Assign Vehicle
                        </label>
                        <select
                          {...packageForm.register("vehicle")}
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
                        >
                          <option value="">No vehicle assigned</option>
                          {vehicles.map((v) => (
                            <option key={v._id} value={v._id}>
                              {v.title} ({v.type} - {v.seatingCapacity} seats)
                            </option>
                          ))}
                        </select>
                      </div>
                      <p className="text-xs text-slate-500">
                        Link a vehicle from your fleet if applicable
                      </p>
                    </div>

                    {/* Status */}
                    <div className="rounded-2xl bg-slate-50 p-4 space-y-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                        Status
                      </p>
                      <SelectGroup
                        label="Package Status"
                        register={packageForm.register("status")}
                        options={["draft", "pending", "published", "archived"]}
                      />
                    </div>

                    <SubmitButton label="Create Package" />
                  </form>
                </div>
              </div>

              {/* List */}
              <div className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
                {packages.map((p) => (
                  <ItemCard
                    key={p._id}
                    title={p.title}
                    subtitle={`${p.packageType} • ${p.durationDays} Days`}
                    price={p.pricePerGroup || p.pricePerPerson}
                    isGroup={!!p.pricePerGroup}
                    onDelete={() => handlePackageDelete(p._id)}
                    type="package"
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// --- SUB-COMPONENTS ---
const StatBadge = ({ label, value, highlight }) => (
  <div
    className={`rounded-2xl p-4 backdrop-blur-md ${highlight ? "bg-white text-sky-600" : "bg-white/10 text-white"}`}
  >
    <p className="text-xs font-medium uppercase tracking-wider opacity-80">
      {label}
    </p>
    <p className="mt-1 text-xl font-bold">{value}</p>
  </div>
);

const InfoCard = ({ title, value, icon, color }) => (
  <div className="flex items-center gap-4 rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md">
    <div
      className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${color}`}
    >
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-slate-400">{title}</p>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
    </div>
  </div>
);

const BookingRow = ({ booking, onAction }) => {
  const isPending = booking.status === "pending";
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-50 bg-slate-50/50 p-5 transition hover:bg-white hover:shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide 
            ${
              booking.status === "confirmed"
                ? "bg-emerald-100 text-emerald-700"
                : booking.status === "pending"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-slate-200 text-slate-600"
            }`}
          >
            {booking.status}
          </span>
          <span className="text-xs text-slate-400">
            #{booking._id.slice(-6)}
          </span>
        </div>
        <h4 className="mt-1 font-bold text-slate-800">
          {booking.user?.firstName} {booking.user?.lastName}
        </h4>
        <p className="text-xs text-slate-500">
          {new Date(booking.startDate).toLocaleDateString()} —{" "}
          {booking.vehicle?.title || booking.package?.title}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-xs font-semibold text-slate-400">Earnings</p>
          <p className="font-bold text-slate-800">
            LKR {booking.ownerEarnings?.toLocaleString()}
          </p>
        </div>
        {isPending && (
          <div className="flex gap-2">
            <button
              onClick={() => onAction(booking._id, "confirmed")}
              className="rounded-xl bg-emerald-500 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-600"
            >
              ✓
            </button>
            <button
              onClick={() => onAction(booking._id, "cancelled")}
              className="rounded-xl bg-rose-500 px-3 py-2 text-xs font-bold text-white hover:bg-rose-600"
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const ItemCard = ({
  title,
  subtitle,
  price,
  isGroup,
  onDelete,
  onEdit,
  type,
  image,
}) => (
  <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition hover:border-sky-100 hover:shadow-md">
    {/* Image Display */}
    {image ? (
      <div className="h-40 w-full overflow-hidden bg-slate-100">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />
      </div>
    ) : (
      <div className="h-40 w-full flex items-center justify-center bg-slate-50 text-slate-300">
        <span className="text-4xl">{type === "vehicle" ? "🚗" : "📦"}</span>
      </div>
    )}

    <div className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-bold text-slate-800">{title}</h4>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-slate-50 pt-4">
        <div>
          <p className="text-xs text-slate-400">Price</p>
          <p className="font-bold text-sky-600">
            LKR {price?.toLocaleString()}{" "}
            <span className="text-[10px] text-slate-400 font-normal">
              {isGroup ? "/group" : type === "vehicle" ? "/day" : "/person"}
            </span>
          </p>
        </div>
        <div className="flex gap-2">
          {onEdit && (
            <button
              onClick={onEdit}
              className="rounded-lg bg-sky-50 px-3 py-1.5 text-xs font-bold text-sky-600 hover:bg-sky-100"
            >
              Edit
            </button>
          )}
          <button
            onClick={onDelete}
            className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-bold text-red-500 hover:bg-red-100"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
);

const InputGroup = ({ label, register, type = "text", placeholder }) => (
  <div>
    <label className="mb-1 block text-xs font-bold uppercase text-slate-400">
      {label}
    </label>
    <input
      type={type}
      {...register}
      placeholder={placeholder}
      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
    />
  </div>
);

const TextAreaGroup = ({ label, register, placeholder }) => (
  <div>
    <label className="mb-1 block text-xs font-bold uppercase text-slate-400">
      {label}
    </label>
    <textarea
      {...register}
      placeholder={placeholder}
      rows={3}
      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
    />
  </div>
);

const SelectGroup = ({ label, register, options, placeholder }) => (
  <div>
    <label className="mb-1 block text-xs font-bold uppercase text-slate-400">
      {label}
    </label>
    <select
      {...register}
      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(
        (opt) =>
          opt !== "" && (
            <option key={opt} value={opt}>
              {opt.charAt(0).toUpperCase() + opt.slice(1)}
            </option>
          ),
      )}
    </select>
  </div>
);

const SubmitButton = ({ label, disabled }) => (
  <button
    type="submit"
    disabled={disabled}
    className="mt-2 w-full rounded-xl bg-sky-500 py-3 text-sm font-bold text-white shadow-lg shadow-sky-200 transition hover:bg-sky-600 hover:shadow-sky-300 disabled:bg-slate-300 disabled:shadow-none"
  >
    {label}
  </button>
);

export default OwnerDashboard;
