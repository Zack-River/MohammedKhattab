import type {
  VideoPlayerLabels,
  VideoSourceProps,
  PlayerControlsVariant,
} from "./video-player";
import type { ComponentPropsWithoutRef } from "react";

export type IconName =
  "arrow" | "sparkle" | "shield" | "play" | "reel-play" | "menu" | "chevron";
export type SocialPlatform = "facebook" | "tiktok" | "instagram" | "youtube";
export interface ImageAsset {
  src: string;
  alt: string;
  width: number;
  height: number;
}
export interface LinkData {
  href: string;
  label: string;
  title?: string;
  external?: boolean;
}
export interface SocialLinkData extends LinkData {
  platform: SocialPlatform;
}
export type SectionSettings = Omit<
  ComponentPropsWithoutRef<"section">,
  "children"
>;
export type RichTextPart =
  | string
  | { kind: "break" }
  | {
      kind: "span" | "strong";
      className?: string;
      decorative?: boolean;
      icon?: {
        name: IconName;
        className?: string;
        width?: number;
        height?: number;
      };
      children: readonly RichTextPart[];
    };
export type RichTextContent = readonly RichTextPart[];
export interface SectionHeadingContent {
  eyebrow?: string;
  title: RichTextContent;
  description?: RichTextContent;
}
export type VideoContent = {
  poster?: ImageAsset;
  controlsVariant?: PlayerControlsVariant;
  returnToPosterOnEnd?: boolean;
  controls: VideoPlayerLabels;
  title: string;
  playLabel: string;
  caption: string;
  hint: string;
} & VideoSourceProps;
