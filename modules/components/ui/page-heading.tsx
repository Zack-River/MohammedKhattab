export default function PageHeading({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="lms-page-heading">
      <div>
        {eyebrow && <p className="lms-heading-context">{eyebrow}</p>}
        <h1>{title}</h1>
        {description && <p className="body-regular">{description}</p>}
      </div>
      {children}
    </div>
  );
}
