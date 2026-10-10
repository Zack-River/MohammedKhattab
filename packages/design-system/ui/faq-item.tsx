import Icon from "./ui-icon";
import type { FaqItem as FaqItemData } from "../types/workshop";

export default function FaqItem({
  item,
  open,
  buttonId,
  panelId,
  onToggle,
}: {
  item: FaqItemData;
  open: boolean;
  buttonId: string;
  panelId: string;
  onToggle: () => void;
}) {
  return (
    <div className={`faq-item${open ? " is-active" : ""}`}>
      <button
        className="faq-question-btn"
        type="button"
        id={buttonId}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
      >
        <span>{item.question}</span>
        <Icon name="chevron" className="faq-chevron" />
      </button>
      <div
        className="faq-answer-panel"
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        aria-hidden={!open}
        inert={!open}
      >
        <div className="faq-answer-inner">
          <div className="faq-answer-content">{item.answer}</div>
        </div>
      </div>
    </div>
  );
}
