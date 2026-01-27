const Contact = () => (
  <div className="flex flex-col gap-6 rounded-3xl bg-white p-8 shadow-soft">
    <h1 className="text-3xl font-semibold text-accent">Contact Us</h1>
    <p className="text-sm text-slate-600">
      Have questions or need a custom itinerary? Reach out to the M&S Tours support team and we will get back
      to you within 24 hours.
    </p>
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-2xl border border-slate-100 p-5">
        <h2 className="text-lg font-semibold text-accent">Head Office</h2>
        <p className="mt-2 text-sm text-slate-600">
          123 Galle Road, Colombo 04<br />Sri Lanka
        </p>
      </div>
      <div className="rounded-2xl border border-slate-100 p-5">
        <h2 className="text-lg font-semibold text-accent">Support</h2>
        <p className="mt-2 text-sm text-slate-600">
          Email: support@mstours.lk<br />Hotline: +94 77 123 4567
        </p>
      </div>
    </div>
    <form className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <input type="text" placeholder="Your name" className="rounded-xl border border-slate-200 px-4 py-2" />
        <input type="email" placeholder="Email address" className="rounded-xl border border-slate-200 px-4 py-2" />
      </div>
      <textarea rows="4" placeholder="How can we help?" className="w-full rounded-xl border border-slate-200 px-4 py-2" />
      <button type="button" className="btn-primary">Send Message</button>
    </form>
  </div>
);

export default Contact;
