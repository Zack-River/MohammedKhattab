"use client";
import { useState } from "react";
import DeferredVideoPlayer from "@khatab/design/ui/deferred-video-player";
import { arabicPlayerLabels } from "@khatab/design/lib/player-labels";
const labels = { ...arabicPlayerLabels, play: "PLAY", pause: "PAUSE", mute: "MUTE", unmute: "UNMUTE", seek: "SEEK", volume: "VOLUME", retry: "RETRY" };
export default function YouTubeFixture() {
  const [overlay, setOverlay] = useState(false);
  const [resetOnEnd, setResetOnEnd] = useState(false);
  const [visible, setVisible] = useState(true);
  return <>
    <button onClick={() => setVisible((value) => !value)}>Toggle player</button>
    <button onClick={() => setOverlay((value) => !value)}>Overlay mode</button>
    <button onClick={() => setResetOnEnd((value) => !value)}>Reset on end</button>
    {visible && <DeferredVideoPlayer url="https://youtu.be/h1G6qEPRIPg"
      controlsVariant={overlay ? "overlay" : "full"} returnToPosterOnEnd={resetOnEnd}
      title="SDK player" labels={labels} playLabel="Activate SDK"
      placeholderClassName="youtube-fixture-placeholder">
      <span>Video poster</span>
    </DeferredVideoPlayer>}
    <DeferredVideoPlayer url="https://youtu.be/h1G6qEPRIPg" title="Second SDK" labels={labels}
      playLabel="Activate second" placeholderClassName="youtube-fixture-placeholder">
      <span>Second poster</span>
    </DeferredVideoPlayer>
  </>;
}
