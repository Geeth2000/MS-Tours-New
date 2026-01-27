import mongoose from "mongoose";
import slugify from "slugify";

const itineraryDaySchema = new mongoose.Schema(
  {
    day: Number,
    title: String,
    description: String,
  },
  { _id: false },
);

const tourSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    durationDays: {
      type: Number,
      required: true,
    },
    pricePerPerson: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      enum: [
        "beach",
        "culture",
        "nature",
        "adventure",
        "wildlife",
        "heritage",
        "wellness",
      ],
      required: true,
    },
    locations: [String],
    highlights: [String],
    itinerary: [itineraryDaySchema],
    includes: [String],
    excludes: [String],

    // --- UPDATED SECTION ---
    // Added 'images' to allow Atlas data to pass through
    images: [String],
    // -----------------------

    heroImage: String,
    galleryImages: [String],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    ratings: {
      average: {
        type: Number,
        default: 0,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    tags: [String],
    seasonalAvailability: {
      startMonth: Number,
      endMonth: Number,
    },
  },
  { timestamps: true },
);

tourSchema.pre("validate", function createSlug(next) {
  if (this.isModified("title") || !this.slug) {
    const base = slugify(this.title, { lower: true, strict: true });
    this.slug = `${base}-${Date.now()}`;
  }
  next();
});

tourSchema.index({ category: 1, pricePerPerson: 1 });

const Tour = mongoose.model("Tour", tourSchema);

export default Tour;
