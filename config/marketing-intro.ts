import type { VideoContent } from "@khatab/design/types/ui";
import { arabicPlayerLabels as workshopPlayerLabels } from "@khatab/design/lib/player-labels";
import { creatorMedia } from "./creator-media";

export const introVideo = {
      controls: workshopPlayerLabels,
      source: creatorMedia.workshopIntro,
      poster: {
        src: creatorMedia.workshopIntro.poster,
        alt: "محمد خطاب يشرح ورشة التغيير",
        width: 1280,
        height: 720,
      },
      controlsVariant: "overlay",
      returnToPosterOnEnd: true,
      title: "فيديو تعريفي لورشة التغيير",
      playLabel: "تشغيل الفيديو التعريفي",
      caption: "شاهد الفيديو التعريفي للورشة مع محمد خطاب",
      hint: "اضغط للتشغيل • شرح كامل لخطة الـ 7 أيام",
    } as const satisfies VideoContent;
