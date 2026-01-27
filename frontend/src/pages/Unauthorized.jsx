const Unauthorized = () => (
  <div className="rounded-3xl bg-white p-6 text-center shadow-soft">
    <h1 className="text-2xl font-semibold text-accent">Access Restricted</h1>
    <p className="mt-3 text-sm text-slate-600">
      You do not have permission to view this section. Please contact support if you believe this is an
      error.
    </p>
  </div>
);

export default Unauthorized;
