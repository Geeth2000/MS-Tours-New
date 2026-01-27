const PackageCard = ({ pkg, onSelect }) => (
  <article className="card">
    <div className="flex flex-col gap-4">
      <div>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          {pkg.packageType === "dayTrip" ? "Day Trip" : "Multi-Day"}
        </span>
        <h3 className="mt-3 text-lg font-semibold text-accent">{pkg.title}</h3>
        <p className="text-sm text-slate-500">{pkg.description}</p>
      </div>
      <dl className="grid grid-cols-2 gap-4 text-sm text-slate-600">
        <div>
          <dt className="font-medium">Duration</dt>
          <dd>{pkg.durationDays} day(s)</dd>
        </div>
        <div>
          <dt className="font-medium">Price</dt>
          <dd>
            {pkg.pricePerGroup
              ? `Group LKR ${pkg.pricePerGroup?.toLocaleString()}`
              : `Per person LKR ${pkg.pricePerPerson?.toLocaleString()}`}
          </dd>
        </div>
      </dl>
      {onSelect && (
        <button type="button" className="btn-primary" onClick={() => onSelect(pkg)}>
          Book Package
        </button>
      )}
    </div>
  </article>
);

export default PackageCard;
