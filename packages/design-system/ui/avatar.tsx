export default function Avatar({ name, url, label, className = "" }: { name: string; url?: string | null; label: string; className?: string }) {
  return <span className={`ds-avatar ${className}`} aria-label={`${label}: ${name}`}>{url
    // Account images are user-controlled remote assets, outside the static Next image pipeline.
    // eslint-disable-next-line @next/next/no-img-element
    ? <img src={url} alt="" referrerPolicy="no-referrer" />
    : <span aria-hidden="true">{name.slice(0, 1)}</span>}</span>;
}
