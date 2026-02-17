import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import heroBg from "../assets/hero-srilanka.jpg";

const stats = [
  { value: "10K+", label: "Travelers" },
  { value: "500+", label: "Tours" },
  { value: "4.9", label: "Rating" },
  { value: "24/7", label: "Support" },
];

const Hero = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-slate-900">
      {/* Parallax Background */}
      <div
        className="absolute inset-0 h-full w-full scale-110 bg-cover bg-center bg-no-repeat transition-transform duration-1000"
        style={{
          backgroundImage: `url(${heroBg})`,
          transform: `translateY(${scrollY * 0.3}px) scale(1.1)`,
        }}
      />

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/40 to-slate-900" />
      <div className="absolute inset-0 bg-gradient-to-r from-sky-900/30 to-blue-900/20" />

      {/* Animated Particles/Orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-1/4 h-96 w-96 animate-pulse rounded-full bg-sky-500/20 blur-3xl" />
        <div className="animation-delay-2000 absolute -right-32 bottom-1/4 h-80 w-80 animate-pulse rounded-full bg-blue-500/20 blur-3xl" />
        <div className="animation-delay-4000 absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-sky-500/10 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-20 mx-auto w-full max-w-7xl px-6 py-20 text-center sm:px-12 lg:px-16">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 shadow-2xl backdrop-blur-md">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-sky-500" />
          </span>
          <span className="text-sm font-semibold tracking-wide text-white/90">
            🌴 Discover Sri Lanka's Hidden Gems
          </span>
        </div>

        {/* Headline */}
        <h1 className="mx-auto max-w-5xl text-5xl font-extrabold leading-[1.1] tracking-tight text-white drop-shadow-2xl md:text-6xl lg:text-7xl xl:text-8xl">
          Your Perfect{" "}
          <span className="relative">
            <span className="relative z-10 bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Island Adventure
            </span>
            <span className="absolute -bottom-2 left-0 h-3 w-full bg-gradient-to-r from-sky-500/40 to-blue-500/40 blur-xl" />
          </span>{" "}
          Starts Here
        </h1>

        {/* Subheadline */}
        <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-slate-200/90 md:text-xl">
          Hand-crafted tours, verified local guides, and premium vehicles.
          Experience the Pearl of the Indian Ocean like never before.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            onClick={() => navigate("/tours")}
            className="group relative flex items-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-sky-500 to-blue-500 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-sky-900/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-sky-900/40"
          >
            <span className="relative z-10">Explore Tours</span>
            <svg
              className="relative z-10 h-5 w-5 transition-transform group-hover:translate-x-1"
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
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-transform duration-300 group-hover:translate-x-0" />
          </button>

          <button
            onClick={() => navigate("/plan-trip")}
            className="group flex items-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-8 py-4 text-lg font-bold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-white/50 hover:bg-white/20"
          >
            <span>Plan Custom Trip</span>
            <span className="text-xl transition-transform group-hover:rotate-12">
              ✨
            </span>
          </button>
        </div>

        {/* Stats Row */}
        <div className="mx-auto mt-16 flex max-w-2xl flex-wrap items-center justify-center gap-8 rounded-3xl border border-white/10 bg-white/5 px-8 py-6 backdrop-blur-md md:gap-12">
          {stats.map((stat, i) => (
            <div key={stat.label} className="flex items-center gap-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-white md:text-3xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-400">
                  {stat.label}
                </div>
              </div>
              {i < stats.length - 1 && (
                <div className="hidden h-10 w-px bg-white/20 md:block" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2">
        <div className="flex animate-bounce flex-col items-center gap-2 text-white/60">
          <span className="text-xs font-medium uppercase tracking-widest">
            Scroll
          </span>
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default Hero;
