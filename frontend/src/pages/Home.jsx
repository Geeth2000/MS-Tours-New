import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Hero from "../components/Hero.jsx";
import TourCard from "../components/TourCard.jsx";
import VehicleCard from "../components/VehicleCard.jsx";
import PackageCard from "../components/PackageCard.jsx";
import { fetchTours } from "../services/tourService.js";
import { fetchVehicles } from "../services/vehicleService.js";
import { fetchPackages } from "../services/packageService.js";
import { getPlaceRecommendations } from "../services/aiService.js";
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
  {
    icon: "✨",
    title: "AI Assistant",
    subtitle: "Personalized planning",
    description: "Get recommendations tailored to you",
    link: "/ai-assistant",
    gradient: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-50",
  },
];

const testimonials = [
  {
    name: "Sarah Mitchell",
    location: "London, UK",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    text: "Absolutely incredible experience! The AI recommendations were spot-on, and our guide was amazing.",
    rating: 5,
  },
  {
    name: "James Chen",
    location: "Singapore",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    text: "Best trip planning experience ever. Everything was seamless from booking to the actual tour.",
    rating: 5,
  },
  {
    name: "Emma Rodriguez",
    location: "Miami, USA",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    text: "The custom itinerary feature is a game-changer. Highly recommend M&S Tours!",
    rating: 5,
  },
];

const Home = () => {
  const [state, setState] = useState({
    tours: [],
    vehicles: [],
    packages: [],
    places: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [tourRes, vehicleRes, packageRes, placeRes] = await Promise.all([
          fetchTours({ limit: 3, isFeatured: true }),
          fetchVehicles({ limit: 3 }),
          fetchPackages({ limit: 3, status: "published" }),
          getPlaceRecommendations({
            interests: ["nature", "culture"],
            durationDays: 3,
          }),
        ]);

        setState((prev) => ({
          ...prev,
          tours: tourRes.data || [],
          vehicles: vehicleRes.data || [],
          packages: packageRes.data || [],
          places: placeRes || [],
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
    load();
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

      {/* AI Recommendations */}
      <section className="relative w-full overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-24 text-white">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-sky-500/20 blur-3xl" />
          <div className="absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/10 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-sky-400 backdrop-blur-md">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Powered by AI
            </span>
            <h2 className="text-4xl font-bold md:text-5xl">
              Smart Travel Recommendations
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
              Not sure where to go? Let our AI suggest the perfect destinations
              based on your interests.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {state.places.slice(0, 2).map((place, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all duration-300 hover:border-sky-500/30 hover:bg-white/10"
              >
                <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-gradient-to-br from-sky-500/20 to-blue-500/20 blur-3xl transition-all duration-500 group-hover:scale-150" />
                <div className="relative">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white">
                        {place.name}
                      </h3>
                      <p className="mt-1 text-sm text-slate-400">
                        {place.duration}-day trip • {place.budgetLevel} Budget
                      </p>
                    </div>
                    <span className="shrink-0 rounded-xl bg-gradient-to-r from-sky-500 to-blue-500 px-4 py-1.5 text-xs font-bold text-white shadow-lg">
                      {place.category}
                    </span>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {place.highlights.map((highlight) => (
                      <span
                        key={highlight}
                        className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:bg-white/20"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/ai-assistant"
              className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-500 px-8 py-4 font-bold text-white shadow-xl shadow-sky-900/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              <span>Try AI Assistant</span>
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
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

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

        {/* Testimonials */}
        <section className="rounded-3xl bg-gradient-to-br from-slate-50 to-sky-50/50 p-8 md:p-12">
          <div className="mb-10 text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-sky-600">
              Testimonials
            </span>
            <h2 className="mt-2 text-3xl font-bold text-slate-800">
              What Travelers Say
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="rounded-2xl bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex gap-0.5 text-amber-400">
                  {Array(t.rating)
                    .fill(null)
                    .map((_, i) => (
                      <svg
                        key={i}
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                </div>
                <p className="mt-4 text-slate-600">"{t.text}"</p>
                <div className="mt-6 flex items-center gap-3">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-slate-800">{t.name}</div>
                    <div className="text-xs text-slate-500">{t.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
