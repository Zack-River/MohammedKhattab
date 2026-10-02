import Container from "@/app/components/ui/container";
import Heading from "@/app/components/ui/heading";
import Section from "@/app/components/ui/section";
import { featuredReview, studentReviews } from "@/app/data/workshop";
import ReviewCard, { FeaturedReviewCard } from "./review-card";

export default function TestimonialsSection() {
  return (
    <Section id="testimonials" className="border-t border-line">
      <Container>
        <div
          className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"
          data-motion="header"
          data-motion-children
        >
          <Heading className="text-chapter">
            ناس بدأت
            <br />
            <span className="text-brand">من نفس مكانك.</span>
          </Heading>
          <p className="max-w-sm text-lg text-copy">
            اقرأ التجربة، مش بس التقييم. إيه اللي فرق معاهم وهم بيتعلموا؟
          </p>
        </div>
        <FeaturedReviewCard {...featuredReview} />
        <div className="grid gap-5 md:grid-cols-3" data-motion="grid">
          {studentReviews.slice(0, 3).map((review) => (
            <ReviewCard key={review.name} {...review} />
          ))}
        </div>
        <details
          className="mt-8 rounded-xl border border-line bg-panel p-5 open:border-line-strong"
          data-more-reviews
        >
          <summary className="cursor-pointer text-sm font-semibold text-copy hover:text-foreground">
            اقرأ باقي تجارب الطلاب
          </summary>
          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {studentReviews.slice(3).map((review) => (
              <ReviewCard key={review.name} {...review} />
            ))}
          </div>
        </details>
      </Container>
    </Section>
  );
}
