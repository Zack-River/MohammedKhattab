import Container from "./container";
import Eyebrow from "./eyebrow";
import RichText from "./rich-text";
import Section from "./section";
import ReviewList from "./review-list";
import FeaturedReview from "./featured-review";
import type { TestimonialsContent } from "../types/marketing";

export default function TestimonialsSection({
  content,
  reveal = false,
}: {
  content: TestimonialsContent;
  reveal?: boolean;
}) {
  return (
    <Section {...content.section}>
      <Container>
        <div className="testimonials-header" data-reveal={reveal || undefined}>
          <div>
            <Eyebrow>{content.heading.eyebrow}</Eyebrow>
            <h2 className="headline-h2">
              <RichText content={content.heading.title} />
            </h2>
          </div>
          {content.heading.description && (
            <p className="body-regular text-muted testimonials-summary">
              <RichText content={content.heading.description} />
            </p>
          )}
        </div>
        <div data-reveal={reveal || undefined}><FeaturedReview review={content.featured} /></div>
        <div data-reveal={reveal || undefined}><ReviewList reviews={content.reviews} expansion={content.expansion} /></div>
      </Container>
    </Section>
  );
}
