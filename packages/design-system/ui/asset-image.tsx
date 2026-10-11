import Image, { type ImageProps } from "next/image";
import type { ImageAsset } from "../types/ui";

export default function AssetImage({
  asset,
  ...props
}: { asset: ImageAsset } & Omit<
  ImageProps,
  "src" | "alt" | "width" | "height"
>) {
  return (
    <Image
      unoptimized={!asset.src.startsWith("/")}
      loading="lazy"
      decoding="async"
      {...asset}
      alt={asset.alt}
      {...props}
    />
  );
}
