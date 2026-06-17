import React, { useState } from "react";

const SUGGESTIONS = [
  "I want a phone under $500",
  "Suggest a budget phone with a good camera",
  "Recommend an Android phone below $600",
  "Show me high-end Apple iPhones with awesome performance"
];

/**
 * RecommendationForm component.
 * Allows entering preferences or choosing default suggestions.
 * 
 * @param {Object} props
 * @param {function} props.onSubmit - Submission callback receiving query string
 * @param {boolean} props.isLoading - Current GenAI loading state
 * @param {function} props.onReset - Reset recommendations state
 * @param {boolean} props.hasRecommendations - True if suggestions are currently filtered
 */
export default function RecommendationForm({ onSubmit, isLoading, onReset, hasRecommendations }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;
    onSubmit(query.trim());
  };

  const handleSuggestionClick = (text) => {
    setQuery(text);
    onSubmit(text);
  };

  return (
    <div className="search-card" id="search-card">
      <h2>Search with AI</h2>
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-wrapper">
          <input
            type="text"
            className="search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type your phone preference (e.g. 'phone under $500 with a clean Android interface')..."
            disabled={isLoading}
            id="search-input"
          />
        </div>
        <button type="submit" className="btn-submit" disabled={isLoading || !query.trim()} id="btn-submit">
          {isLoading ? "Analyzing..." : "Ask Gemini"}
        </button>
      </form>

      <div className="suggestion-pills-container">
        <p className="suggestions-label">Try clicking these queries:</p>
        <div className="suggestions-list">
          {SUGGESTIONS.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              className="suggestion-pill"
              onClick={() => handleSuggestionClick(suggestion)}
              disabled={isLoading}
              id={`pill-${index}`}
            >
              {suggestion}
            </button>
          ))}
          {hasRecommendations && (
            <button
              type="button"
              className="clear-btn"
              onClick={() => {
                setQuery("");
                onReset();
              }}
              id="btn-clear-filters"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
