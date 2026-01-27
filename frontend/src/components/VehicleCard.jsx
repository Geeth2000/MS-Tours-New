const VehicleCard = ({ vehicle, onSelect }) => (
  <article className="group overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition hover:border-sky-100 hover:shadow-lg">
    {/* Image Section */}
    <div className="relative h-48 w-full overflow-hidden bg-slate-100">
      {vehicle.images && vehicle.images.length > 0 ? (
        <img
          src={vehicle.images[0]}
          alt={vehicle.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-slate-300">
          <span className="text-4xl">🚗</span>
        </div>
      )}
      <div className="absolute top-3 right-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-700 backdrop-blur-sm">
        {vehicle.type}
      </div>
    </div>

    {/* Content Section */}
    <div className="p-5">
      <div className="mb-3">
        <h3 className="text-lg font-bold text-slate-800">{vehicle.title}</h3>
        <p className="text-sm text-slate-500 line-clamp-2">
          {vehicle.description || "Reliable vehicle with professional driver"}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
        <div>
          <p className="text-xs font-bold uppercase text-slate-400">
            Rate per Day
          </p>
          <p className="text-lg font-bold text-sky-600">
            LKR {vehicle.pricePerDay?.toLocaleString()}
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs font-bold uppercase text-slate-400">Capacity</p>
          <p className="text-sm font-semibold text-slate-700">
            {vehicle.seatingCapacity} Seats
          </p>
        </div>
      </div>

      {onSelect && (
        <button
          type="button"
          className="mt-4 w-full rounded-xl bg-sky-500 py-2.5 text-sm font-bold text-white transition hover:bg-sky-600 hover:shadow-md"
          onClick={() => onSelect(vehicle)}
        >
          Book Now
        </button>
      )}
    </div>
  </article>
);

export default VehicleCard;
