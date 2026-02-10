import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const contactInfo = [
  {
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
        />
      </svg>
    ),
    title: "Visit Us",
    details: ["123 Galle Road, Colombo 04", "Sri Lanka"],
    color: "sky",
  },
  {
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
        />
      </svg>
    ),
    title: "Email Us",
    details: ["support@mstours.lk", "bookings@mstours.lk"],
    color: "blue",
  },
  {
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
        />
      </svg>
    ),
    title: "Call Us",
    details: ["+94 77 123 4567", "+94 11 234 5678"],
    color: "purple",
  },
  {
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    title: "Working Hours",
    details: ["Mon - Sat: 8:00 AM - 6:00 PM", "Sunday: 9:00 AM - 3:00 PM"],
    color: "amber",
  },
];

const faqs = [
  {
    question: "How do I book a tour?",
    answer:
      "Simply browse our tours, select your preferred dates, and complete the booking. You'll receive instant confirmation.",
  },
  {
    question: "Can I customize my itinerary?",
    answer:
      "Absolutely! Use our Plan Trip feature or contact us directly for a fully personalized travel experience.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards, bank transfers, and popular digital payment methods.",
  },
  {
    question: "Is there a cancellation policy?",
    answer:
      "Free cancellation up to 48 hours before your trip. Check individual tour pages for specific policies.",
  },
];

const colorClasses = {
  sky: "bg-sky-50 text-sky-600 group-hover:bg-sky-100",
  blue: "bg-blue-50 text-blue-600 group-hover:bg-blue-100",
  purple: "bg-purple-50 text-purple-600 group-hover:bg-purple-100",
  amber: "bg-amber-50 text-amber-600 group-hover:bg-amber-100",
};

const Contact = () => {
  const [expandedFaq, setExpandedFaq] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Message sent! We'll get back to you within 24 hours.");
    reset();
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 px-8 py-16 text-white shadow-xl md:px-16 md:py-20">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1200')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <span className="mb-4 inline-block rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
            💬 We're Here to Help
          </span>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">
            Get in Touch
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">
            Have questions about your next adventure? Need a custom itinerary?
            Our travel experts are ready to assist you 24/7.
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-purple-300/20 blur-3xl" />
      </section>

      {/* Contact Cards */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {contactInfo.map((info) => (
          <div
            key={info.title}
            className="group rounded-2xl bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div
              className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition ${colorClasses[info.color]}`}
            >
              {info.icon}
            </div>
            <h3 className="font-semibold text-slate-800">{info.title}</h3>
            <div className="mt-2 space-y-1">
              {info.details.map((detail, i) => (
                <p key={i} className="text-sm text-slate-500">
                  {detail}
                </p>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Contact Form & Map */}
      <section className="grid gap-8 lg:grid-cols-2">
        {/* Form */}
        <div className="rounded-3xl bg-white p-8 shadow-soft">
          <h2 className="text-2xl font-bold text-slate-800">Send a Message</h2>
          <p className="mt-2 text-slate-500">
            Fill out the form below and we'll respond within 24 hours.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">
                  Full Name
                </span>
                <input
                  type="text"
                  {...register("name", { required: true })}
                  placeholder="John Doe"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">
                  Email Address
                </span>
                <input
                  type="email"
                  {...register("email", { required: true })}
                  placeholder="john@example.com"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">
                Phone Number (Optional)
              </span>
              <input
                type="tel"
                {...register("phone")}
                placeholder="+94 77 123 4567"
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">
                Subject
              </span>
              <select
                {...register("subject")}
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="general">General Inquiry</option>
                <option value="booking">Booking Question</option>
                <option value="custom">Custom Trip Request</option>
                <option value="partnership">Partnership Opportunity</option>
                <option value="support">Technical Support</option>
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">
                Message
              </span>
              <textarea
                {...register("message", { required: true })}
                rows={4}
                placeholder="Tell us how we can help you..."
                className="mt-1.5 w-full resize-none rounded-xl border border-slate-200 px-4 py-2.5 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>

        {/* Map & Quick Links */}
        <div className="space-y-6">
          {/* Map */}
          <div className="h-64 overflow-hidden rounded-3xl shadow-soft lg:h-80">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.923665983044!2d79.8546!3d6.8865!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwNTMnMTEuNCJOIDc5wrA1MScxNi42IkU!5e0!3m2!1sen!2slk!4v1600000000000!5m2!1sen!2slk"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="M&S Tours Location"
            />
          </div>

          {/* Social Links */}
          <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white shadow-soft">
            <h3 className="font-semibold">Follow Us</h3>
            <p className="mt-1 text-sm text-slate-400">
              Stay updated with travel tips and exclusive offers
            </p>
            <div className="mt-4 flex gap-3">
              {["Facebook", "Instagram", "Twitter", "YouTube"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-sm font-medium transition hover:bg-white/20"
                >
                  {social[0]}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="rounded-3xl bg-gradient-to-br from-slate-50 to-blue-50/50 p-8 md:p-12">
        <div className="mb-8 text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            FAQ
          </span>
          <h2 className="mt-2 text-3xl font-bold text-slate-800">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="mx-auto max-w-2xl space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl bg-white shadow-soft"
            >
              <button
                onClick={() =>
                  setExpandedFaq(expandedFaq === index ? null : index)
                }
                className="flex w-full items-center justify-between p-5 text-left transition hover:bg-slate-50"
              >
                <span className="font-medium text-slate-800">
                  {faq.question}
                </span>
                <svg
                  className={`h-5 w-5 text-slate-400 transition-transform ${
                    expandedFaq === index ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </button>
              {expandedFaq === index && (
                <div className="border-t border-slate-100 px-5 py-4">
                  <p className="text-sm text-slate-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Contact;
