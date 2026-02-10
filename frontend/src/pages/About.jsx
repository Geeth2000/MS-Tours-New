import { Link } from "react-router-dom";

const stats = [
  { value: "10K+", label: "Happy Travelers" },
  { value: "500+", label: "Tours Completed" },
  { value: "150+", label: "Destinations" },
  { value: "4.9", label: "Average Rating" },
];

const values = [
  {
    icon: "🌍",
    title: "Authentic Experiences",
    description:
      "We connect you with local guides and hidden gems that mainstream tourism overlooks.",
  },
  {
    icon: "🤝",
    title: "Community First",
    description:
      "Empowering local vehicle owners and guides to build sustainable livelihoods.",
  },
  {
    icon: "🛡️",
    title: "Safe & Reliable",
    description:
      "Every partner is verified. Every journey is insured. Your safety is our priority.",
  },
  {
    icon: "✨",
    title: "Personalized Journeys",
    description:
      "AI-powered recommendations tailored to your interests, budget, and travel style.",
  },
];

const team = [
  {
    name: "Malith Fernando",
    role: "Co-Founder & CEO",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
  },
  {
    name: "Shenali Perera",
    role: "Co-Founder & CTO",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=face",
  },
  {
    name: "Kavinda Silva",
    role: "Head of Operations",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
  },
];

const About = () => (
  <div className="space-y-16 pb-16">
    {/* Hero Section */}
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-600 via-blue-600 to-indigo-600 px-8 py-16 text-white shadow-xl md:px-16 md:py-24">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200')] bg-cover bg-center opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <span className="mb-4 inline-block rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
          🌴 Discover Sri Lanka
        </span>
        <h1 className="text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
          Travel Beyond the Ordinary
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-white/90 md:text-xl">
          M&S Tours is Sri Lanka's premier travel technology platform,
          connecting adventurous travelers with authentic local experiences,
          verified guides, and seamless booking.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            to="/tours"
            className="rounded-xl bg-white px-6 py-3 font-semibold text-sky-700 shadow-lg transition hover:bg-sky-50 hover:shadow-xl"
          >
            Explore Tours
          </Link>
          <Link
            to="/contact"
            className="rounded-xl border-2 border-white/30 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
          >
            Get in Touch
          </Link>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-300/20 blur-3xl" />
    </section>

    {/* Stats Section */}
    <section className="grid grid-cols-2 gap-6 md:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="group rounded-2xl bg-white p-6 text-center shadow-soft transition hover:shadow-lg"
        >
          <div className="text-3xl font-bold text-sky-600 md:text-4xl">
            {stat.value}
          </div>
          <div className="mt-2 text-sm font-medium text-slate-500">
            {stat.label}
          </div>
        </div>
      ))}
    </section>

    {/* Mission Section */}
    <section className="grid items-center gap-12 md:grid-cols-2">
      <div className="relative">
        <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-sky-100 to-blue-100 opacity-60 blur-2xl" />
        <img
          src="https://images.unsplash.com/photo-1588598198321-9735fd510221?w=600&h=400&fit=crop"
          alt="Sri Lanka landscape"
          className="relative rounded-3xl object-cover shadow-xl"
        />
      </div>
      <div>
        <span className="text-sm font-semibold uppercase tracking-wider text-sky-600">
          Our Mission
        </span>
        <h2 className="mt-2 text-3xl font-bold text-slate-800 md:text-4xl">
          Empowering Local Communities, Enriching Traveler Experiences
        </h2>
        <p className="mt-4 text-slate-600">
          We believe travel should benefit everyone—the explorer seeking
          adventure, the guide sharing their heritage, and the communities
          welcoming visitors. M&S Tours bridges these worlds through technology,
          transparency, and trust.
        </p>
        <p className="mt-4 text-slate-600">
          From cultural expeditions in the hill country to coastal escapes along
          pristine beaches, we curate journeys that leave lasting impressions
          while supporting sustainable tourism across Sri Lanka.
        </p>
        <div className="mt-6 flex items-center gap-4">
          <div className="flex -space-x-3">
            {team.map((member, i) => (
              <img
                key={i}
                src={member.image}
                alt={member.name}
                className="h-10 w-10 rounded-full border-2 border-white object-cover shadow"
              />
            ))}
          </div>
          <span className="text-sm text-slate-500">
            Founded by passionate Sri Lankan travel enthusiasts
          </span>
        </div>
      </div>
    </section>

    {/* Values Section */}
    <section>
      <div className="mb-10 text-center">
        <span className="text-sm font-semibold uppercase tracking-wider text-sky-600">
          Why Choose Us
        </span>
        <h2 className="mt-2 text-3xl font-bold text-slate-800">
          What Sets Us Apart
        </h2>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {values.map((value) => (
          <div
            key={value.title}
            className="group rounded-2xl bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-50 to-blue-50 text-3xl transition group-hover:scale-110">
              {value.icon}
            </div>
            <h3 className="text-lg font-semibold text-slate-800">
              {value.title}
            </h3>
            <p className="mt-2 text-sm text-slate-500">{value.description}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Team Section */}
    <section className="rounded-3xl bg-gradient-to-br from-slate-50 to-sky-50/50 p-8 md:p-12">
      <div className="mb-10 text-center">
        <span className="text-sm font-semibold uppercase tracking-wider text-sky-600">
          The Team
        </span>
        <h2 className="mt-2 text-3xl font-bold text-slate-800">
          Meet the Founders
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-slate-500">
          A passionate team of travel enthusiasts and tech innovators dedicated
          to transforming how you explore Sri Lanka.
        </p>
      </div>
      <div className="mx-auto grid max-w-3xl gap-8 sm:grid-cols-3">
        {team.map((member) => (
          <div key={member.name} className="group text-center">
            <div className="relative mx-auto mb-4 h-32 w-32 overflow-hidden rounded-full shadow-lg transition group-hover:shadow-xl">
              <img
                src={member.image}
                alt={member.name}
                className="h-full w-full object-cover transition group-hover:scale-110"
              />
              <div className="absolute inset-0 rounded-full ring-4 ring-sky-500/20" />
            </div>
            <h3 className="font-semibold text-slate-800">{member.name}</h3>
            <p className="text-sm text-sky-600">{member.role}</p>
          </div>
        ))}
      </div>
    </section>

    {/* CTA Section */}
    <section className="rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800 p-8 text-center text-white shadow-xl md:p-12">
      <h2 className="text-2xl font-bold md:text-3xl">
        Ready to Start Your Adventure?
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-slate-300">
        Join thousands of travelers who've discovered the magic of Sri Lanka
        with M&S Tours. Your perfect journey awaits.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          to="/plan-trip"
          className="rounded-xl bg-gradient-to-r from-sky-500 to-blue-500 px-8 py-3 font-semibold text-white shadow-lg transition hover:from-sky-600 hover:to-blue-600 hover:shadow-xl"
        >
          Plan Your Trip
        </Link>
        <Link
          to="/register"
          className="rounded-xl border border-white/20 bg-white/10 px-8 py-3 font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
        >
          Join as Partner
        </Link>
      </div>
    </section>
  </div>
);

export default About;
