const StatCard = ({ icon, label, value, trend }) => (
  <article className="card">
    <div className="flex items-center gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-2xl text-primary">
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
        <p className="text-2xl font-bold text-accent">{value}</p>
        {trend && <p className="text-xs text-emerald-500">{trend}</p>}
      </div>
    </div>
  </article>
);

export default StatCard;
