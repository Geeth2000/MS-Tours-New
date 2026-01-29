import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StatCard from "../../components/StatCard.jsx";
import {
  fetchAdminSummary,
  fetchUsers,
  deleteUser,
  deleteTour,
  deleteVehicleAdmin,
  deletePackageAdmin,
} from "../../services/adminService.js";
import { fetchPackages } from "../../services/packageService.js";
import { fetchTours } from "../../services/tourService.js";
import { fetchVehicles } from "../../services/vehicleService.js";
import {
  fetchAllBookings,
  updateBookingStatus,
} from "../../services/bookingService.js"; // Bookings service import කළා
import { handleApiError } from "../../services/apiClient.js";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [summary, setSummary] = useState(null);

  // Data States
  const [users, setUsers] = useState([]);
  const [tours, setTours] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [packages, setPackages] = useState([]);
  const [bookings, setBookings] = useState([]); // Bookings සඳහා state එක

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
        // Bookings load කිරීම
        const res = await fetchAllBookings({ limit: 100 });
        setBookings(res.data);
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
    if (
      !window.confirm(
        `Are you sure you want to delete this ${type}? This action cannot be undone.`,
      )
    )
      return;

    try {
      if (type === "user") await deleteUser(id);
      if (type === "tour") await deleteTour(id);
      if (type === "vehicle") await deleteVehicleAdmin(id);
      if (type === "package") await deletePackageAdmin(id);

      await loadTabData();
      await loadOverview();
    } catch (err) {
      alert(handleApiError(err));
    }
  };

  // Booking Status වෙනස් කිරීම (Approve/Reject)
  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateBookingStatus(id, { status: newStatus });
      // UI එක update කරන්න (API call එකක් නොකර ඉක්මනට පෙන්වන්න)
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: newStatus } : b)),
      );
    } catch (err) {
      alert(handleApiError(err));
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
          "bookings", // Bookings tab එක මෙතනට දැම්මා
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
                value={bookings.length > 0 ? bookings.length : "-"} // Optional: backend එකෙන් totalBookings එවනවා නම් හොඳයි
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
