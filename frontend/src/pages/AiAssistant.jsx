import { useState } from "react";
import {
  askTravelAssistant,
  getPlaceRecommendations,
  getPackageRecommendations,
} from "../services/aiService.js";
import SectionHeading from "../components/SectionHeading.jsx";
import { handleApiError } from "../services/apiClient.js";

const interestsOptions = [
  "beach",
  "nature",
  "culture",
  "wildlife",
  "adventure",
  "wellness",
];

const AiAssistant = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(null);
  const [recommendations, setRecommendations] = useState({
    places: [],
    packages: [],
  });
  const [inputs, setInputs] = useState({
    budget: "",
    durationDays: "",
    interests: [],
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const toggleInterest = (interest) => {
    setInputs((prev) => {
      const exists = prev.interests.includes(interest);
      return {
        ...prev,
        interests: exists
          ? prev.interests.filter((item) => item !== interest)
          : [...prev.interests, interest],
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
      setRecommendations({
        places: placeRes || [],
        packages: packageRes || [],
      });
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-700 pb-32">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute left-1/4 top-1/4 h-96 w-96 animate-pulse rounded-full bg-white blur-3xl" />
          <div
            className="absolute right-1/4 bottom-1/4 h-96 w-96 animate-pulse rounded-full bg-pink-300 blur-3xl"
            style={{ animationDelay: "2s" }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pt-16 pb-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-4 py-2 mb-4">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              <span className="text-xs font-semibold uppercase tracking-widest text-white/90">
                AI-Powered
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              Your Smart Travel
              <span className="block mt-2 bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                Assistant for Sri Lanka
              </span>
            </h1>
            <p className="text-lg text-violet-100 max-w-2xl mx-auto">
              Get instant guidance, curated suggestions, and personalized
              itineraries powered by AI
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">🤖</div>
              <div className="text-sm text-violet-200 mt-2">AI-Powered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">⚡</div>
              <div className="text-sm text-violet-200 mt-2">
                Instant Answers
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">🎯</div>
              <div className="text-sm text-violet-200 mt-2">Personalized</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative mx-auto -mt-24 max-w-7xl px-4 pb-16">
        {/* Error Display */}
        {error && (
          <div className="mb-8 rounded-3xl border-2 border-red-200 bg-red-50 p-6 shadow-lg">
            <div className="flex items-center gap-3">
              <span className="text-3xl">⚠️</span>
              <p className="text-red-600 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Main Cards */}
        <section className="grid gap-8 lg:grid-cols-2 mb-12">
          {/* Ask Question Card */}
          <form
            onSubmit={handleAsk}
            className="relative overflow-hidden rounded-3xl bg-white shadow-2xl"
          >
            <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-purple-400 via-violet-500 to-indigo-600 p-1 opacity-20" />

            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 text-2xl shadow-lg">
                  💬
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">
                    Ask Me Anything
                  </h2>
                  <p className="text-sm text-slate-500">
                    Get instant travel advice
                  </p>
                </div>
              </div>

              <textarea
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                rows={5}
                className="w-full rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white px-5 py-4 text-slate-700 placeholder:text-slate-400 transition focus:border-purple-400 focus:shadow-lg focus:shadow-purple-100 focus:outline-none resize-none"
                placeholder="Example: What's the best itinerary for a 5-day Sri Lanka trip? 🗺️"
              />

              <button
                type="submit"
                className="group mt-4 w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 via-violet-600 to-indigo-600 px-6 py-4 font-bold text-white shadow-xl shadow-purple-200 transition hover:shadow-2xl hover:shadow-purple-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span>Thinking...</span>
                  </>
                ) : (
                  <>
                    <span>Ask the Assistant</span>
                    <span className="text-xl transition-transform group-hover:translate-x-1">
                      🚀
                    </span>
                  </>
                )}
              </button>

              {answer && (
                <div className="mt-6 rounded-2xl bg-gradient-to-br from-violet-50 to-purple-50 p-6 border-2 border-violet-100 shadow-inner">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">💡</span>
                    <div className="flex-1">
                      <p className="text-xs font-bold uppercase tracking-wider text-violet-600 mb-2">
                        AI Response
                      </p>
                      <p className="text-slate-700 leading-relaxed">{answer}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </form>

          {/* Get Recommendations Card */}
          <form
            onSubmit={handleRecommend}
            className="relative overflow-hidden rounded-3xl bg-white shadow-2xl"
          >
            <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-600 p-1 opacity-20" />

            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-2xl shadow-lg">
                  ✨
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">
                    Smart Recommendations
                  </h2>
                  <p className="text-sm text-slate-500">
                    Personalized suggestions
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Budget & Duration */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600">
                      <span className="text-lg">💰</span>
                      Budget (LKR)
                    </label>
                    <input
                      type="number"
                      value={inputs.budget}
                      onChange={(event) =>
                        setInputs((prev) => ({
                          ...prev,
                          budget: event.target.value,
                        }))
                      }
                      className="w-full rounded-xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white px-4 py-3 text-sm font-medium text-slate-700 placeholder:text-slate-400 transition focus:border-indigo-400 focus:shadow-lg focus:shadow-indigo-100 focus:outline-none"
                      placeholder="50000"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600">
                      <span className="text-lg">📅</span>
                      Duration (Days)
                    </label>
                    <input
                      type="number"
                      value={inputs.durationDays}
                      onChange={(event) =>
                        setInputs((prev) => ({
                          ...prev,
                          durationDays: event.target.value,
                        }))
                      }
                      className="w-full rounded-xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white px-4 py-3 text-sm font-medium text-slate-700 placeholder:text-slate-400 transition focus:border-indigo-400 focus:shadow-lg focus:shadow-indigo-100 focus:outline-none"
                      placeholder="7"
                    />
                  </div>
                </div>

                {/* Interests */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600">
                    <span className="text-lg">❤️</span>
                    Your Interests
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {interestsOptions.map((interest) => {
                      const active = inputs.interests.includes(interest);
                      return (
                        <button
                          type="button"
                          key={interest}
                          onClick={() => toggleInterest(interest)}
                          className={`rounded-xl px-5 py-2.5 text-sm font-bold transition-all ${
                            active
                              ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-200 scale-105"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:scale-105"
                          }`}
                        >
                          {interest}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="group mt-6 w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 px-6 py-4 font-bold text-white shadow-xl shadow-indigo-200 transition hover:shadow-2xl hover:shadow-indigo-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span>Curating...</span>
                  </>
                ) : (
                  <>
                    <span>Generate Recommendations</span>
                    <span className="text-xl transition-transform group-hover:translate-x-1">
                      🎯
                    </span>
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        {/* Recommendations Display */}
        <section className="grid gap-8 lg:grid-cols-2">
          {/* Places */}
          <div className="relative overflow-hidden rounded-3xl bg-white shadow-xl">
            <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 p-1 opacity-10" />

            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-xl shadow-lg">
                  📍
                </div>
                <h3 className="text-2xl font-bold text-slate-800">
                  Suggested Places
                </h3>
              </div>

              {recommendations.places.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-12 text-center">
                  <div className="text-5xl mb-3">🗺️</div>
                  <p className="text-slate-500 font-medium">
                    No suggestions yet
                  </p>
                  <p className="text-sm text-slate-400 mt-1">
                    Provide your preferences to get started
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  {recommendations.places.map((place) => (
                    <div
                      key={place.name}
                      className="rounded-2xl border-2 border-emerald-100 bg-gradient-to-br from-white to-emerald-50 p-5 transition hover:border-emerald-200 hover:shadow-lg hover:scale-[1.02]"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-lg font-bold text-slate-800">
                            {place.name}
                          </p>
                          <div className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1">
                            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                              {place.category}
                            </span>
                          </div>
                        </div>
                        <span className="text-2xl">🌟</span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                        <span className="flex items-center gap-1">
                          <span>📅</span>
                          {place.duration} day(s)
                        </span>
                        <span className="flex items-center gap-1">
                          <span>💰</span>
                          {place.budgetLevel}
                        </span>
                      </div>

                      <div className="rounded-xl bg-white p-3 border border-emerald-100">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                          Highlights
                        </p>
                        <p className="text-sm text-slate-700">
                          {place.highlights.join(" • ")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Packages */}
          <div className="relative overflow-hidden rounded-3xl bg-white shadow-xl">
            <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-orange-400 via-pink-500 to-rose-600 p-1 opacity-10" />

            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-pink-600 text-xl shadow-lg">
                  📦
                </div>
                <h3 className="text-2xl font-bold text-slate-800">
                  Recommended Packages
                </h3>
              </div>

              {recommendations.packages.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-12 text-center">
                  <div className="text-5xl mb-3">🎁</div>
                  <p className="text-slate-500 font-medium">No packages yet</p>
                  <p className="text-sm text-slate-400 mt-1">
                    Sign in to view personalized recommendations
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  {recommendations.packages.map((pkg) => (
                    <div
                      key={pkg._id}
                      className="rounded-2xl border-2 border-orange-100 bg-gradient-to-br from-white to-orange-50 p-5 transition hover:border-orange-200 hover:shadow-lg hover:scale-[1.02]"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-lg font-bold text-slate-800">
                            {pkg.title}
                          </p>
                          <div className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1">
                            <span className="text-xs font-bold uppercase tracking-wider text-orange-700">
                              {pkg.packageType}
                            </span>
                          </div>
                        </div>
                        <span className="text-2xl">🎯</span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span>💰</span>
                          <span className="text-lg font-bold text-slate-800">
                            LKR{" "}
                            {(
                              pkg.pricePerGroup || pkg.pricePerPerson
                            )?.toLocaleString()}
                          </span>
                          <span className="text-xs text-slate-500">
                            {pkg.pricePerGroup ? "/ group" : "/ person"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <span>📅</span>
                          <span>{pkg.durationDays} day(s)</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AiAssistant;
