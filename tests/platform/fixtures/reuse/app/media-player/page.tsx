"use client";
import { useState } from "react";
import MediaPlayer from "@khatab/design/ui/media-player";
import { arabicPlayerLabels } from "@khatab/design/lib/player-labels";
import "@khatab/design/styles/video-player.css";
const labels = { ...arabicPlayerLabels, play: "PLAY", pause: "PAUSE" };
export default function PlayerFixture() {
  const [changed, setChanged] = useState(false);
  const [overrideUrl, setOverrideUrl] = useState("");
  return (
    <>
      <div data-player="custom">
        <MediaPlayer
          videoUrl={
            overrideUrl || (changed
              ? "/assets/video/workshop-intro.mp4?replacement"
              : "/assets/video/workshop-intro.mp4")
          }
          thumbnailUrl={
            changed
              ? "/assets/images/instructor.webp"
              : "/assets/images/workshop-video-poster.jpg"
          }
          title="Custom player"
          width={320}
          height={180}
          color="#36f329"
          labels={labels}
        />
      </div>
      <div data-player="other">
        <MediaPlayer
          videoUrl="/assets/video/workshop-intro.mp4"
          thumbnailUrl="/assets/images/workshop-video-poster.jpg"
          title="Other player"
          width="240px"
          height="150px"
          color="#fc3522"
          labels={labels}
        />
      </div>
      <button type="button" onClick={() => setChanged(!changed)}>
        Change source
      </button>
      <label>Video URL<input value={overrideUrl} onChange={(event) => setOverrideUrl(event.target.value)} /></label>
      <div style={{ height: "200vh" }} aria-hidden="true" />
    </>
  );
}
