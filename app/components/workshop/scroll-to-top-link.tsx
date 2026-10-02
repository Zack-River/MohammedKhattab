"use client";

import type { JSX } from "react";
import { scrollToPageTop } from "@/app/lib/navigation";

export default function ScrollToTopLink(): JSX.Element {
  return (
    <a
      href="#hero"
      className="inline-block w-fit text-lg font-extrabold transition-colors hover:text-brand"
      title="الرجوع لأعلى الصفحة"
      onClick={scrollToPageTop}
    >
      ورشة التغيير
    </a>
  );
}
