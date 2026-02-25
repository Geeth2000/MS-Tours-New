import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Hero from "../components/Hero.jsx";
import TourCard from "../components/TourCard.jsx";
import VehicleCard from "../components/VehicleCard.jsx";
import PackageCard from "../components/PackageCard.jsx";
import { fetchTours } from "../services/tourService.js";
import { fetchVehicles } from "../services/vehicleService.js";
import { fetchPackages } from "../services/packageService.js";
import { fetchLatestReviews } from "../services/reviewService.js";
import { handleApiError } from "../services/apiClient.js";

const features = [
  {
    icon: "🗺️",
    title: "Curated Tours",
    subtitle: "Expert-crafted itineraries",
    description: "Handpicked destinations with local insights",
    link: "/tours",
    gradient: "from-sky-500 to-blue-500",
    bgColor: "bg-sky-50",
  },
  {
    icon: "🚗",
    title: "Premium Fleet",
    subtitle: "Travel in comfort",
    description: "Verified drivers & modern vehicles",
    link: "/vehicles",
    gradient: "from-blue-500 to-indigo-500",
    bgColor: "bg-blue-50",
  },
  {
    icon: "📦",
    title: "Smart Packages",
    subtitle: "All-inclusive deals",
    description: "Best value for complete experiences",
    link: "/packages",
    gradient: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50",
  },
];

