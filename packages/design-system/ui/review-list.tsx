"use client";
import { useId, useState } from "react";
import type { TestimonialsContent } from "../types/marketing";
import ReviewCard from "./review-card";

export default function ReviewList({ reviews, expansion }: Pick<TestimonialsContent, "reviews" | "expansion">) {
  const [expanded, setExpanded] = useState(false);
  const id = useId();
  const count = expansion ? Math.max(0, expansion.initialCount) : reviews.length;
  const visibleReviews = expanded ? reviews : reviews.slice(0, count);
  return (
    <>
      <div id={id} className="testimonials-grid">
        {visibleReviews.map((review, index) => (
          <div key={`${review.name}:${index}`} className={expanded && index >= count ? "review-revealed" : undefined}>
            <ReviewCard {...review} />
          </div>
        ))}
      </div>
      {expansion && !expanded && count < reviews.length ? (
        <div className="testimonials-more">
          <button type="button" className="testimonials-more-button" aria-controls={id} aria-expanded={expanded} onClick={() => setExpanded(true)}>
            {expansion.showMoreLabel}
          </button>
        </div>
      ) : null}
    </>
  );
}
