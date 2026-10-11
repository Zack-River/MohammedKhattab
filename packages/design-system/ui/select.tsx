"use client";
import { useId } from "react";
import { useSelectValue } from "../hooks/use-select-value";
import { useSelectMenu } from "../hooks/use-select-menu";
import type { SelectProps } from "../types/select";
export default function Select({ options, label, name, id, value, defaultValue, onValueChange, required, disabled, validationMessage, placeholder = "—", className = "" }: SelectProps) {
  const generated = useId(), controlId = id ?? generated;
  const { selected, choose, error, setError, nativeRef } = useSelectValue({ options, label, value, defaultValue, onValueChange });
  const { button: buttonRef, panel: panelRef, open, active, setOpen, toggle, commit, keyDown, setActive } = useSelectMenu(options, selected, choose);
  return <div className={`ds-select ${className}`}>
    <label id={`${controlId}-label`} htmlFor={controlId}>{label}</label>
    <select ref={nativeRef} aria-hidden="true" tabIndex={-1} className="ds-select-native" name={name} value={selected} required={required} disabled={disabled}
      onChange={event => choose(event.target.value)}
      onInvalid={event => { event.preventDefault(); setError(validationMessage ?? event.currentTarget.validationMessage); buttonRef.current?.focus(); }}>
      {!selected && <option value="">{placeholder}</option>}
      {options.map(option => <option key={option.value} value={option.value} disabled={option.disabled}>{option.label}</option>)}
    </select>
    <button ref={buttonRef} id={controlId} type="button" className="ds-select-trigger" role="combobox" disabled={disabled}
      aria-labelledby={`${controlId}-label`} aria-expanded={open} aria-controls={`${controlId}-menu`}
      aria-haspopup="listbox" aria-required={required} aria-invalid={Boolean(error)} aria-describedby={error ? `${controlId}-error` : undefined} aria-activedescendant={open && active >= 0 ? `${controlId}-option-${active}` : undefined}
      onClick={() => toggle()} onKeyDown={keyDown}>
      <span id={`${controlId}-value`}>{options.find(option => option.value === selected)?.label ?? placeholder}</span>
      <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m5 7 5 5 5-5" /></svg>
    </button>
    <div ref={panelRef} popover="auto" id={`${controlId}-menu`} className="ds-select-menu" role="listbox" aria-labelledby={`${controlId}-label`}
      onToggle={event => setOpen(event.newState === "open")} onMouseDown={event => event.preventDefault()}>
      {options.map((option, index) => <div key={option.value} id={`${controlId}-option-${index}`} role="option" data-index={index}
        aria-selected={selected === option.value} aria-disabled={option.disabled || undefined} data-active={active === index}
        onPointerMove={event => !option.disabled && (event.movementX || event.movementY) && setActive(index)} onClick={() => commit(index)}>
        <span>{option.label}</span>{selected === option.value && <span aria-hidden="true">✓</span>}
      </div>)}
    </div>
    {error && <p id={`${controlId}-error`} className="ds-control-error" role="alert">{error}</p>}
  </div>;
}
