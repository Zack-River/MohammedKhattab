import type { ProjectNavigationContent } from "./project-navigation";
import type {
  ImageAsset,
  LinkData,
  RichTextContent,
  SectionHeadingContent,
  SectionSettings,
  SocialLinkData,
  VideoContent,
} from "./ui";
import type {
  CountdownContent,
  CountdownOptions,
  SignupContent,
  SignupOptions,
  RevealOptions,
} from "./interactions";
import type { FileVideoSource, VideoPlayerLabels } from "./video-player";
import type { FaqItem, RoadmapDayData } from "./workshop";

export interface CreatorData {
  name: string;
  platform: string;
  image: ImageAsset;
}
export interface ReelData {
  video?: {
    source: FileVideoSource;
    controls: VideoPlayerLabels;
    playLabel: string;
    poster: ImageAsset;
  };
  format: string;
  duration: string;
  preview: string;
  title: string;
  description: string;
}
export interface ReviewData {
  text: string;
  name: string;
  country: string;
  image: ImageAsset;
}
export interface FeaturedReviewData extends ReviewData {
  badge: string;
  quoteMark: string;
}
export interface StageData {
  number: string;
  title: string;
  description: string;
}
export interface StatData {
  value: string;
  label: string;
  target?: number;
  prefix?: string;
  suffix?: string;
}
export interface BaseSectionContent {
  section: SectionSettings;
}
export interface HeroContent extends BaseSectionContent {
  title: RichTextContent;
  description: string;
  video: VideoContent;
  action: LinkData;
  microcopy: readonly string[];
}
export interface ClientsContent extends BaseSectionContent {
  heading: SectionHeadingContent;
  creators: readonly CreatorData[];
  reels: readonly ReelData[];
  marqueeLabel: string;
}
export interface TransformationContent extends BaseSectionContent {
  heading: SectionHeadingContent;
  stages: readonly StageData[];
}
export interface RoadmapContent extends BaseSectionContent {
  heading: SectionHeadingContent;
  formula: { title: string; inputs: readonly string[]; result: string };
  days: readonly RoadmapDayData[];
  action: LinkData;
}
export interface TestimonialsContent extends BaseSectionContent {
  heading: SectionHeadingContent;
  featured: FeaturedReviewData;
  reviews: readonly ReviewData[];
  expansion?: { initialCount: number; showMoreLabel: string };
}
export interface InstructorContent extends BaseSectionContent {
  action?: LinkData;
  eyebrow?: string;
  name: string;
  tagline: string;
  manifesto: RichTextContent;
  image: ImageAsset;
  badge: string;
  experience: string;
  stats: readonly StatData[];
}
export interface GuaranteeContent extends BaseSectionContent {
  heading: SectionHeadingContent;
}
export interface FaqContent extends BaseSectionContent {
  heading: SectionHeadingContent;
  items: readonly FaqItem[];
}
export interface FinalCtaContent extends BaseSectionContent {
  heading: SectionHeadingContent;
  action: LinkData;
  microcopy: readonly string[];
}
export interface HeaderContent {
  id: string;
  brand: LinkData;
  navigation: readonly LinkData[];
  navigationLabel: string;
  toggleLabel: string;
  action: LinkData;
  scarcityLabel: string;
  viewerCount: number;
  viewerLabel: string;
  countdown: CountdownContent;
}
export interface FooterContent {
  projectNavigation?: ProjectNavigationContent;
  brand: LinkData;
  copyright: string;
  credit: LinkData;
  social: readonly SocialLinkData[];
}
export interface MarketingPageContent {
  header: HeaderContent;
  footer: FooterContent;
  hero: HeroContent;
  clients: ClientsContent;
  transformation: TransformationContent;
  roadmap: RoadmapContent;
  testimonials: TestimonialsContent;
  instructor: InstructorContent;
  guarantee: GuaranteeContent;
  faq: FaqContent;
  finalCta: FinalCtaContent;
  signup: { options: SignupOptions; content: SignupContent };
  offer: CountdownOptions;
  motion: RevealOptions;
}
