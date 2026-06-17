import React from "react";

/**
 * ProductCard functional component.
 * Displays specs, price, categories, and description for a smartphone.
 * 
 * @param {Object} props
 * @param {Object} props.product - Smartphone details
 * @param {boolean} [props.isRecommended=false] - Whether this card is highlighted as a recommendation
 */
export default function ProductCard({ product, isRecommended = false }) {
  const { name, brand, price, shortDescription, os, specs } = product;

  return (
    <div className={`product-card ${isRecommended ? "recommended-card" : ""}`} id={`product-card-${product.id}`}>
      <div className="card-top">
        <div className="card-tags">
          <span className="tag tag-brand">{brand}</span>
          <span className="tag tag-os">{os}</span>
          {isRecommended && <span className="ai-badge">★ Match</span>}
        </div>
        <h3 className="product-name">{name}</h3>
        <p className="product-description">{shortDescription}</p>
        
        {specs && (
          <div className="specs-table">
            <div className="spec-row">
              <span className="spec-label">Screen</span>
              <span className="spec-value">{specs.screen}</span>
            </div>
            <div className="spec-row">
              <span className="spec-label">Camera</span>
              <span className="spec-value">{specs.camera}</span>
            </div>
            <div className="spec-row">
              <span className="spec-label">Battery</span>
              <span className="spec-value">{specs.battery}</span>
            </div>
            <div className="spec-row">
              <span className="spec-label">Storage</span>
              <span className="spec-value">{specs.storage}</span>
            </div>
          </div>
        )}
      </div>
      
      <div className="card-bottom">
        <span className="product-price">${price}</span>
      </div>
    </div>
  );
}
