import Eyebrow from "./eyebrow";
import AuthorIdentity from "./author-identity";
import type { FeaturedReviewData } from "../types/marketing";

export default function FeaturedReview({
  review,
}: {
  review: FeaturedReviewData;
}) {
  return (
    <div className="featured-review-card">
      <div className="featured-quote-mark">{review.quoteMark}</div>
      <p className="featured-review-text">{review.text}</p>
      <div className="featured-author-row">
        <AuthorIdentity author={review} variant="featured" />
        <Eyebrow accent={false} dot={false} className="featured-eyebrow">
          {review.badge}
        </Eyebrow>
      </div>
    </div>
  );
}
