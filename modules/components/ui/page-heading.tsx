export default function PageHeading({
  eyebrow,
  title,
  description,
  children,
  level = 1,
  actionsFirst = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
  level?: 1 | 2;
  actionsFirst?: boolean;
}) {
  const Heading = level === 2 ? "h2" : "h1";
  return (
    <div className="lms-page-heading" data-reveal>
      {actionsFirst && children}
      <div>
        {eyebrow && <p className="lms-heading-context">{eyebrow}</p>}
        <Heading>{title}</Heading>
        {description && <p className="body-regular">{description}</p>}
      </div>
      {!actionsFirst && children}
    </div>
  );
}
