import Anthropic from "@anthropic-ai/sdk";

const apiKey = process.env.ANTHROPIC_API_KEY || "";
const defaultModel = process.env.ANTHROPIC_MODEL || "claude-4.5-haiku";

let cachedClient;
let clientInitError;

const getClient = () => {
  if (cachedClient || clientInitError) {
    return cachedClient;
  }

  if (!apiKey) {
    clientInitError = new Error("ANTHROPIC_API_KEY is not configured");
    return undefined;
  }

  cachedClient = new Anthropic({ apiKey });
  return cachedClient;
};

export const isClaudeEnabled = () => Boolean(getClient());

const formatTourContext = (tours = []) => {
  if (!Array.isArray(tours) || tours.length === 0) {
    return "No curated tours currently available.";
  }

  return tours
    .map((tour, index) => {
      const duration = tour.durationDays
        ? `${tour.durationDays} days`
        : "Duration unavailable";
      const price = tour.basePrice
        ? `Approx. price ${tour.basePrice}`
        : "Pricing on request";
      const rating = tour.ratings?.average
        ? `Rating ${tour.ratings.average.toFixed(1)}/5`
        : "Rating pending";
      return `${index + 1}. ${tour.title} (${duration}) – ${rating}, ${price}`;
    })
    .join("\n");
};

export const getClaudeTravelReply = async (question, { tours = [] } = {}) => {
  const client = getClient();
  if (!client) {
    throw clientInitError || new Error("Claude client unavailable");
  }

  const trimmedQuestion = (question || "").trim();
  if (!trimmedQuestion) {
    throw new Error("Question is required for Claude travel reply");
  }

  const tourContext = formatTourContext(tours);
  const prompt = [
    "You are the official travel assistant for M&S Tours in Sri Lanka.",
    "Provide concise, practical guidance tailored to leisure travelers.",
    "Use friendly but professional tone, rely on provided tour context when relevant, and keep answers under 180 words.",
    "Always invite the traveler to share budget, dates, or preferences if more detail would help.",
    "Include at most three numbered suggestions when recommending activities or itineraries.",
    "If the user asks for something outside Sri Lanka, politely clarify that you focus on Sri Lanka but still give a helpful lead if possible.",
  ].join(" \n");

  const userContent = [
    `Traveler question: ${trimmedQuestion}`,
    "\nCurrent featured tours:",
    tourContext,
  ].join("\n");

  const response = await client.messages.create({
    model: defaultModel,
    max_tokens: 400,
    temperature: 0.6,
    system: prompt,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: userContent,
          },
        ],
      },
    ],
  });

  const textBlock = response.content?.find((block) => block.type === "text");
  if (!textBlock || !textBlock.text) {
    throw new Error("Claude response did not include text content");
  }

  return textBlock.text.trim();
};
