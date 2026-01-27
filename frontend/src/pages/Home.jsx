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
      {/* 1. HERO SECTION (Full Width - Outside the Container) */}
      <div className="w-full">
        <Hero />
      </div>

      {/* 2. ERROR DISPLAY */}
      {state.error && (
        <div className="mx-auto mt-8 w-full max-w-6xl px-4">
          <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-600 shadow-sm">
            {state.error}
          </div>
        </div>
      )}

      {/* --- START OF CENTERED CONTENT --- */}
      {/* මෙතනින් පහළ තියෙන ඔක්කොම මැදට (Centered) වෙලා තියෙන්නේ */}
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-16 px-4 py-12 sm:px-6 lg:px-8">
        {/* 3. CATEGORY QUICK LINKS */}
        <section>
          <div className="grid gap-6 sm:grid-cols-3">
            <CategoryCard
              title="Curated Tours"
              subtitle="Explore expert itineraries"
              icon="🗺️"
              link="/tours"
              color="bg-sky-50 text-sky-600"
            />
            <CategoryCard
              title="Vehicle Fleet"
              subtitle="Rent cars, vans & more"
              icon="🚗"
              link="/vehicles"
              color="bg-blue-50 text-blue-600"
            />
            <CategoryCard
              title="Travel Packages"
              subtitle="All-inclusive experiences"
              icon="📦"
              link="/packages"
              color="bg-emerald-50 text-emerald-600"
            />
          </div>
        </section>

        {/* 4. FEATURED TOURS */}
        <section>
          <SectionHeader
            title="Trending Experiences"
            subtitle="Handpicked itineraries showcasing Sri Lanka's culture, heritage, and breathtaking landscapes."
            link="/tours"
            linkText="View All Tours"
          />
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {state.tours.length > 0 ? (
              state.tours.map((tour) => <TourCard key={tour._id} tour={tour} />)
            ) : (
              <EmptyState message="No featured tours available at the moment." />
            )}
          </div>
        </section>
      </div>
      {/* --- END OF CENTERED CONTENT --- */}

      {/* 5. AI RECOMMENDATIONS (Full Width Background Highlight) */}
      {/* මේක ආයේ Full Width වෙන්න ඕන නිසා Container එකෙන් එලියට ගත්තා */}
      <section className="relative w-full overflow-hidden bg-slate-900 py-20 text-white">
        {/* Decorative Blurs */}
        <div className="absolute -left-20 top-0 h-96 w-96 rounded-full bg-sky-500/20 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-6xl px-4">
          <div className="mb-10 text-center">
            <span className="mb-4 inline-block rounded-full bg-white/10 px-4 py-1 text-xs font-bold uppercase tracking-wider text-sky-300 backdrop-blur-md">
              Powered by AI
            </span>
            <h2 className="text-3xl font-bold md:text-4xl">
              Smart Travel Recommendations
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-300">
              Not sure where to go? Let our AI suggest the perfect destinations
              based on your interests.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {state.places.slice(0, 2).map((place, index) => (
              <div
                key={index}
                className="flex flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition hover:bg-white/10"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <h3 className="text-2xl font-bold text-white">
                      {place.name}
                    </h3>
                    <span className="rounded-lg bg-sky-500 px-3 py-1 text-xs font-bold text-white">
                      {place.category}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-400">
                    Ideal for a {place.duration}-day trip • {place.budgetLevel}{" "}
                    Budget
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {place.highlights.map((highlight) => (
                      <span
                        key={highlight}
                        className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-300"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/ai-assistant"
              className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-8 py-3 text-sm font-bold text-white transition hover:bg-sky-400"
            >
              Try AI Assistant <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* --- START OF CENTERED CONTENT (AGAIN) --- */}
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-16 px-4 py-12 sm:px-6 lg:px-8">
        {/* 6. VEHICLES FLEET */}
        <section>
          <SectionHeader
            title="Premium Fleet"
            subtitle="Travel in comfort with our certified drivers and modern vehicles."
            link="/vehicles"
            linkText="Browse Vehicles"
          />
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {state.vehicles.length > 0 ? (
              state.vehicles.map((vehicle) => (
                <VehicleCard key={vehicle._id} vehicle={vehicle} />
              ))
            ) : (
              <EmptyState message="No vehicles available right now." />
            )}
          </div>
        </section>

        {/* 7. TAILORED PACKAGES */}
        <section>
          <SectionHeader
            title="Exclusive Packages"
            subtitle="All-inclusive travel packages curated by local experts."
            link="/packages"
            linkText="View All Packages"
          />
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {state.packages.length > 0 ? (
              state.packages.map((pkg) => (
                <PackageCard key={pkg._id} pkg={pkg} />
              ))
            ) : (
              <EmptyState message="No packages found." />
            )}
          </div>
        </section>
      </div>
      {/* --- END OF CENTERED CONTENT --- */}
    </div>
  );
};

// --- SUB-COMPONENTS ---

const SectionHeader = ({ title, subtitle, link, linkText }) => (
  <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
    <div className="max-w-2xl">
      <h2 className="text-3xl font-bold text-slate-800">{title}</h2>
      <p className="mt-2 text-lg text-slate-500">{subtitle}</p>
    </div>
    {link && (
      <Link
        to={link}
        className="shrink-0 font-bold text-sky-600 transition hover:text-sky-700"
      >
        {linkText} &rarr;
      </Link>
    )}
  </div>
);

const CategoryCard = ({ title, subtitle, icon, link, color }) => (
  <Link
    to={link}
    className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:border-sky-100 hover:shadow-md"
  >
    <div
      className={`flex h-14 w-14 items-center justify-center rounded-2xl text-3xl ${color}`}
    >
      {icon}
    </div>
    <div>
      <h3 className="font-bold text-slate-800 group-hover:text-sky-600">
        {title}
      </h3>
      <p className="text-sm text-slate-500">{subtitle}</p>
    </div>
  </Link>
);

const EmptyState = ({ message }) => (
  <div className="col-span-full rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-12 text-center text-slate-400">
    <p>{message}</p>
  </div>
);

export default Home;
