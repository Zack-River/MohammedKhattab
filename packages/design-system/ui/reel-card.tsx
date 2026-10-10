import type { ReelData } from "../types/marketing";
import Icon from "./ui-icon";

import MediaPlayer from "./media-player";
export default function ReelCard(reel: ReelData) {
  return (
    <div className="client-work-card reel-card">
      <div className="client-work-preview reel-preview">
        {reel.video ? (
          <MediaPlayer
            videoUrl={reel.video.source.url}
            thumbnailUrl={reel.video.poster.src}
            width="100%"
            height="100%"
            controlsVariant="overlay"
            returnToPosterOnEnd
            title={reel.title}
            labels={reel.video.controls}
            playLabel={reel.video.playLabel}
            placeholderClassName="reel-video-placeholder"
            playButtonClassName="reel-play-btn"
          >
            <span className="client-work-tag reel-tag">{reel.format}</span>
          </MediaPlayer>
        ) : (
          <>
            <span className="client-work-tag reel-tag">{reel.format}</span>
            <div className="proof-placeholder-box reel-placeholder-box">
              <div className="reel-play-btn" aria-hidden="true">
                <Icon name="reel-play" />
              </div>
              <div className="proof-placeholder-text">{reel.preview}</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
