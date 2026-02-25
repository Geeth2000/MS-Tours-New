import { apiClient } from "./apiClient.js";

export const createBooking = async (payload) => {
  const { data } = await apiClient.post("/bookings", payload);
  return data.data;
};

export const fetchMyBookings = async () => {
  const { data } = await apiClient.get("/bookings/me");
  return data.data;
};

export const fetchOwnerBookings = async () => {
  const { data } = await apiClient.get("/bookings/owner");
  return data.data;
};

export const fetchAllBookings = async (params = {}) => {
  const { data } = await apiClient.get("/bookings", { params });
  return data;
};

export const updateBookingStatus = async (id, payload) => {
  const { data } = await apiClient.patch(`/bookings/${id}/status`, payload);
  return data.data;
};

export const cancelBooking = async (id) => {
  const { data } = await apiClient.post(`/bookings/${id}/cancel`);
  return data.data;
};

/**
 * Check if user has a completed booking for a specific item
 * @param {string} itemId - The ID of the vehicle, package, or tour
 * @param {string} itemType - Type of item: "vehicle", "package", or "tour"
 * @returns {Promise<boolean>} - True if user has a completed booking for this item
 */
export const hasCompletedBooking = async (itemId, itemType) => {
  try {
    const bookings = await fetchMyBookings();
    return bookings.some(
      (booking) =>
        booking.status === "completed" &&
        (booking[itemType]?._id === itemId || booking[itemType] === itemId),
    );
  } catch {
    return false;
  }
};
