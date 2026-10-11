"use client";
import { useRouter } from "next/navigation";
import Avatar from "@khatab/design/ui/avatar";
import ImageUpload from "@platform/components/ui/image-upload";
import type { AccountProfile } from "@platform/types/account";
import type { ImageUploadLabels } from "@platform/types/image-upload";
export default function AvatarUpload({ profile, labels }: { profile: AccountProfile; labels: ImageUploadLabels }) {
  const router = useRouter();
  return <div className="lms-avatar-upload"><Avatar name={profile.name} url={profile.avatarUrl} label={labels.title} className="lms-avatar lms-avatar-large" />
    <ImageUpload target={{ kind: "avatar" }} labels={labels} onUploaded={() => router.refresh()} />
  </div>;
}
