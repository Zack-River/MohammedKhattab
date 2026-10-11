import Avatar from "@khatab/design/ui/avatar";
import type { AccountProfile } from "@platform/types/account";
import type { AccountLabels } from "@platform/types/account-copy";
export default function AccountSummary({ profile, labels }: { profile: AccountProfile; labels: AccountLabels }) {
  return <section className="lms-profile-card">
    <div className="lms-profile-card-heading"><Avatar name={profile.name} url={profile.avatarUrl} label={labels.image} className="lms-avatar lms-avatar-large" /><div><h2>{profile.name}</h2><span>{profile.admin ? labels.admin : labels.student}</span></div></div>
    <dl className="lms-account-data">{[[labels.name, profile.name], [labels.username, profile.username], [labels.email, profile.email], [labels.phone, profile.phone || labels.missing]].map(([label, value]) =>
      <div key={label}><dt>{label}</dt><dd dir="auto">{value}</dd></div>)}</dl>
  </section>;
}
