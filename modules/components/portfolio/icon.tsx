export default function PortfolioIcon({
  name,
}: {
  name: "arrow" | "play" | "email" | "whatsapp";
}) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {name === "arrow" && (
        <>
          <path d="M19 12H5" />
          <path d="m12 19-7-7 7-7" />
        </>
      )}
      {name === "play" && <path d="m5 3 14 9-14 9Z" />}
      {name === "email" && (
        <>
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m22 6-10 7L2 6" />
        </>
      )}
      {name === "whatsapp" && (
        <>
          <path d="M22 12a10 10 0 0 1-15.2 8.6L2 22l1.6-4.7A10 10 0 1 1 22 12Z" />
          <path d="M8 7c-3 3 6 12 9 7l-3-2-1 1c-2-1-3-2-4-4l1-1Z" />
        </>
      )}
    </svg>
  );
}
