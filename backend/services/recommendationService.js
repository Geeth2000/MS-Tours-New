import Tour from "../models/Tour.js";
import Package from "../models/Package.js";
import { getClaudeTravelReply, isClaudeEnabled } from "./claudeService.js";

const sriLankaPlaces = [
  {
    name: "Sigiriya Rock Fortress",
    category: "culture",
    budgetLevel: "mid",
    duration: 1,
    highlights: ["ancient", "heritage", "views"],
  },
  {
    name: "Ella",
    category: "nature",
    budgetLevel: "mid",
    duration: 2,
    highlights: ["mountains", "trains", "waterfalls"],
  },
  {
    name: "Yala National Park",
    category: "wildlife",
    budgetLevel: "high",
    duration: 1,
    highlights: ["safari", "leopard", "wildlife"],
  },
  {
    name: "Mirissa Beach",
    category: "beach",
    budgetLevel: "budget",
    duration: 2,
    highlights: ["beach", "relax", "whales"],
  },
  {
    name: "Kandy Cultural Triangle",
    category: "culture",
    budgetLevel: "mid",
    duration: 2,
    highlights: ["temples", "history", "dance"],
  },
  {
    name: "Nuwara Eliya",
    category: "nature",
    budgetLevel: "mid",
    duration: 2,
    highlights: ["tea", "cold", "scenery"],
  },
  {
    name: "Hikkaduwa",
    category: "beach",
    budgetLevel: "budget",
    duration: 2,
    highlights: ["snorkeling", "surf", "nightlife"],
  },
  {
    name: "Anuradhapura",
    category: "culture",
    budgetLevel: "budget",
    duration: 1,
    highlights: ["ruins", "history", "religion"],
  },
];

const mapBudget = (budget) => {
  if (budget <= 50000) return "budget";
  if (budget <= 150000) return "mid";
  return "high";
};

export const getSmartPlaceRecommendations = ({
  budget = 0,
  durationDays = 2,
  interests = [],
}) => {
  const budgetLevel = mapBudget(Number(budget));
  return sriLankaPlaces
    .filter((place) => {
      const matchesInterest = interests.length
        ? interests.includes(place.category)
        : true;
      const matchesBudget =
        place.budgetLevel === budgetLevel || budgetLevel === "high";
      const matchesDuration = place.duration <= durationDays;
      return matchesInterest && matchesBudget && matchesDuration;
    })
    .slice(0, 5);
};

export const getBestPackageRecommendations = async ({
  budget,
  durationDays,
}) => {
  const query = { status: "published" };
  if (budget) {
    query.$or = [
      { pricePerGroup: { $lte: Number(budget) } },
      { pricePerPerson: { $lte: Number(budget) } },
    ];
  }
  if (durationDays) {
    query.durationDays = { $lte: Number(durationDays) };
  }

  const packages = await Package.find(query)
    .sort({ "ratings.average": -1 })
    .limit(6)
    .populate("owner", "firstName lastName");

  return packages;
};

const chatResponses = [
  {
    keywords: ["weather", "climate"],
    response:
      "Sri Lanka has two monsoon seasons. For the south and west, visit between December and April. The east and north are best from May to September.",
  },
  {
    keywords: ["itinerary", "plan"],
    response:
      "A popular 7-day plan covers Colombo, Sigiriya, Kandy, Nuwara Eliya, Ella, and Mirissa. I can tailor it based on your interests.",
  },
  {
    keywords: ["visa"],
    response:
      "Most travelers need an ETA visa which can be applied online before arrival. It usually takes 24-48 hours for approval.",
  },
];

export const getTravelAssistantReply = async (question = "") => {
  const trimmedQuestion = question.trim();
  if (!trimmedQuestion) {
    return "I would love to help plan your trip. Tell me your travel month, budget, and interests!";
  }

  let featuredTours = [];

  if (isClaudeEnabled()) {
    try {
      featuredTours = await Tour.find({})
        .sort({ "ratings.average": -1 })
        .limit(5);
      const claudeReply = await getClaudeTravelReply(trimmedQuestion, {
        tours: featuredTours,
      });
      if (claudeReply) {
        return claudeReply;
      }
    } catch (error) {
      console.error("Claude travel assistant failed", error);
    }
  }

  const normalized = trimmedQuestion.toLowerCase();
  const matched = chatResponses.find((item) =>
    item.keywords.some((keyword) => normalized.includes(keyword)),
  );

  if (matched) {
    return matched.response;
  }

  if (!featuredTours.length) {
    featuredTours = await Tour.find({})
      .sort({ "ratings.average": -1 })
      .limit(3);
  }

  if (featuredTours.length) {
    const highlights = featuredTours
      .map((tour) => `${tour.title} (${tour.durationDays} days)`)
      .join(", ");
    return `I recommend considering ${highlights}. Let me know your budget and travel month to refine this further.`;
  }

  return "I would love to help plan your trip. Tell me your travel month, budget, and interests!";
};
