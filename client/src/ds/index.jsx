/* Restauro design-system React components.
   Styling lives in styles/restauro.css (ported from the handoff). */
import Icon from "./Icon";

export { default as Icon } from "./Icon";

const cx = (...c) => c.filter(Boolean).join(" ");

/* ---- Button ------------------------------------------------- */
export function Button({
  children, variant = "primary", size = "md", block = false,
  disabled = false, type = "button", startIcon, endIcon, className = "", ...rest
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={cx("rst-btn", `rst-btn--${variant}`, variant !== "link" && `rst-btn--${size}`, block && "rst-btn--block", className)}
      {...rest}
    >
      {startIcon}
      {children}
      {endIcon}
    </button>
  );
}

/* Anchor / link-router styled as a button */
export function ButtonLink({
  children, variant = "primary", size = "md", block = false,
  startIcon, endIcon, className = "", as: As = "a", ...rest
}) {
  return (
    <As
      className={cx("rst-btn", `rst-btn--${variant}`, variant !== "link" && `rst-btn--${size}`, block && "rst-btn--block", className)}
      {...rest}
    >
      {startIcon}
      {children}
      {endIcon}
    </As>
  );
}

/* ---- IconButton --------------------------------------------- */
export function IconButton({ children, label, size = "md", variant = "ghost", disabled = false, className = "", ...rest }) {
  return (
    <button type="button" aria-label={label} disabled={disabled}
      className={cx("rst-iconbtn", `rst-iconbtn--${size}`, `rst-iconbtn--${variant}`, className)} {...rest}>
      {children}
    </button>
  );
}

/* ---- Badge -------------------------------------------------- */
export function Badge({ children, tone = "neutral", dot = false, className = "", ...rest }) {
  return <span className={cx("rst-badge", `rst-badge--${tone}`, dot && "rst-badge--dot", className)} {...rest}>{children}</span>;
}

/* ---- Eyebrow ------------------------------------------------ */
export function Eyebrow({ children, tone = "brand", rule = false, className = "", ...rest }) {
  return (
    <span className={cx("rst-eyebrow", tone !== "brand" && `rst-eyebrow--${tone}`, className)} {...rest}>
      {rule ? <span className="rst-eyebrow__line" aria-hidden="true" /> : null}
      {children}
    </span>
  );
}

/* ---- Tag ---------------------------------------------------- */
export function Tag({ children, selected = false, selectable = false, onRemove, className = "", ...rest }) {
  return (
    <span className={cx("rst-tag", selectable && "rst-tag--selectable", selected && "rst-tag--selected", className)} {...rest}>
      {children}
      {onRemove ? <button type="button" className="rst-tag__x" aria-label="Entfernen" onClick={onRemove}>×</button> : null}
    </span>
  );
}

/* ---- Fields ------------------------------------------------- */
export function Input({ label, hint, error, required = false, icon, id, className = "", ...rest }) {
  const fieldId = id || (label ? `rst-${String(label).replace(/\s+/g, "-").toLowerCase()}` : undefined);
  return (
    <div className="rst-field">
      {label ? <label className="rst-field__label" htmlFor={fieldId}>{label}{required && <span className="rst-field__req">*</span>}</label> : null}
      <div className="rst-inputwrap">
        {icon ? <span className="rst-inputwrap__icon">{icon}</span> : null}
        <input id={fieldId} aria-invalid={error ? true : undefined}
          className={cx("rst-input", icon && "rst-input--hasicon", error && "rst-input--error", className)} {...rest} />
      </div>
      {error ? <span className="rst-field__err">{error}</span> : hint ? <span className="rst-field__hint">{hint}</span> : null}
    </div>
  );
}

export function Textarea({ label, hint, error, required = false, id, className = "", ...rest }) {
  const fieldId = id || (label ? `rst-${String(label).replace(/\s+/g, "-").toLowerCase()}` : undefined);
  return (
    <div className="rst-field">
      {label ? <label className="rst-field__label" htmlFor={fieldId}>{label}{required && <span className="rst-field__req">*</span>}</label> : null}
      <textarea id={fieldId} aria-invalid={error ? true : undefined}
        className={cx("rst-textarea", error && "rst-textarea--error", className)} {...rest} />
      {error ? <span className="rst-field__err">{error}</span> : hint ? <span className="rst-field__hint">{hint}</span> : null}
    </div>
  );
}

export function Select({ label, hint, error, required = false, options, placeholder, id, className = "", children, ...rest }) {
  const fieldId = id || (label ? `rst-${String(label).replace(/\s+/g, "-").toLowerCase()}` : undefined);
  return (
    <div className="rst-field">
      {label ? <label className="rst-field__label" htmlFor={fieldId}>{label}{required && <span className="rst-field__req">*</span>}</label> : null}
      <div className="rst-selectwrap">
        <select id={fieldId} className={cx("rst-select", className)} {...rest}>
          {placeholder ? <option value="" disabled>{placeholder}</option> : null}
          {options ? options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>) : children}
        </select>
        <span className="rst-selectwrap__chev" aria-hidden="true">▾</span>
      </div>
      {error ? <span className="rst-field__err">{error}</span> : hint ? <span className="rst-field__hint">{hint}</span> : null}
    </div>
  );
}

