import AssetImage from "./asset-image";
import type { ReviewData } from "../types/marketing";

const variants = {
  featured: {
    root: "author-info",
    image: "author-avatar-flag",
    meta: "author-meta",
    name: "author-name",
    country: "author-country",
    tag: "div",
  },
  review: {
    root: "review-author-info",
    image: "review-avatar-flag",
    meta: "review-author-meta",
    name: "review-card-name",
    country: "review-card-country",
    tag: "span",
  },
} as const;

export default function AuthorIdentity({
  author,
  variant,
}: {
  author: Pick<ReviewData, "name" | "country" | "image">;
  variant: keyof typeof variants;
}) {
  const classes = variants[variant];
  const Tag = classes.tag;
  return (
    <div className={classes.root}>
      <div className={classes.image}>
        <AssetImage asset={author.image} />
      </div>
      <div className={classes.meta}>
        <Tag className={classes.name}>{author.name}</Tag>
        <Tag className={classes.country}>{author.country}</Tag>
      </div>
    </div>
  );
}
