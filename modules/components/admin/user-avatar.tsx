import type { AdminUsersLabels } from "@platform/types/admin-users";
export default function UserAvatar({ name, url, labels }: { name: string; url: string | null; labels: AdminUsersLabels }) {
  return <div className="lms-admin-avatar">{url
    // Remote profile URLs come from account data, rather than the static asset pipeline.
    // eslint-disable-next-line @next/next/no-img-element
    ? <img src={url} alt={`${labels.profileImage}: ${name}`} referrerPolicy="no-referrer" />
    : <span aria-label={`${labels.profileImage}: ${name}`}>{name.slice(0, 1)}</span>}
  </div>;
}
