"use client";

import { interfaceCopy } from "@platform/data/interface-copy";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="container lms-not-found">
      <h1>{interfaceCopy.errorTitle}</h1>
      <p>{interfaceCopy.errorDescription}</p>
      <button className="btn-primary" onClick={reset}>
        {interfaceCopy.retryAction}
      </button>
    </main>
  );
}
