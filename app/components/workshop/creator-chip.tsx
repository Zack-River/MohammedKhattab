import Image from "next/image";
import type { JSX } from "react";

interface CreatorChipProps {
  name: string;
  platform: string;
  image: string;
  ariaHidden?: boolean;
}

export default function CreatorChip({
  name,
  platform,
  image,
  ariaHidden = false,
}: CreatorChipProps): JSX.Element {
  return (
    <div
      className="flex shrink-0 items-center gap-3 rounded-full border border-line bg-panel px-3 py-2 text-start transition-colors hover:border-brand/35 hover:bg-elevated"
      aria-hidden={ariaHidden}
    >
      <div className="relative size-10 shrink-0 overflow-hidden rounded-full border border-line-strong">
        <Image
          src={image}
          alt={name}
          className="object-cover"
          fill
          loading="lazy"
          decoding="async"
          unoptimized
        />
      </div>
      <span className="text-sm font-bold text-foreground">{name}</span>
      <span className="rounded-full bg-elevated px-2 py-1 text-xs text-muted">
        {platform}
      </span>
    </div>
  );
}
