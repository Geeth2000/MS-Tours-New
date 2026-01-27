import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { fetchTourBySlug } from "../services/tourService.js";
import { fetchReviews, createReview } from "../services/reviewService.js";
import { handleApiError } from "../services/apiClient.js";
import { useAuthStore } from "../hooks/useAuthStore.js";
import { USER_ROLES } from "../services/config.js";

const TourDetails = () => {
  const { slug } = useParams();
  const { user } = useAuthStore();
  const [tour, setTour] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({ defaultValues: { rating: 5, comment: "" } });

  useEffect(() => {
    const load = async () => {
      try {
        const tourData = await fetchTourBySlug(slug);
        setTour(tourData);
        const reviewData = await fetchReviews({ tour: tourData._id });
        setReviews(reviewData);
      } catch (err) {
        setError(handleApiError(err));
      }
    };
    load();
  }, [slug]);

  const onSubmit = async (formData) => {
    setError(null);
    setSuccess(null);
    try {
      await createReview({ ...formData, tour: tour._id });
      setSuccess("Review submitted successfully");
      reset();
      const reviewData = await fetchReviews({ tour: tour._id });
      setReviews(reviewData);
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  if (!tour && !error) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
        Loading tour details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">
        {error}
      </div>
    );
  }

  // LOGIC: Check heroImage -> then galleryImages -> then the 'images' field from Atlas -> then fallback
  const heroImageSrc =
    tour.heroImage ||
    tour.galleryImages?.[0] ||
    tour.images?.[0] ||
    "https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&w=800&q=80";

  return (
    <div className="flex flex-col gap-10">
      {/* 1. HERO IMAGE SECTION */}
      <div className="relative h-[400px] w-full overflow-hidden rounded-[2rem] shadow-soft lg:h-[500px]">
        <img
          src={heroImageSrc}
          alt={tour.title}
          className="h-full w-full object-cover"
        />
        {/* Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

        <div className="absolute bottom-0 left-0 w-full p-8 md:p-12">
          <span className="rounded-full bg-primary px-4 py-1 text-xs font-bold uppercase tracking-wider text-white">
            {tour.category?.toUpperCase()}
          </span>
          <h1 className="mt-4 text-3xl font-bold text-white md:text-5xl">
            {tour.title}
          </h1>
          <p className="mt-2 max-w-2xl text-lg text-slate-200">
            {tour.description}
          </p>
        </div>
      </div>

      {/* 2. DETAILS GRID */}
      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl bg-white p-6 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Duration
          </p>
          <p className="mt-2 text-xl font-bold text-accent">
            {tour.durationDays} days
          </p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Price Per Person
          </p>
          <p className="mt-2 text-xl font-bold text-primary">
            LKR {tour.pricePerPerson?.toLocaleString()}
          </p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Locations
          </p>
          <p className="mt-2 text-sm font-medium text-slate-600">
            {tour.locations?.join(", ")}
          </p>
        </div>
      </section>

      {/* 3. HIGHLIGHTS & ITINERARY */}
      <section className="rounded-3xl bg-white p-8 shadow-soft">
        <div className="flex flex-col gap-8">
          {tour.highlights?.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-accent">Highlights</h2>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {tour.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="flex items-center gap-2 text-sm text-slate-600"
                  >
                    <span className="text-primary">✓</span> {highlight}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {tour.itinerary?.length > 0 && (
            <div>
              <h2 className="mb-4 text-xl font-bold text-accent">Itinerary</h2>
              <div className="space-y-4">
                {tour.itinerary.map((item) => (
                  <div
                    key={item.day}
                    className="relative flex gap-4 rounded-2xl border border-slate-100 p-4 transition hover:bg-slate-50"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                      {item.day}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">{item.title}</h4>
                      <p className="mt-1 text-sm text-slate-500">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 4. REVIEWS SECTION */}
      <section className="rounded-3xl bg-white p-8 shadow-soft">
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="text-2xl font-semibold text-accent">
              Guest Reviews
            </h2>
            <p className="text-sm text-slate-500">
              Feedback from travelers who have completed this tour.
            </p>
          </div>
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-sm text-slate-500">
                No reviews yet. Be the first to share your experience.
              </p>
            ) : (
              reviews.map((review) => (
                <article
                  key={review._id}
                  className="rounded-2xl border border-slate-100 p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-accent">
                      {review.user?.firstName} {review.user?.lastName}
                    </p>
                    <span className="text-sm font-semibold text-primary">
                      ⭐ {review.rating}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">
                    {review.comment}
                  </p>
                </article>
              ))
            )}
          </div>

          {user?.role === USER_ROLES.TOURIST && (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-6 space-y-4 rounded-2xl border border-slate-100 p-6"
            >
              <h3 className="text-lg font-semibold text-accent">
                Share your experience
              </h3>
              {success && <p className="text-sm text-emerald-600">{success}</p>}
              {error && <p className="text-sm text-red-500">{error}</p>}
              <label className="block text-sm font-medium text-slate-600">
                Rating
                <select
                  {...register("rating")}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2"
                >
                  {[5, 4, 3, 2, 1].map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm font-medium text-slate-600">
                Comments
                <textarea
                  {...register("comment")}
                  rows={4}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2"
                  placeholder="What made this tour special?"
                />
              </label>
              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};

export default TourDetails;
