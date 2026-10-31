import { useEffect } from "react";
import "./Toast.css";

type Props = {
  message: string | null;
  variant?: "error" | "success";
  onClose: () => void;
  duration?: number;
};

export function Toast({
  message,
  variant = "error",
  onClose,
  duration = 5000,
}: Props) {
  useEffect(() => {
    if (!message) return;
    const id = setTimeout(onClose, duration);
    return () => clearTimeout(id);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div
      className={`toast toast--${variant}`}
      role={variant === "error" ? "alert" : "status"}
    >
      <span className="toast__text">{message}</span>
      <button
        type="button"
        className="toast__close"
        aria-label="Bağla"
        onClick={onClose}
      >
        ×
      </button>
    </div>
  );
}