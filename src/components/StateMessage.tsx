import type { ReactNode } from "react";
import "./StateMessage.css";

type Props = {
  variant: "empty" | "error";
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
};

export function StateMessage({
  variant,
  title,
  description,
  actionLabel,
  onAction,
  icon,
}: Props) {
  return (
    <div
      className="table-card state"
      role={variant === "error" ? "alert" : "status"}
    >
      <div className={`state__icon state__icon--${variant}`} aria-hidden="true">
        {icon}
      </div>
      <h2 className="state__title">{title}</h2>
      {description && <p className="state__text">{description}</p>}
      {actionLabel && onAction && (
        <button type="button" className="btn-outline" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}