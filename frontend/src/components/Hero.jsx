import { useNavigate } from "react-router-dom";
import heroBg from "../assets/hero-srilanka.png";

const Hero = () => {
  const navigate = useNavigate();

  return (
    // 'relative' and 'overflow-hidden' ensure the image never spills out
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-slate-900">
      {/* 1. Background Image with Zoom Effect */}
      {/* The image is now on this inner div which scales on hover */}
      <div
        className="absolute inset-0 h-full w-full bg-cover bg-center bg-no-repeat transition-transform duration-[20s] ease-linear hover:scale-105"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        {/* Optional: Dark tint directly on the image */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* 2. Gradient Overlay (Bottom to Top) */}
      {/* This creates the fade effect for text readability */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-slate-900/30" />

      {/* 3. Content Container */}
      <div className="relative z-20 w-full max-w-7xl px-6 py-20 text-center sm:px-12 lg:px-16">
        {/* Animated Badge */}
        <div className="mb-8 inline-flex items-center gap-3 rounded-full bg-white/10 px-5 py-2 backdrop-blur-md border border-white/20 shadow-lg">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-sky-500"></span>
          </span>
          <span className="text-sm font-bold uppercase tracking-widest text-white">
            Discover Sri Lanka
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="font-sans text-5xl font-extrabold leading-tight text-white md:text-7xl lg:text-8xl drop-shadow-lg uppercase tracking-tight">
          An Island Escape <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-sky-100">
            Awaits You
          </span>
        </h1>

        {/* Subheadline */}
        <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-slate-200 md:text-2xl font-light">
          Hand-crafted tours, verified drivers, and smart AI recommendations.
          Explore the Pearl of the Indian Ocean the modern way.
        </p>

        {/* Call to Action Buttons */}
        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            onClick={() => navigate("/tours")}
            className="group relative flex items-center justify-center gap-3 rounded-full bg-sky-500 px-10 py-4 text-lg font-bold text-white shadow-xl shadow-sky-900/40 transition-all hover:bg-sky-400 hover:scale-105 hover:-translate-y-1"
          >
            <span>Explore Tours</span>
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
          </button>

          <button
            onClick={() => navigate("/ai-assistant")}
            className="group flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-10 py-4 text-lg font-bold text-white backdrop-blur-md transition-all hover:bg-white/20 hover:border-white/50 hover:-translate-y-1"
          >
            <span>Plan with AI</span>
            <span className="text-2xl">✨</span>
          </button>
        </div>

        {/* Bottom Trust Indicators */}
        <div className="mt-16 flex justify-center gap-8 text-sm font-medium text-slate-300">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 text-xl">★★★★★</span>
            <span>4.9/5 Rating</span>
          </div>
          <div className="h-6 w-px bg-white/20"></div>
          <div>1k+ Happy Travelers</div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
