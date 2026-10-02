import Image from "next/image";
import Card from "@/app/components/ui/card";
import Eyebrow from "./eyebrow";
import { cn } from "@/app/lib/cn";

interface ReviewCardProps {
  text: string;
  name: string;
  country: string;
  flag: string;
}
function ReviewAuthor({
  name,
  country,
  flag,
  featured = false,
}: Omit<ReviewCardProps, "text"> & { featured?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          "relative size-10 shrink-0 overflow-hidden rounded-full border border-line-strong bg-elevated",
          featured && "size-12",
        )}
      >
        <Image
          src={`/assets/flags/${flag}.png`}
          alt={`علم ${country}`}
          fill
          className="object-cover"
          loading="lazy"
          unoptimized
        />
      </div>
      <div className="flex flex-col gap-0.5 text-start">
        <span
          className={cn(
            "text-base leading-tight font-bold",
            featured && "text-lg",
          )}
        >
          {name}
        </span>
        <span className="text-xs text-muted">{country}</span>
      </div>
    </div>
  );
}
export function FeaturedReviewCard({ text, ...author }: ReviewCardProps) {
  return (
    <Card
      as="article"
      className="group mb-12 p-6 sm:p-12 lg:p-16 transition-colors hover:border-brand/40"
      data-motion="featured"
    >
      <div
        className="pointer-events-none -mb-4 font-serif text-6xl leading-none text-brand/35 transition-colors group-hover:text-brand"
        aria-hidden="true"
      >
        “
      </div>
      <p className="mb-8 text-quote font-medium">{text}</p>
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-4">
        <ReviewAuthor {...author} featured />
        <Eyebrow accent={false} className="mb-0">
          تجربة مميزة
        </Eyebrow>
      </div>
    </Card>
  );
}
export default function ReviewCard({ text, ...author }: ReviewCardProps) {
  return (
    <Card
      as="article"
      interactive
      className="flex h-full flex-col justify-between"
    >
      <p className="mb-6 grow text-base leading-relaxed text-copy">{text}</p>
      <div className="mt-2 flex items-center border-t border-line pt-4">
        <ReviewAuthor {...author} />
      </div>
    </Card>
  );
}
