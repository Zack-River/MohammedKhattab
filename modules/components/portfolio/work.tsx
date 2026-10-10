import MediaPlayer from "@khatab/design/ui/media-player";
import type { ReelData } from "@khatab/design/types/marketing";
import type { PortfolioContent } from "@platform/types/portfolio";
import PortfolioSection from "./section";
export default function PortfolioWork({
  content,
  samples,
}: {
  content: PortfolioContent["work"];
  samples: readonly ReelData[];
}) {
  return (
    <PortfolioSection content={content} className="p-ref-portfolio-section">
      <div className="p-ref-reels-grid personal-work-grid">
        {samples.map((sample) => {
          return (
            <article
              className="p-ref-reel-card personal-work-card"
              key={sample.title}
              data-reveal
            >
              {sample.video && (
                <MediaPlayer
                  videoUrl={sample.video.source.url}
                  thumbnailUrl={sample.video.poster.src}
                  title={sample.title}
                  playLabel={sample.video.playLabel}
                  labels={sample.video.controls}
                  width="100%"
                  height="100%"
                />
              )}
            </article>
          );
        })}
      </div>
    </PortfolioSection>
  );
}