/* ---- Card --------------------------------------------------- */
export function Card({ children, variant = "outline", padding = "md", interactive = false, className = "", ...rest }) {
  return (
    <div className={cx("rst-card", `rst-card--${variant}`, interactive && "rst-card--interactive",
      padding === "sm" ? "rst-card__pad-sm" : padding === "lg" ? "rst-card__pad-lg" : "", className)} {...rest}>
      {padding === "none" ? children : <div className="rst-card__body">{children}</div>}
    </div>
  );
}

/* ---- Plate (warm placeholder) ------------------------------- */
export function Plate({ ratio = "4/5", tone = 0, label, radius, className = "", style }) {
  return (
    <div className={cx("rst-plate", `rst-plate--t${tone % 4}`, className)}
      style={{ aspectRatio: ratio, borderRadius: radius, ...style }}>
      {label ? <span className="rst-plate__label">{label}</span> : null}
    </div>
  );
}

/* ---- WorkCard ----------------------------------------------- */
export function WorkCard({ image, title = "Ohne Titel", artist, refId, status, meta, price, className = "", ...rest }) {
  return (
    <article className={cx("rst-work", className)} {...rest}>
      <div className="rst-work__media">
        {image ? (typeof image === "string" ? <img src={image} alt={title} /> : image) : <div className="rst-work__ph">{refId || "RESTAURO"}</div>}
        {status ? <div className="rst-work__status">{status}</div> : null}
      </div>
      <div className="rst-work__body">
        {refId ? <div className="rst-work__eyebrow">{refId}</div> : null}
        <h3 className="rst-work__title">{title}</h3>
        {artist ? <div className="rst-work__artist">{artist}</div> : null}
        {(meta || price) ? (
          <div className="rst-work__foot">
            {meta ? <span className="rst-work__meta">{meta}</span> : <span />}
            {price ? <span className="rst-work__price">{price}</span> : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}

/* ---- Tabs --------------------------------------------------- */
export function Tabs({ items = [], value, defaultValue, onChange, className = "", ...rest }) {
  return (
    <div className={cx("rst-tabs", className)} role="tablist" {...rest}>
      {items.map((it) => (
        <button key={it.value} type="button" role="tab" aria-selected={value === it.value}
          className={cx("rst-tab", value === it.value && "rst-tab--active")} onClick={() => onChange && onChange(it.value)}>
          {it.label}
          {it.count != null ? <span className="rst-tab__count">{it.count}</span> : null}
        </button>
      ))}
    </div>
  );
}

/* ---- Breadcrumbs -------------------------------------------- */
export function Breadcrumbs({ items = [], separator = "/", className = "", ...rest }) {
  return (
    <nav className={cx("rst-crumbs", className)} aria-label="Breadcrumb" {...rest}>
      {items.map((it, i) => {
        const last = i === items.length - 1;
        return (
          <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            {last
              ? <span className="rst-crumbs__item rst-crumbs__current" aria-current="page">{it.label}</span>
              : it.onClick
                ? <a onClick={it.onClick}>{it.label}</a>
                : <span className="rst-crumbs__item">{it.label}</span>}
            {!last ? <span className="rst-crumbs__sep" aria-hidden="true">{separator}</span> : null}
          </span>
        );
      })}
    </nav>
  );
}

/* ---- Dialog ------------------------------------------------- */
import { useEffect } from "react";
export function Dialog({ open, onClose, title, children, footer, className = "" }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape" && onClose) onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="rst-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget && onClose) onClose(); }}>
      <div className={cx("rst-dialog", className)} role="dialog" aria-modal="true">
        {title ? (
          <div className="rst-dialog__head">
            <h2 className="rst-dialog__title">{title}</h2>
            {onClose ? <button type="button" className="rst-dialog__x" aria-label="Schließen" onClick={onClose}>×</button> : null}
          </div>
        ) : null}
        {children ? <div className="rst-dialog__body">{children}</div> : null}
        {footer ? <div className="rst-dialog__foot">{footer}</div> : null}
      </div>
    </div>
  );
}

/* ---- ProgressBar -------------------------------------------- */
export function ProgressBar({ value = 0, size = "md", done = false }) {
  const isDone = done || value >= 100;
  return (
    <div className={cx("rst-progress", size === "sm" && "rst-progress--sm")}>
      <div className={cx("rst-progress__fill", isDone && "rst-progress__fill--done")} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}

/* ---- Stepper (numbered, horizontal) ------------------------- */
export function Stepper({ steps = [], current = 0 }) {
  return (
    <div className="rst-stepper">
      {steps.map((label, i) => {
        const state = i < current ? "done" : i === current ? "active" : "todo";
        return (
          <span key={label} style={{ display: "inline-flex", alignItems: "center" }}>
            <span className={cx("rst-stepper__step", `rst-stepper__step--${state}`)}>
              <span className="rst-stepper__dot">{state === "done" ? <Icon name="check" size={15} /> : i + 1}</span>
              <span className="rst-stepper__label">{label}</span>
            </span>
            {i < steps.length - 1 ? <span className="rst-stepper__bar" /> : null}
          </span>
        );
      })}
    </div>
  );
}
