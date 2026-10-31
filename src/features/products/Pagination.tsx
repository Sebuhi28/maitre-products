import "./Pagination.css";

type Props = {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
};

type Item = number | "gap-left" | "gap-right";

function getItems(current: number, totalPages: number): Item[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const wanted = new Set<number>([1, totalPages, current - 1, current, current + 1]);
  if (current <= 3) {
    wanted.add(2);
    wanted.add(3);
  }
  if (current >= totalPages - 2) {
    wanted.add(totalPages - 1);
    wanted.add(totalPages - 2);
  }

  const sorted = [...wanted]
    .filter((n) => n >= 1 && n <= totalPages)
    .sort((a, b) => a - b);

  const items: Item[] = [];
  sorted.forEach((n, i) => {
    if (i > 0 && n - sorted[i - 1] > 1) {
      items.push(i === 1 ? "gap-left" : "gap-right");
    }
    items.push(n);
  });
  return items;
}

export function Pagination({ page, pageSize, total, onPageChange }: Props) {
  if (total === 0) return null;

  const totalPages = Math.ceil(total / pageSize);
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className="pagination">
      <p className="pagination__info">
        {from}-{to} / {total} məhsul
      </p>

      <nav className="pagination__nav" aria-label="Səhifələmə">
        <button
          type="button"
          className="page-btn"
          disabled={page === 1}
          aria-label="Əvvəlki səhifə"
          onClick={() => onPageChange(page - 1)}
        >
          ‹
        </button>

        {getItems(page, totalPages).map((item) =>
          typeof item === "number" ? (
            <button
              key={item}
              type="button"
              className={`page-btn ${item === page ? "page-btn--active" : ""}`}
              aria-current={item === page ? "page" : undefined}
              onClick={() => onPageChange(item)}
            >
              {item}
            </button>
          ) : (
            <span key={item} className="page-gap" aria-hidden="true">
              ...
            </span>
          )
        )}

        <button
          type="button"
          className="page-btn"
          disabled={page === totalPages}
          aria-label="Növbəti səhifə"
          onClick={() => onPageChange(page + 1)}
        >
          ›
        </button>
      </nav>
    </div>
  );
}