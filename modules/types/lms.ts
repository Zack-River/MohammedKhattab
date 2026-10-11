import type { Category, ArtworkKind } from "@platform/config/catalog";
export type { Category } from "@platform/config/catalog";
export interface Lesson {
  id: string;
  title: string;
  duration: string;
  durationSeconds: number;
  resourceIds: readonly string[];
  description: string;
  videoUrl: string;
  preview?: boolean;
  takeaway: string[];
}
export interface CourseSection { id: string; title: string; lessonIds: string[]; }
export interface CourseModule {
  id?: string;
  sections?: CourseSection[];
  title: string;
  lessons: Lesson[];
}
export interface CourseOffer {
  amountLabel?: string;
  amount: number;
  currencyLabel: string;
  caption: string;
  actionLabel: string;
}
export interface Course {
  thumbnailUrl?: string;
  introVideoUrl?: string;
  delivery?: "recorded" | "live";
  deliveryLabel?: string;
  slug: string;
  title: string;
  description: string;
  category: Exclude<Category, "all">;
  categoryLabel: string;
  tool: string;
  level: string;
  duration: string;
  subtitle: string;
  outcomes: string[];
  modules: CourseModule[];
  offer: CourseOffer;
  artwork: ArtworkKind;
  featured?: boolean;
}
export interface Learner {
  username?: string;
  name: string;
  email: string;
}
export interface LearningState {
  enrolled: string[];
  completed: string[];
  profile: Learner;
}
export interface Resource {
  id: string;
  title: string;
  description: string;
  type: string;
  content: string;
}
