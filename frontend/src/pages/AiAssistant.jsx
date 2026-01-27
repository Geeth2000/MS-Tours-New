import { useState } from "react";
import { askTravelAssistant, getPlaceRecommendations, getPackageRecommendations } from "../services/aiService.js";
import SectionHeading from "../components/SectionHeading.jsx";
import { handleApiError } from "../services/apiClient.js";

const interestsOptions = ["beach", "nature", "culture", "wildlife", "adventure", "wellness"];

const AiAssistant = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(null);
  const [recommendations, setRecommendations] = useState({ places: [], packages: [] });
  const [inputs, setInputs] = useState({ budget: "", durationDays: "", interests: [] });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const toggleInterest = (interest) => {
    setInputs((prev) => {
      const exists = prev.interests.includes(interest);
      return {
        ...prev,
        interests: exists ? prev.interests.filter((item) => item !== interest) : [...prev.interests, interest],
      };
    });
  };

  const handleAsk = async (event) => {
    event.preventDefault();
    if (!question) return;
    setLoading(true);
    setError(null);
    try {
      const response = await askTravelAssistant(question);
      setAnswer(response.answer);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleRecommend = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const placeRes = await getPlaceRecommendations(inputs);
      const packageRes = await getPackageRecommendations(inputs);
      setRecommendations({ places: placeRes || [], packages: packageRes || [] });
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <SectionHeading
        title="AI Travel Assistant"
        subtitle="Get instant guidance, curated suggestions, and personalized itineraries for Sri Lanka."
      />

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">{error}</div>
      )}

      <section className="grid gap-6 rounded-3xl bg-white p-8 shadow-soft md:grid-cols-2">
        <form onSubmit={handleAsk} className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-accent">Ask a travel question</h2>
          <textarea
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            rows={5}
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm"
            placeholder="Example: What's the best itinerary for a 5-day Sri Lanka trip?"
          />
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Thinking..." : "Ask the Assistant"}
          </button>
          {answer && <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">{answer}</p>}
        </form>

        <form onSubmit={handleRecommend} className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-accent">Smart recommendations</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-slate-600">
              Budget (LKR)
              <input
                type="number"
                value={inputs.budget}
                onChange={(event) => setInputs((prev) => ({ ...prev, budget: event.target.value }))}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2"
              />
            </label>
            <label className="text-sm font-medium text-slate-600">
              Duration (Days)
              <input
                type="number"
                value={inputs.durationDays}
                onChange={(event) => setInputs((prev) => ({ ...prev, durationDays: event.target.value }))}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2"
              />
            </label>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-600">Interests</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {interestsOptions.map((interest) => {
                const active = inputs.interests.includes(interest);
                return (
                  <button
                    type="button"
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      active ? "bg-primary text-white" : "bg-slate-100 text-slate-600 hover:bg-primary/10"
                    }`}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Curating..." : "Generate Recommendations"}
          </button>
        </form>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow-soft">
          <h3 className="text-lg font-semibold text-accent">Suggested Places</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            {recommendations.places.length === 0 && <li>No suggestions yet. Provide your preferences.</li>}
            {recommendations.places.map((place) => (
              <li key={place.name} className="rounded-2xl border border-slate-100 p-4">
                <p className="font-semibold text-accent">{place.name}</p>
                <p className="text-xs uppercase tracking-wide text-primary">{place.category}</p>
                <p className="mt-2">Ideal for {place.duration} day(s) • {place.budgetLevel} budgets</p>
                <p className="mt-2 text-slate-500">Highlights: {place.highlights.join(", ")}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-soft">
          <h3 className="text-lg font-semibold text-accent">Recommended Packages</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            {recommendations.packages.length === 0 && <li>Sign in to view personalized package recommendations.</li>}
            {recommendations.packages.map((pkg) => (
              <li key={pkg._id} className="rounded-2xl border border-slate-100 p-4">
                <p className="font-semibold text-accent">{pkg.title}</p>
                <p className="text-xs uppercase tracking-wide text-primary">{pkg.packageType}</p>
                <p className="mt-2">
                  {pkg.pricePerGroup
                    ? `Group rate LKR ${pkg.pricePerGroup?.toLocaleString()}`
                    : `Per person LKR ${pkg.pricePerPerson?.toLocaleString()}`}
                </p>
                <p className="mt-2 text-slate-500">Duration: {pkg.durationDays} day(s)</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default AiAssistant;