const Home = () => {
  const [state, setState] = useState({
    tours: [],
    vehicles: [],
    packages: [],
    reviews: [],
    reviewMeta: { totalCount: 0, averageRating: 0 },
    loading: true,
    reviewsLoading: true,
    error: null,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [tourRes, vehicleRes, packageRes] = await Promise.all([
          fetchTours({ limit: 3, isFeatured: true }),
          fetchVehicles({ limit: 3 }),
          fetchPackages({ limit: 3, status: "published" }),
        ]);

        setState((prev) => ({
          ...prev,
          tours: tourRes.data || [],
          vehicles: vehicleRes.data || [],
          packages: packageRes.data || [],
          loading: false,
        }));
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error: handleApiError(error),
          loading: false,
        }));
      }
    };

    const loadReviews = async () => {
      try {
        const reviewRes = await fetchLatestReviews(6);
        setState((prev) => ({
          ...prev,
          reviews: reviewRes.data || [],
          reviewMeta: reviewRes.meta || { totalCount: 0, averageRating: 0 },
          reviewsLoading: false,
        }));
      } catch {
        setState((prev) => ({
          ...prev,
          reviewsLoading: false,
        }));
      }
    };

    load();
    loadReviews();
  }, []);

  return (
    <div className="flex flex-col font-sans text-slate-600">
      {/* Hero */}
      <Hero />

      {/* Error Display */}
      {state.error && (
        <div className="mx-auto mt-8 w-full max-w-6xl px-4">
          <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
            {state.error}
          </div>
        </div>
      )}

      {/* Features Grid */}
      <section className="relative -mt-20 z-30 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Link
              key={feature.title}
              to={feature.link}
              className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-5`}
              />
              <div
                className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${feature.bgColor} text-3xl transition-transform duration-300 group-hover:scale-110`}
              >
                {feature.icon}
              </div>
              <h3 className="font-bold text-slate-800 group-hover:text-sky-600 transition-colors">
                {feature.title}
              </h3>
              <p className="mt-1 text-sm font-medium text-sky-600">
                {feature.subtitle}
              </p>
              <p className="mt-2 text-sm text-slate-500">
                {feature.description}
              </p>
              <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-slate-400 transition-colors group-hover:text-sky-600">
                <span>Explore</span>
                <svg
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-20 px-4 py-20 sm:px-6 lg:px-8">
        {/* Featured Tours */}
        <section>
          <SectionHeader
            badge="Featured"
            title="Trending Experiences"
            subtitle="Handpicked itineraries showcasing Sri Lanka's culture, heritage, and breathtaking landscapes."
            link="/tours"
            linkText="View All Tours"
          />
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {state.loading ? (
              <SkeletonCards count={3} />
            ) : state.tours.length > 0 ? (
              state.tours.map((tour) => <TourCard key={tour._id} tour={tour} />)
            ) : (
              <EmptyState message="No featured tours available at the moment." />
            )}
          </div>
        </section>

        {/* Vehicles */}
        <section>
          <SectionHeader
            badge="Fleet"
            title="Premium Vehicles"
            subtitle="Travel in comfort with our certified drivers and modern vehicles."
            link="/vehicles"
            linkText="Browse Vehicles"
          />
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {state.loading ? (
              <SkeletonCards count={3} />
            ) : state.vehicles.length > 0 ? (
              state.vehicles.map((vehicle) => (
                <VehicleCard key={vehicle._id} vehicle={vehicle} />
              ))
            ) : (
              <EmptyState message="No vehicles available right now." />
            )}
          </div>
        </section>
      </div>

      {/* Packages */}
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-20 px-4 py-20 sm:px-6 lg:px-8">
        <section>
          <SectionHeader
            badge="Exclusive"
            title="All-Inclusive Packages"
            subtitle="Complete travel packages curated by local experts for the ultimate experience."
            link="/packages"
            linkText="View All Packages"
          />
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {state.loading ? (
              <SkeletonCards count={3} />
            ) : state.packages.length > 0 ? (
              state.packages.map((pkg) => (
                <PackageCard key={pkg._id} pkg={pkg} />
              ))
            ) : (
              <EmptyState message="No packages found." />
            )}
          </div>
        </section>

        {/* Customer Reviews */}
        <section className="rounded-3xl bg-gradient-to-br from-slate-50 to-sky-50/50 p-8 md:p-12">
          <div className="mb-10 text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-sky-600">
              Customer Reviews
            </span>
            <h2 className="mt-2 text-3xl font-bold text-slate-800">
              What Travelers Say
            </h2>
            {state.reviewMeta.totalCount > 0 && (
              <div className="mt-3 flex items-center justify-center gap-2">
                <div className="flex gap-0.5 text-amber-400">
                  {Array(5)
                    .fill(null)
                    .map((_, i) => (
                      <svg
                        key={i}
                        className={`h-5 w-5 ${i < Math.round(state.reviewMeta.averageRating) ? "text-amber-400" : "text-slate-200"}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                </div>
                <span className="text-sm font-medium text-slate-600">
                  {state.reviewMeta.averageRating.toFixed(1)} average from{" "}
                  {state.reviewMeta.totalCount} reviews
                </span>
              </div>
            )}
          </div>

          {state.reviewsLoading ? (
            <div className="grid gap-6 md:grid-cols-3">
              {Array(3)
                .fill(null)
                .map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse rounded-2xl bg-white p-6 shadow-sm"
                  >
                    <div className="flex gap-1">
                      {Array(5)
                        .fill(null)
                        .map((_, j) => (
                          <div
                            key={j}
                            className="h-5 w-5 rounded bg-slate-200"
                          />
                        ))}
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="h-4 rounded bg-slate-200" />
                      <div className="h-4 w-3/4 rounded bg-slate-200" />
                    </div>
                    <div className="mt-6 flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-slate-200" />
                      <div className="space-y-1">
                        <div className="h-4 w-24 rounded bg-slate-200" />
                        <div className="h-3 w-16 rounded bg-slate-200" />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : state.reviews.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {state.reviews.map((review) => (
                <div
                  key={review._id}
                  className="rounded-2xl bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex gap-0.5 text-amber-400">
                      {Array(5)
                        .fill(null)
                        .map((_, i) => (
                          <svg
                            key={i}
                            className={`h-5 w-5 ${i < review.rating ? "text-amber-400" : "text-slate-200"}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                    </div>
                    <span className="text-xs text-slate-400">
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  {review.comment && (
                    <p className="mt-4 text-slate-600 line-clamp-3">
                      "{review.comment}"
                    </p>
                  )}
                  {(review.vehicle || review.package || review.tour) && (
                    <p className="mt-2 text-xs font-medium text-sky-600">
                      {review.vehicle?.title ||
                        review.package?.title ||
                        review.tour?.title}
                    </p>
                  )}
                  <div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-4">
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
                      <div className="font-semibold text-slate-800">
                        {review.user?.firstName} {review.user?.lastName}
                      </div>
                      <div className="text-xs text-slate-500">
                        Verified Traveler
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-3xl">
                💬
              </div>
              <h3 className="text-lg font-semibold text-slate-800">
                No Reviews Yet
              </h3>
              <p className="mt-2 text-slate-500">
                Be the first to share your experience after completing a trip!
              </p>
            </div>
          )}
        </section>
      </div>

      {/* CTA Banner */}
      <section className="mx-auto mb-16 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 p-8 text-center text-white shadow-xl md:p-16">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1200')] bg-cover bg-center opacity-20" />
          <div className="relative z-10">
            <h2 className="text-3xl font-bold md:text-4xl">
              Ready to Explore Sri Lanka?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-white/90">
              Start planning your dream vacation today. Our travel experts are
              here to help.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                to="/plan-trip"
                className="rounded-2xl bg-white px-8 py-4 font-bold text-sky-700 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                Plan Custom Trip
              </Link>
              <Link
                to="/contact"
                className="rounded-2xl border-2 border-white/30 bg-white/10 px-8 py-4 font-bold text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/20"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const SectionHeader = ({ badge, title, subtitle, link, linkText }) => (
  <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
    <div className="max-w-2xl">
      {badge && (
        <span className="mb-2 inline-block rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-sky-700">
          {badge}
        </span>
      )}
      <h2 className="text-3xl font-bold text-slate-800 md:text-4xl">{title}</h2>
      <p className="mt-3 text-lg text-slate-500">{subtitle}</p>
    </div>
    {link && (
      <Link
        to={link}
        className="group flex shrink-0 items-center gap-2 font-bold text-sky-600 transition hover:text-sky-700"
      >
        {linkText}
        <svg
          className="h-5 w-5 transition-transform group-hover:translate-x-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 8l4 4m0 0l-4 4m4-4H3"
          />
        </svg>
      </Link>
    )}
  </div>
);

const SkeletonCards = ({ count }) => (
  <>
    {Array(count)
      .fill(null)
      .map((_, i) => (
        <div key={i} className="animate-pulse rounded-2xl bg-slate-100 p-6">
          <div className="h-48 rounded-xl bg-slate-200" />
          <div className="mt-4 h-4 w-3/4 rounded bg-slate-200" />
          <div className="mt-2 h-3 w-1/2 rounded bg-slate-200" />
        </div>
      ))}
  </>
);

const EmptyState = ({ message }) => (
  <div className="col-span-full rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-16 text-center">
    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-3xl">
      📭
    </div>
    <p className="text-slate-400">{message}</p>
  </div>
);

export default Home;
