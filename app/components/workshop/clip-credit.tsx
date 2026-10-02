import { firstEdit } from "@/app/data/first-edit";

export default function ClipCredit() {
  return (
    <p className="mt-3 text-xs leading-relaxed text-muted">
      لقطة تدريبية من{" "}
      <a
        href={firstEdit.source}
        target="_blank"
        rel="noreferrer"
        className="underline underline-offset-4 hover:text-brand-soft"
      >
        Edgar Fernandez / Mixkit
      </a>
      ، عدّلناها للتجربة. مش من أعمال محمد أو الطلاب.
    </p>
  );
}
