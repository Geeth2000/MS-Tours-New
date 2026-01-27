import { useEffect, useState } from "react";
import StatCard from "../../components/StatCard.jsx";
import {
  fetchAdminSummary,
  fetchPendingOwners,
  updateOwnerStatus,
  fetchUsers,
} from "../../services/adminService.js";
import { fetchAllBookings } from "../../services/bookingService.js";
import {
  fetchPackages,
  updatePackageStatus,
} from "../../services/packageService.js";
import { handleApiError } from "../../services/apiClient.js";

const AdminDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [pendingOwners, setPendingOwners] = useState([]);
  const [pendingPackages, setPendingPackages] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  const load = async () => {
    try {
      const [summaryData, ownersData, packagesData, bookingsData, usersData] =
        await Promise.all([
          fetchAdminSummary(),
          fetchPendingOwners(),
          fetchPackages({ status: "pending" }),
          fetchAllBookings({ limit: 5 }),
          fetchUsers(),
        ]);

      setSummary(summaryData);
      setPendingOwners(ownersData);
      setPendingPackages(packagesData.data || []);
      setBookings(bookingsData.data || []);
      setUsers(usersData);
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleOwnerStatus = async (id, status) => {
    try {
      await updateOwnerStatus(id, { status });
      await load();
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  const handlePackageStatus = async (id, status) => {
    try {
      await updatePackageStatus(id, status);
      await load();
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  // Helper for Status Badge Colors
  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-emerald-100 text-emerald-700";
      case "confirmed":
        return "bg-emerald-100 text-emerald-700";
      case "pending":
        return "bg-amber-100 text-amber-700";
      case "rejected":
        return "bg-rose-100 text-rose-700";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* 1. Modern Header Section */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-primary to-blue-600 p-8 text-white shadow-lg">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="mt-2 opacity-90">
            Welcome back! Here is what's happening in your platform today.
          </p>
        </div>
        {/* Decorative Circle */}
        <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-600">
          {error}
        </div>
      )}

      {/* 2. Stats Grid */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon="👥"
          label="Total Users"
          value={summary?.totalUsers?.toLocaleString() || 0}
        />
        <StatCard
          icon="🗺️"
          label="Tours"
          value={summary?.totalTours?.toLocaleString() || 0}
        />
        <StatCard
          icon="📅"
          label="Bookings"
          value={summary?.totalBookings?.toLocaleString() || 0}
          trend={`Rev: ${summary?.totalRevenue?.toLocaleString() || 0}`}
        />
        <StatCard
          icon="💰"
          label="Earnings"
          value={`LKR ${summary?.adminEarnings?.toLocaleString() || 0}`}
        />
      </section>

      {/* 3. Action Center (Grid Layout) */}
      <section className="grid gap-8 lg:grid-cols-12">
        {/* Left Column: Pending Actions (Width 7/12) */}
        <div className="flex flex-col gap-6 lg:col-span-7">
          {/* Pending Packages */}
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">
                📦 Pending Packages
              </h3>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">
                {pendingPackages.length} To Review
              </span>
            </div>

            <div className="flex flex-col gap-4">
              {pendingPackages.length === 0 && (
                <div className="py-8 text-center text-slate-400">
                  Everything is up to date! ✨
                </div>
              )}
              {pendingPackages.map((pkg) => (
                <div
                  key={pkg._id}
                  className="group relative overflow-hidden rounded-2xl bg-slate-50 p-5 transition-all hover:bg-white hover:shadow-md hover:ring-1 hover:ring-slate-200"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h4 className="font-bold text-slate-800">{pkg.title}</h4>
                      <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                        <span className="font-medium text-blue-600">
                          @{pkg.owner?.firstName}
                        </span>
                        <span>•</span>
                        <span className="capitalize">{pkg.packageType}</span>
                      </div>
                      <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                        {pkg.description}
                      </p>
                    </div>

                    <div className="flex gap-2 sm:flex-col">
                      <button
                        onClick={() =>
                          handlePackageStatus(pkg._id, "published")
                        }
                        className="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-white shadow-emerald-200 transition-colors hover:bg-emerald-600 hover:shadow-lg"
                      >
                        Publish
                      </button>
                      <button
                        onClick={() => handlePackageStatus(pkg._id, "draft")}
                        className="rounded-xl bg-white px-4 py-2 text-xs font-bold text-slate-600 ring-1 ring-slate-200 transition-colors hover:bg-slate-100"
                      >
                        Draft
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Vehicle Owners */}
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">
                🚘 New Driver Requests
              </h3>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">
                {pendingOwners.length} To Review
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {pendingOwners.length === 0 && (
                <div className="col-span-full py-8 text-center text-slate-400">
                  No new drivers waiting.
                </div>
              )}
              {pendingOwners.map((owner) => (
                <div
                  key={owner._id}
                  className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-all hover:border-blue-200 hover:shadow-md"
                >
                  <div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-lg">
                      👤
                    </div>
                    <p className="mt-3 font-bold text-slate-800">
                      {owner.firstName} {owner.lastName}
                    </p>
                    <p className="text-xs text-slate-500">{owner.email}</p>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => handleOwnerStatus(owner._id, "approved")}
                      className="flex-1 rounded-lg bg-emerald-500 py-2 text-xs font-bold text-white transition-colors hover:bg-emerald-600"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleOwnerStatus(owner._id, "rejected")}
                      className="flex-1 rounded-lg bg-rose-100 py-2 text-xs font-bold text-rose-600 transition-colors hover:bg-rose-200"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Recent Bookings & Users (Width 5/12) */}
        <div className="flex flex-col gap-6 lg:col-span-5">
          {/* Recent Bookings List */}
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-bold text-slate-800">
              📅 Recent Activity
            </h3>
            <div className="space-y-4">
              {bookings.length === 0 && (
                <p className="text-slate-400">No recent bookings.</p>
              )}
              {bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="flex items-center gap-4 rounded-2xl border border-slate-50 p-3 hover:bg-slate-50"
                >
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-bold ${booking.status === "confirmed" ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-500"}`}
                  >
                    {booking.status === "confirmed" ? "✓" : "•"}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <h5 className="truncate font-bold text-slate-700">
                      {booking.referenceCode}
                    </h5>
                    <p className="truncate text-xs text-slate-500">
                      {booking.user?.firstName} • LKR{" "}
                      {booking.totalPrice?.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* User Directory (Compact) */}
          <div className="flex-1 rounded-3xl bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-bold text-slate-800">
              👥 Users Directory
            </h3>
            <div className="max-h-[400px] overflow-y-auto pr-2">
              <table className="w-full text-left text-sm">
                <thead className="sticky top-0 bg-white">
                  <tr className="text-xs uppercase text-slate-400">
                    <th className="pb-3">Name</th>
                    <th className="pb-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {users.map((user) => (
                    <tr key={user._id} className="group">
                      <td className="py-3">
                        <p className="font-medium text-slate-700 group-hover:text-blue-600">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {user.role}
                        </p>
                      </td>
                      <td className="py-3 text-right">
                        <span
                          className={`inline-block rounded-full px-2 py-1 text-[10px] font-bold capitalize ${
                            user.role === "vehicleOwner"
                              ? getStatusColor(user.onboarding?.approvalStatus)
                              : user.isActive
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {user.role === "vehicleOwner"
                            ? user.onboarding?.approvalStatus
                            : user.isActive
                              ? "Active"
                              : "Inactive"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
