import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import StarRating from "./StarRating.jsx";
import { useAuthStore } from "../hooks/useAuthStore.js";
import { USER_ROLES } from "../services/config.js";
import {
  fetchReviews,
  createReview,
  deleteReview,
} from "../services/reviewService.js";
import { hasCompletedBooking } from "../services/bookingService.js";
import { handleApiError } from "../services/apiClient.js";

/**
 * ReviewSection Component
 * Displays reviews and a review form for authenticated users with completed bookings
 *
 * @param {string} itemId - ID of the vehicle/package/tour
 * @param {string} itemType - Type: "vehicle", "package", or "tour"
 * @param {object} ratings - Current ratings object { average, count }
 */
const ReviewSection = ({
  itemId,
  itemType,
  ratings = { average: 0, count: 0 },
}) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [canReview, setCanReview] = useState(false);
  const [checkingEligibility, setCheckingEligibility] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm({ defaultValues: { rating: 5, comment: "" } });

  const currentRating = watch("rating");

  const loadReviews = async () => {
    try {
      setLoading(true);
      const params = { [itemType]: itemId };
      const data = await fetchReviews(params);
      setReviews(data);
      setError(null);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (itemId) {
      loadReviews();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemId, itemType]);

  // Check if user is eligible to review (has completed booking)
  useEffect(() => {
    const checkEligibility = async () => {
      if (!user || user.role !== USER_ROLES.TOURIST || !itemId) {
        setCanReview(false);
        return;
      }

      setCheckingEligibility(true);
      try {
        const eligible = await hasCompletedBooking(itemId, itemType);
        setCanReview(eligible);
      } catch {
        setCanReview(false);
      } finally {
        setCheckingEligibility(false);
      }
    };

    checkEligibility();
  }, [user, itemId, itemType]);

  const onSubmit = async (formData) => {
    if (!user) {
      toast.error("Please login to submit a review");
      navigate("/login", { state: { from: window.location.pathname } });
      return;
    }

    try {
      const payload = {
        ...formData,
        [itemType]: itemId,
        rating: Number(formData.rating),
      };
      await createReview(payload);
      toast.success("Review submitted successfully!");
      reset({ rating: 5, comment: "" });
      loadReviews();
    } catch (err) {
      const errorMsg = handleApiError(err);
      toast.error(errorMsg);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) {
      return;
    }

    try {
      await deleteReview(reviewId);
      toast.success("Review deleted successfully!");
      loadReviews();
    } catch (err) {
      toast.error(handleApiError(err));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Check if current user has already reviewed
  const userHasReviewed =
    user && reviews.some((review) => review.user?._id === user._id);

  return (
    <section className="rounded-2xl bg-white p-6 shadow-lg sm:rounded-3xl sm:p-8">
      <div className="flex flex-col gap-6">
        {/* Header with Rating Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800 sm:text-2xl">
              Reviews
            </h2>
            <p className="text-sm text-slate-500">
              What travelers are saying about this {itemType}
            </p>
          </div>

          {/* Rating Summary Card */}
          <div className="flex items-center gap-4 rounded-2xl bg-gradient-to-r from-amber-50 to-yellow-50 px-5 py-3">
            <div className="text-center">
              <p className="text-3xl font-bold text-amber-600">
                {ratings.average?.toFixed(1) || "0.0"}
              </p>
              <p className="text-xs text-slate-500">out of 5</p>
            </div>
            <div className="border-l border-amber-200 pl-4">
              <StarRating
                rating={Math.round(ratings.average || 0)}
                readonly
                size="md"
              />
              <p className="mt-1 text-xs text-slate-500">
                {ratings.count || 0}{" "}
                {ratings.count === 1 ? "review" : "reviews"}
              </p>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-200 border-t-sky-600" />
            </div>
          ) : error ? (
            <div className="rounded-xl bg-red-50 p-4 text-center text-red-600">
              {error}
            </div>
          ) : reviews.length === 0 ? (
            <div className="rounded-xl border-2 border-dashed border-slate-200 p-8 text-center">
              <p className="text-4xl mb-3">💬</p>
              <p className="text-slate-500">
                No reviews yet. Be the first to share your experience!
              </p>
            </div>
          ) : (
            reviews.map((review) => (
              <article
                key={review._id}
                className="rounded-xl border border-slate-100 p-4 transition hover:border-slate-200 hover:shadow-sm sm:rounded-2xl sm:p-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {review.user?.profileImage ? (
                      <img
                        src={review.user.profileImage}
                        alt={`${review.user.firstName} ${review.user.lastName}`}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-sm font-bold text-white">
                        {review.user?.firstName?.[0]}
                        {review.user?.lastName?.[0]}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-slate-800">
                        {review.user?.firstName} {review.user?.lastName}
                      </p>
                      <p className="text-xs text-slate-400">
                        {formatDate(review.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <StarRating rating={review.rating} readonly size="sm" />
                    {user && review.user?._id === user._id && (
                      <button
                        onClick={() => handleDeleteReview(review._id)}
                        className="rounded-lg p-1 text-slate-400 hover:bg-red-50 hover:text-red-500 transition"
                        title="Delete review"
                      >
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                {review.comment && (
                  <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                    {review.comment}
                  </p>
                )}
              </article>
            ))
          )}
        </div>

        {/* Review Form - Only show if user has a completed booking and hasn't reviewed yet */}
        {canReview && !userHasReviewed && (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-4 space-y-4 rounded-xl border border-slate-100 bg-slate-50 p-5 sm:rounded-2xl sm:p-6"
          >
            <h3 className="text-base font-bold text-slate-800 sm:text-lg">
              Share Your Experience
            </h3>

            {/* Star Rating Input */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">
                Your Rating
              </label>
              <div className="flex items-center gap-3">
                <StarRating
                  rating={Number(currentRating)}
                  onRatingChange={(value) => setValue("rating", value)}
                  size="lg"
                />
                <span className="text-sm font-semibold text-amber-600">
                  {currentRating} {currentRating === 1 ? "star" : "stars"}
                </span>
              </div>
              <input type="hidden" {...register("rating")} />
            </div>

            {/* Comment Textarea */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">
                Your Comments
              </label>
              <textarea
                {...register("comment")}
                rows={4}
                className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 transition focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                placeholder="Tell us about your experience..."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-6 py-3 font-bold text-white shadow-lg shadow-sky-200 transition hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Submitting...
                </span>
              ) : (
                "Submit Review"
              )}
            </button>
          </form>
        )}

        {/* Already Reviewed Message */}
        {user?.role === USER_ROLES.TOURIST && userHasReviewed && (
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-center">
            <p className="text-sm text-emerald-700">
              ✓ You have already submitted a review for this {itemType}
            </p>
          </div>
        )}

        {/* Checking Eligibility Message */}
        {user?.role === USER_ROLES.TOURIST && checkingEligibility && (
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-sky-500 border-t-transparent" />
              <p className="text-sm text-slate-600">
                Checking review eligibility...
              </p>
            </div>
          </div>
        )}

        {/* Not Eligible Message - User is logged in but doesn't have a completed booking */}
        {user?.role === USER_ROLES.TOURIST &&
          !canReview &&
          !userHasReviewed &&
          !checkingEligibility && (
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-center">
              <p className="text-sm text-amber-700 mb-1">
                📝 Want to write a review?
              </p>
              <p className="text-xs text-amber-600">
                You can submit a review after completing your booking for this{" "}
                {itemType}.
              </p>
            </div>
          )}

        {/* Login Prompt */}
        {!user && (
          <div className="rounded-xl bg-sky-50 border border-sky-200 p-4 text-center">
            <p className="text-sm text-sky-700 mb-2">
              Want to share your experience?
            </p>
            <button
              onClick={() =>
                navigate("/login", {
                  state: { from: window.location.pathname },
                })
              }
              className="text-sm font-semibold text-sky-600 hover:text-sky-700 underline"
            >
              Login to write a review
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ReviewSection;
