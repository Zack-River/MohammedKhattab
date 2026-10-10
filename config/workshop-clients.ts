import type { CreatorData } from "@khatab/design/types/marketing";

export const creators = [
  {
    name: "أسامة عصام الدين",
    platform: "YouTube",
    image: {
      src: "/assets/images/clients/osama-essam-eldeen.jpg",
      alt: "أسامة عصام الدين",
      width: 44,
      height: 44,
    },
  },
  {
    name: "بلال طرخان",
    platform: "YouTube",
    image: {
      src: "/assets/images/clients/bilal-tarkhan.jpg",
      alt: "بلال طرخان",
      width: 44,
      height: 44,
    },
  },
  {
    name: "عبدالله الغفيص",
    platform: "YouTube",
    image: {
      src: "/assets/images/clients/abdullah-alghufais.jpg",
      alt: "عبدالله الغفيص",
      width: 44,
      height: 44,
    },
  },
  {
    name: "محمد الخضير",
    platform: "Instagram",
    image: {
      src: "/assets/images/clients/mohammed-alkhudair.jpg",
      alt: "محمد الخضير",
      width: 44,
      height: 44,
    },
  },
  {
    name: "مستر أحمد",
    platform: "TikTok",
    image: {
      src: "/assets/images/clients/mr-ahmed.jpg",
      alt: "مستر أحمد",
      width: 44,
      height: 44,
    },
  },
  {
    name: "نجم الدين",
    platform: "YouTube",
    image: {
      src: "/assets/images/clients/najm-eldeen.jpg",
      alt: "نجم الدين",
      width: 44,
      height: 44,
    },
  },
] as const satisfies readonly CreatorData[];

import type { ReelData } from "@khatab/design/types/marketing";

import { portfolioWorks } from "./portfolio";
import media from "./portfolio-media.json";
import publishedVideos from "./portfolio-youtube.json";
import { arabicPlayerLabels as workshopPlayerLabels } from "@khatab/design/lib/player-labels";
import { formatPlayerTime } from "@khatab/design/helpers/media/format-time";

export const clientReels: readonly ReelData[] = portfolioWorks.flatMap(
  (work, index) => {
    if (!work.featured) return [];
    const published = publishedVideos.find(
      (video) => video.assetId === work.id,
    );
    if (!published)
      throw new Error(`Missing verified YouTube metadata: ${work.id}`);
    const title = published.title;
    const views = `${new Intl.NumberFormat("en-US").format(published.viewCount)} مشاهدة`;
    const asset = media[index];
    const name = `work-${String(asset.index).padStart(2, "0")}`;
    const poster = `/assets/images/portfolio/${name}.jpg`;
    return [
      {
        format: "من أعمال خطاب",
        duration: formatPlayerTime(asset.duration),
        preview: title,
        title,
        description: views,
        video: {
          source: {
            kind: "file",
            url: `/assets/video/portfolio/${name}.mp4`,
            poster,
          },
          controls: workshopPlayerLabels,
          playLabel: `تشغيل ${title}`,
          poster: { src: poster, alt: title, width: 720, height: 1280 },
        },
      },
    ];
  },
);
