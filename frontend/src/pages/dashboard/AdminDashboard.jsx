import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useConfirm } from "../../components/ConfirmModal.jsx";
import StatCard from "../../components/StatCard.jsx";
import {
  fetchAdminSummary,
  fetchUsers,
  deleteUser,
  deleteTour,
  deleteVehicleAdmin,
  deletePackageAdmin,
  fetchCustomRequests,
  updateCustomRequestStatus,
  deleteCustomRequest,
} from "../../services/adminService.js";
import { fetchPackages } from "../../services/packageService.js";
import { fetchTours } from "../../services/tourService.js";
import { fetchVehicles } from "../../services/vehicleService.js";
import {
  fetchAllBookings,
  updateBookingStatus,
} from "../../services/bookingService.js";
import { handleApiError } from "../../services/apiClient.js";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const confirm = useConfirm();
  const [activeTab, setActiveTab] = useState("overview");
  const [summary, setSummary] = useState(null);

  // Data States
  const [users, setUsers] = useState([]);
  const [tours, setTours] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [packages, setPackages] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [customRequests, setCustomRequests] = useState([]); // Customer trip requests

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- DATA LOADING ---

  const loadOverview = async () => {
    try {
      const summaryData = await fetchAdminSummary();
      setSummary(summaryData);
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  const loadTabData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (activeTab === "users") {
        const data = await fetchUsers();
        setUsers(data);
      } else if (activeTab === "tours") {
        const res = await fetchTours({ limit: 100 });
        setTours(res.data);
      } else if (activeTab === "vehicles") {
        const res = await fetchVehicles({ limit: 100 });
        setVehicles(res.data);
      } else if (activeTab === "packages") {
        const res = await fetchPackages({ limit: 100 });
        setPackages(res.data);
      } else if (activeTab === "bookings") {
        const res = await fetchAllBookings({ limit: 100 });
        setBookings(res.data);
      } else if (activeTab === "requests") {
        const res = await fetchCustomRequests({ limit: 100 });
        setCustomRequests(res);
      }
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  // Initial Load
  useEffect(() => {
    loadOverview();
  }, []);

  // Reload when tab changes
  useEffect(() => {
    if (activeTab !== "overview") {
      loadTabData();
    }
  }, [activeTab]);

  // --- ACTIONS ---

  const handleDelete = async (type, id) => {
    const confirmed = await confirm({
      title: `Delete ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      message: `Are you sure you want to delete this ${type}? This action cannot be undone.`,
      confirmText: "Delete",
      variant: "danger",
    });
    if (!confirmed) return;

    try {
      if (type === "user") await deleteUser(id);
      if (type === "tour") await deleteTour(id);
      if (type === "vehicle") await deleteVehicleAdmin(id);
      if (type === "package") await deletePackageAdmin(id);
      if (type === "request") await deleteCustomRequest(id);

      toast.success(
        `${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`,
      );
      await loadTabData();
      await loadOverview();
    } catch (err) {
      toast.error(handleApiError(err));
    }
  };

  // Change Booking Status (Approve/Reject)
  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateBookingStatus(id, { status: newStatus });
      // Update UI (Optimistic update without API call)
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: newStatus } : b)),
      );
    } catch (err) {
      toast.error(handleApiError(err));
    }
  };

  // Custom Request Status change
  const handleRequestStatusChange = async (id, newStatus) => {
    try {
      await updateCustomRequestStatus(id, { status: newStatus });
      setCustomRequests((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: newStatus } : r)),
      );
    } catch (err) {
      toast.error(handleApiError(err));
    }
  };

  const handleEditTour = (id) => {
    navigate(`/admin/tours/edit/${id}`);
  };

  return (
    <div className="flex flex-col gap-6 pb-12 font-sans text-slate-600 sm:gap-8">
      {/* 1. Header Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white shadow-xl sm:rounded-[2rem] sm:p-8">
        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Admin Control Center
            </h1>
            <p className="mt-2 text-sm text-slate-300 opacity-90 sm:text-base">
              Manage users, listings, bookings, and platform resources.
            </p>
          </div>
          <button
            onClick={() => navigate("/admin/add-tour")}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-sky-900/20 transition-all hover:scale-105 hover:bg-sky-400 md:w-auto"
          >
            <span>+ Create New Tour</span>
          </button>
        </div>
        <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute bottom-10 left-10 h-32 w-32 rounded-full bg-blue-500/10 blur-2xl" />
      </div>

      {error && (
        <div className="flex items-center justify-between rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-600 shadow-sm">
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="font-bold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 2. Navigation Tabs */}
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:border-b sm:border-slate-200 sm:px-0">
        {[
          "overview",
          "bookings",
          "requests", // Customer trip requests
          "users",
          "tours",
          "vehicles",
          "packages",
        ].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap rounded-full px-6 py-2.5 text-sm font-bold capitalize transition-all sm:rounded-none sm:rounded-t-xl sm:py-3 ${
              activeTab === tab
                ? "border-t border-x border-slate-200 bg-slate-800 text-white shadow-md sm:bg-white sm:text-sky-600 sm:shadow-[0_-1px_2px_rgba(0,0,0,0.05)]"
                : "bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 3. Content Area */}
      {loading && activeTab !== "overview" ? (
        <div className="flex h-64 items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50">
          <p className="text-slate-400">Loading data...</p>
        </div>
      ) : (
        <>
          {/* OVERVIEW TAB */}
          {activeTab === "overview" && summary && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
              <StatCard
                icon="👥"
                label="Total Users"
                value={summary.totalUsers}
              />
              <StatCard
                icon="📅"
                label="Bookings"
                value={bookings.length > 0 ? bookings.length : "-"} // Optional: Better if backend sends totalBookings
              />
              <StatCard
                icon="🗺️"
                label="Active Tours"
                value={summary.totalTours}
              />
              <StatCard
                icon="💰"
                label="Revenue"
                value={`LKR ${summary.totalRevenue?.toLocaleString()}`}
              />
            </div>
          )}

          {/* --- NEW: BOOKINGS TAB --- */}
          {activeTab === "bookings" && (
            <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
              <Table
                headers={[
                  "Reference",
                  "User",
                  "Item",
                  "Date",
                  "Amount",
                  "Status",
                ]}
              >
                {bookings.length === 0 && <EmptyRow colSpan={6} />}
                {bookings.map((booking) => (
                  <tr
                    key={booking._id}
                    className="border-b border-slate-50 transition hover:bg-slate-50/50"
                  >
                    <td className="p-4">
                      <span className="font-mono text-xs font-bold text-slate-500">
                        {booking.referenceCode}
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="text-sm font-bold text-slate-700">
                        {booking.user?.firstName}
                      </p>
                      <p className="text-xs text-slate-400">
                        {booking.user?.email}
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm font-medium text-slate-700">
                        {booking.tour?.title ||
                          booking.vehicle?.title ||
                          booking.package?.title ||
                          "Unknown Item"}
                      </p>
                      <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                        {booking.tour
                          ? "Tour"
                          : booking.vehicle
                            ? "Vehicle"
                            : "Package"}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-500">
                      {new Date(booking.startDate).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-sm font-bold text-slate-700">
                      LKR {booking.totalPrice?.toLocaleString()}
                    </td>
                    <td className="p-4">
                      <select
                        value={booking.status}
                        onChange={(e) =>
                          handleStatusChange(booking._id, e.target.value)
                        }
                        className={`rounded-lg border-0 px-3 py-1.5 text-xs font-bold uppercase ring-1 ring-inset ${
                          booking.status === "confirmed" ||
                          booking.status === "completed"
                            ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
                            : booking.status === "cancelled"
                              ? "bg-red-50 text-red-700 ring-red-600/10"
                              : "bg-amber-50 text-amber-700 ring-amber-600/20"
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </Table>
            </div>
          )}

          {/* CUSTOMER REQUESTS TAB */}
          {activeTab === "requests" && (
            <div className="space-y-6">
              {/* Header Stats */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 p-5 border border-amber-100">
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-600">
                    Pending
                  </p>
                  <p className="mt-1 text-2xl font-bold text-amber-700">
                    {
                      customRequests.filter((r) => r.status === "pending")
                        .length
                    }
                  </p>
                </div>
                <div className="rounded-2xl bg-gradient-to-br from-sky-50 to-blue-50 p-5 border border-sky-100">
                  <p className="text-xs font-bold uppercase tracking-wider text-sky-600">
                    In Progress
                  </p>
                  <p className="mt-1 text-2xl font-bold text-sky-700">
                    {
                      customRequests.filter((r) => r.status === "inProgress")
                        .length
                    }
                  </p>
                </div>
                <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 p-5 border border-emerald-100">
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                    Completed
                  </p>
                  <p className="mt-1 text-2xl font-bold text-emerald-700">
                    {
                      customRequests.filter((r) => r.status === "completed")
                        .length
                    }
                  </p>
                </div>
              </div>

              {/* Requests List */}
              <div className="space-y-4">
                {customRequests.length === 0 && (
                  <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 py-16 text-center">
                    <span className="text-4xl mb-4">📋</span>
                    <p className="text-slate-500">
                      No custom trip requests yet.
                    </p>
                  </div>
                )}
                {customRequests.map((request) => (
                  <div
                    key={request._id}
                    className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:shadow-md"
                  >
                    {/* Request Header */}
                    <div className="flex flex-col gap-4 border-b border-slate-50 bg-gradient-to-r from-slate-50 to-white p-5 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-xl">
                          🗺️
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                              Trip Request
                            </span>
                            <RequestStatusBadge status={request.status} />
                          </div>
                          <p className="font-bold text-slate-800">
                            {request.user?.firstName} {request.user?.lastName}
                          </p>
                          <p className="text-xs text-slate-500">
                            {request.user?.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <select
                          value={request.status}
                          onChange={(e) =>
                            handleRequestStatusChange(
                              request._id,
                              e.target.value,
                            )
                          }
                          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
                        >
                          <option value="pending">Pending</option>
                          <option value="inProgress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <button
                          onClick={() => handleDelete("request", request._id)}
                          className="rounded-xl bg-rose-50 p-2.5 text-rose-600 transition hover:bg-rose-100"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    {/* Request Details */}
                    <div className="grid gap-6 p-5 sm:grid-cols-2 lg:grid-cols-4">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                          📍 Destinations
                        </p>
                        <p className="text-sm font-medium text-slate-700">
                          {request.destinations || "Not specified"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                          📅 Start Date
                        </p>
                        <p className="text-sm font-medium text-slate-700">
                          {request.startDate
                            ? new Date(request.startDate).toLocaleDateString()
                            : "Not specified"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                          ⏱️ Duration
                        </p>
                        <p className="text-sm font-medium text-slate-700">
                          {request.durationDays
                            ? `${request.durationDays} Days`
                            : "Not specified"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                          👥 Travelers
                        </p>
                        <p className="text-sm font-medium text-slate-700">
                          {request.travelers || "Not specified"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                          📱 WhatsApp
                        </p>
                        {request.whatsappNumber ? (
                          <a
                            href={`https://wa.me/${request.whatsappNumber.replace(/[^0-9+]/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:underline transition-colors"
                          >
                            <span>💬</span>
                            {request.whatsappNumber}
                          </a>
                        ) : (
                          <p className="text-sm font-medium text-slate-700">
                            Not specified
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Budget & Notes */}
                    <div className="border-t border-slate-50 bg-slate-50/50 p-5">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                            💰 Budget Range
                          </p>
                          <p className="text-sm font-bold text-emerald-600">
                            {request.budgetRange
                              ? `LKR ${request.budgetRange}`
                              : "Not specified"}
                          </p>
                        </div>
                        {request.notes && (
                          <div className="flex-1 sm:ml-8">
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                              📝 Special Notes
                            </p>
                            <p className="text-sm text-slate-600 bg-white rounded-xl p-3 border border-slate-100">
                              {request.notes}
                            </p>
                          </div>
                        )}
                      </div>
                      <p className="mt-4 text-[10px] text-slate-400">
                        Requested on{" "}
                        {new Date(request.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* USERS TAB */}
          {activeTab === "users" && (
            <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
              <Table headers={["Name", "Role", "Email", "Actions"]}>
                {users.length === 0 && <EmptyRow colSpan={4} />}
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b border-slate-50 transition hover:bg-slate-50/50"
                  >
                    <td className="p-4">
                      <p className="font-bold text-slate-700">
                        {user.firstName} {user.lastName}
                      </p>
                    </td>
                    <td className="p-4">
                      <RoleBadge role={user.role} />
                    </td>
                    <td className="p-4 text-sm text-slate-500">{user.email}</td>
                    <td className="p-4">
                      <DeleteButton
                        onClick={() => handleDelete("user", user._id)}
                      />
                    </td>
                  </tr>
                ))}
              </Table>
            </div>
          )}

          {/* TOURS TAB */}
          {activeTab === "tours" && (
            <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
              <Table headers={["Title", "Duration", "Price", "Actions"]}>
                {tours.length === 0 && <EmptyRow colSpan={4} />}
                {tours.map((tour) => (
                  <tr
                    key={tour._id}
                    className="border-b border-slate-50 transition hover:bg-slate-50/50"
                  >
                    <td className="p-4 font-bold text-slate-700">
                      {tour.title}
                    </td>
                    <td className="p-4 text-sm text-slate-500">
                      {tour.durationDays} Days
                    </td>
                    <td className="p-4 text-sm font-bold text-emerald-600">
                      LKR {tour.pricePerPerson?.toLocaleString()}
                    </td>
                    <td className="p-4 flex items-center gap-3">
                      <EditButton onClick={() => handleEditTour(tour._id)} />
                      <DeleteButton
                        onClick={() => handleDelete("tour", tour._id)}
                      />
                    </td>
                  </tr>
                ))}
              </Table>
            </div>
          )}

          {/* VEHICLES TAB */}
          {activeTab === "vehicles" && (
            <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
              <Table headers={["Title", "Type", "Owner", "Actions"]}>
                {vehicles.length === 0 && <EmptyRow colSpan={4} />}
                {vehicles.map((v) => (
                  <tr
                    key={v._id}
                    className="border-b border-slate-50 transition hover:bg-slate-50/50"
                  >
                    <td className="p-4 font-bold text-slate-700">{v.title}</td>
                    <td className="p-4">
                      <span className="inline-block rounded-md bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        {v.type}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-500">
                      {v.owner?.firstName || "Unknown"}
                    </td>
                    <td className="p-4">
                      <DeleteButton
                        onClick={() => handleDelete("vehicle", v._id)}
                      />
                    </td>
                  </tr>
                ))}
              </Table>
            </div>
          )}

          {/* PACKAGES TAB */}
          {activeTab === "packages" && (
            <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
              <Table headers={["Title", "Type", "Status", "Actions"]}>
                {packages.length === 0 && <EmptyRow colSpan={4} />}
                {packages.map((p) => (
                  <tr
                    key={p._id}
                    className="border-b border-slate-50 transition hover:bg-slate-50/50"
                  >
                    <td className="p-4 font-bold text-slate-700">{p.title}</td>
                    <td className="p-4 text-sm text-slate-500 capitalize">
                      {p.packageType}
                    </td>
                    <td className="p-4">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="p-4">
                      <DeleteButton
                        onClick={() => handleDelete("package", p._id)}
                      />
                    </td>
                  </tr>
                ))}
              </Table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// --- SUB-COMPONENTS ---

const Table = ({ headers, children }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-left">
      <thead className="bg-slate-50">
        <tr className="border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400">
          {headers.map((h) => (
            <th key={h} className="p-4">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-50">{children}</tbody>
    </table>
  </div>
);

const RoleBadge = ({ role }) => {
  const styles = {
    admin: "bg-purple-100 text-purple-700",
    vehicleOwner: "bg-blue-100 text-blue-700",
    tourist: "bg-slate-100 text-slate-600",
  };
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${
        styles[role] || styles.tourist
      }`}
    >
      {role}
    </span>
  );
};

const StatusBadge = ({ status }) => (
  <span
    className={`rounded-full px-2 py-1 text-xs font-bold uppercase ${
      status === "published"
        ? "bg-emerald-100 text-emerald-600"
        : "bg-amber-100 text-amber-600"
    }`}
  >
    {status}
  </span>
);

const RequestStatusBadge = ({ status }) => {
  const styles = {
    pending: "bg-amber-100 text-amber-700",
    inProgress: "bg-sky-100 text-sky-700",
    completed: "bg-emerald-100 text-emerald-700",
    cancelled: "bg-rose-100 text-rose-700",
  };
  const labels = {
    pending: "Pending",
    inProgress: "In Progress",
    completed: "Completed",
    cancelled: "Cancelled",
  };
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
        styles[status] || styles.pending
      }`}
    >
      {labels[status] || status}
    </span>
  );
};

const DeleteButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="rounded-lg bg-rose-50 px-4 py-2 text-sm font-bold text-rose-600 transition hover:bg-rose-100 hover:text-rose-700 sm:px-3 sm:py-1.5 sm:text-xs"
  >
    Delete
  </button>
);

const EditButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="rounded-lg bg-blue-50 px-4 py-2 text-sm font-bold text-blue-600 transition hover:bg-blue-100 sm:px-3 sm:py-1.5 sm:text-xs"
  >
    Edit
  </button>
);

const EmptyRow = ({ colSpan }) => (
  <tr>
    <td colSpan={colSpan} className="p-8 text-center text-sm text-slate-400">
      No records found.
    </td>
  </tr>
);

export default AdminDashboard;
