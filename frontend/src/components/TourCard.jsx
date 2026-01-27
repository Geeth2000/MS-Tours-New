import { Link } from "react-router-dom";

const TourCard = ({ tour }) => {
  // LOGIC: Check heroImage -> then galleryImages -> then the 'images' field from Atlas -> then fallback
  const imageSrc =
    tour.heroImage ||
    tour.galleryImages?.[0] ||
    tour.images?.[0] ||
    "https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&w=800&q=80";

  return (
    <article className="card group overflow-hidden rounded-3xl bg-white shadow-soft transition hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={imageSrc}
          alt={tour.title}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-800 backdrop-blur-sm">
          {tour.category}
        </div>
      </div>

      <div className="flex flex-col gap-4 p-6">
        <div>
          <h3 className="text-xl font-bold text-accent">{tour.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm text-slate-500">
            {tour.description}
          </p>
        </div>

        <dl className="grid grid-cols-2 gap-4 rounded-2xl bg-slate-50 p-3 text-sm">
          <div>
            <dt className="text-xs font-semibold uppercase text-slate-400">
              Duration
            </dt>
            <dd className="font-semibold text-slate-700">
              {tour.durationDays} days
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase text-slate-400">
              From
            </dt>
            <dd className="font-semibold text-primary">
              LKR {tour.pricePerPerson?.toLocaleString()}
            </dd>
          </div>
        </dl>

        <Link
          to={`/tours/${tour.slug}`}
          className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white transition hover:bg-primary-dark"
        >
          View Itinerary
        </Link>
      </div>
    </article>
  );
};

export default TourCard;
