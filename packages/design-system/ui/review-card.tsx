import AuthorIdentity from "./author-identity";
import type { ReviewData } from "../types/marketing";

export default function ReviewCard(review: ReviewData) {
  return (
    <div className="review-card">
      <p className="review-card-text">{review.text}</p>
      <div className="review-card-author">
        <AuthorIdentity author={review} variant="review" />
      </div>
    </div>
  );
}
