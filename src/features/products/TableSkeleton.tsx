import "./TableSkeleton.css";

type Props = {
  rows?: number;
};

export function TableSkeleton({ rows = 10 }: Props) {
  return (
    <div
      className="table-card skeleton"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="visually-hidden">Məhsullar yüklənir</span>
      {Array.from({ length: rows }, (_, i) => (
        <div className="skeleton__row" key={i} aria-hidden="true">
          <div className="skeleton__name">
            <span className="skeleton__bar skeleton__bar--title" />
            <span className="skeleton__bar skeleton__bar--sub" />
          </div>
          <span className="skeleton__bar skeleton__bar--chip" />
          <span className="skeleton__bar skeleton__bar--price" />
          <span className="skeleton__bar skeleton__bar--status" />
        </div>
      ))}
    </div>
  );
}