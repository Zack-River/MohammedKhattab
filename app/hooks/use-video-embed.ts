import { useCallback, useState } from "react";

import { getYouTubeEmbedUrl } from "../lib/video";

export function useVideoEmbed(videoUrl: string) {
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);

  const play = useCallback(() => {
    setEmbedUrl(getYouTubeEmbedUrl(videoUrl));
  }, [videoUrl]);

  return { embedUrl, play };
}
