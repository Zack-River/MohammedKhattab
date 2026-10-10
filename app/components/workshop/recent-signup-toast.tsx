"use client";

import { useReferenceSignup } from "@/app/hooks/use-reference-signup";
import type { SignupContent, SignupOptions } from "@khatab/design/types/interactions";

export default function RecentSignupToast({
  content,
  options,
}: {
  content: SignupContent;
  options: SignupOptions;
}) {
  const { visible, name, close } = useReferenceSignup(options);
  return (
    <aside
      className={`recent-signup-toast${visible ? " is-active" : ""}`}
      aria-live="polite"
      role="status"
      aria-hidden={!visible}
    >
      <button
        className="toast-close-btn"
        type="button"
        aria-label={content.closeLabel}
        onClick={close}
        tabIndex={visible ? 0 : -1}
      >
        ×
      </button>
      <div className="toast-card-inner">
        <div className="toast-card-top-row">
          <span className="toast-dot" aria-hidden="true" />
          <span className="toast-status-badge">{content.status}</span>
        </div>
        <div className="toast-card-user-row">
          <span className="toast-user-name">{name}</span>
        </div>
      </div>
    </aside>
  );
}
