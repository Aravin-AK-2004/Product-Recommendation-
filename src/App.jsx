import React, { useState } from "react";
import { products } from "./data/products";
import { recommendProducts } from "./services/gemini";
import RecommendationForm from "./components/RecommendationForm";
import ProductCard from "./components/ProductCard";

export default function App() {
  const [recommendedIds, setRecommendedIds] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastQuery, setLastQuery] = useState("");

  // Check if API key is injected correctly
  const hasApiKey = !!(import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY);

  const handleRecommendationSubmit = async (query) => {
    setIsLoading(true);
    setError(null);
    setLastQuery(query);

    try {
      const ids = await recommendProducts(query, products);
      setRecommendedIds(ids);
    } catch (err) {
      setError(err.message || "Something went wrong during product recommendation.");
      setRecommendedIds([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setRecommendedIds(null);
    setError(null);
    setLastQuery("");
  };

  // Derive matching and remaining product collections
  const recommendedProducts = recommendedIds
    ? products.filter((p) => recommendedIds.includes(p.id))
    : [];

  return (
    <div className="app-container" id="app-root">
      <header className="header">
        <h1>SmartSelect AI</h1>
        <p>Intelligent, real-time smartphone recommendation powered by Google Gemini</p>
      </header>

      {/* Warning if Gemini API Key isn't configured */}
      {!hasApiKey && (
        <div className="key-warning-accent" id="api-key-warning">
          <strong>API Activation Hint:</strong> The app's Gemini integration is currently missing an API key. Please add the secret <code>VITE_GEMINI_API_KEY</code> in your AI Studio secrets configuration window or local <code>.env</code> file to query live results.
        </div>
      )}

      {/* Main search and filter workspace */}
      <RecommendationForm
        onSubmit={handleRecommendationSubmit}
        isLoading={isLoading}
        onReset={handleReset}
        hasRecommendations={recommendedIds !== null}
      />

      {/* Error state display block */}
      {error && (
        <div className="error-container" id="error-screen">
          <div className="error-title">
            ⚠️ Recommendation Failure
          </div>
          <div className="error-details">{error}</div>
        </div>
      )}

      <main className="dashboard-grid">
        {/* Recommended Results Segment */}
        {recommendedIds !== null && (
          <section className="ai-section" id="ai-recommendations-section">
            <div className="section-header">
              <h2>
                ✨ Gemini Recommendations
                <span className="section-subtitle">
                  Matches for "{lastQuery}"
                </span>
              </h2>
            </div>

            {isLoading ? (
              <div className="loading-wrapper">
                <div className="spinner spinner-ai"></div>
                <p>Analyzing matching criteria & specs...</p>
              </div>
            ) : recommendedProducts.length > 0 ? (
              <div className="products-grid">
                {recommendedProducts.map((product) => (
                  <ProductCard
                    key={`rec-${product.id}`}
                    product={product}
                    isRecommended={true}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No products in our current smartphone catalog filter matches your criteria.</p>
                <button className="clear-btn" onClick={handleReset}>
                  Show All Products
                </button>
              </div>
            )}
          </section>
        )}

        {/* Catalog general inventory displaying */}
        <section id="full-catalog-section">
          <div className="section-header">
            <h2>
              Store Catalog
              <span className="section-subtitle">
                All available smartphones ({products.length} models)
              </span>
            </h2>
          </div>

          <div className="products-grid">
            {products.map((product) => (
              <ProductCard
                key={`all-${product.id}`}
                product={product}
                isRecommended={recommendedIds?.includes(product.id)}
              />
            ))}
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>© 2026 SmartSelect Systems. Finished product recommendation coding assessment.</p>
      </footer>
    </div>
  );
}
