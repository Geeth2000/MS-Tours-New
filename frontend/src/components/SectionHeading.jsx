const SectionHeading = ({ title, subtitle, cta }) => (
  <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
    <div>
      <h2 className="text-2xl font-semibold text-accent md:text-3xl">{title}</h2>
      {subtitle && <p className="mt-2 max-w-2xl text-sm text-slate-500">{subtitle}</p>}
    </div>
    {cta}
  </div>
);

export default SectionHeading;
